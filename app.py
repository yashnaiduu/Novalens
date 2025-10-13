import os
import jwt
from functools import wraps
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
try:
    from backgroundremover.bg import remove as br_remove
    HAS_BGREMOVER = True
except Exception:
    HAS_BGREMOVER = False
from rembg import remove as rembg_remove
from PIL import Image
import base64
import io
from datetime import datetime, timedelta
import secrets

from models import db, User, Payment, UsageRecord

app = Flask(__name__, static_folder='public', static_url_path='')

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(16))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///background_remover.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', secrets.token_hex(32))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')

db.init_app(app)
mail = Mail(app)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/remove_background', methods=['POST'])
def remove_background():
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Get image data and format
        image_data = data['image']
        output_format = data.get('format', 'PNG').upper()
        # Optional processing params (backgroundremover)
        model_name = data.get('model', 'u2net')
        alpha_matting = bool(data.get('alpha_matting', False))
        am_fg = int(data.get('alpha_matting_foreground_threshold', 240))
        am_bg = int(data.get('alpha_matting_background_threshold', 10))
        am_erode = int(data.get('alpha_matting_erode_structure_size', 10))
        am_base = int(data.get('alpha_matting_base_size', 1000))
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        input_image = Image.open(io.BytesIO(image_bytes))
        
        # Remove background using preferred library
        output_image: Image.Image
        if HAS_BGREMOVER:
            try:
                # backgroundremover expects bytes and returns bytes (PNG with alpha)
                result_bytes = br_remove(
                    image_bytes,
                    model_name=model_name,
                    alpha_matting=alpha_matting,
                    alpha_matting_foreground_threshold=am_fg,
                    alpha_matting_background_threshold=am_bg,
                    alpha_matting_erode_structure_size=am_erode,
                    alpha_matting_base_size=am_base,
                )
                output_image = Image.open(io.BytesIO(result_bytes))
            except Exception:
                # Fallback to rembg on error
                output_image = rembg_remove(input_image)
        else:
            output_image = rembg_remove(input_image)
        
        # Convert to desired format
        if output_format == 'JPG' or output_format == 'JPEG':
            # For JPG, we need to add a white background since JPG doesn't support transparency
            white_background = Image.new('RGB', output_image.size, (255, 255, 255))
            white_background.paste(output_image, mask=output_image.split()[-1] if output_image.mode == 'RGBA' else None)
            output_image = white_background
            format_ext = 'JPEG'
        elif output_format == 'WEBP':
            format_ext = 'WEBP'
        else:
            format_ext = 'PNG'
        
        # Save to bytes
        output_buffer = io.BytesIO()
        output_image.save(output_buffer, format=format_ext, quality=95)
        output_buffer.seek(0)
        
        # Encode to base64
        output_base64 = base64.b64encode(output_buffer.getvalue()).decode('utf-8')
        
        # Return result
        result = {
            'success': True,
            'image': f'data:image/{format_ext.lower()};base64,{output_base64}',
            'format': format_ext,
            'engine': 'backgroundremover' if HAS_BGREMOVER else 'rembg',
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        name = data.get('name')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if user:
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
            }, app.config['JWT_SECRET_KEY'], algorithm='HS256')
            
            return jsonify({
                'user': user.to_dict(),
                'token': token
            }), 200
        
        user = User(email=email, name=name)
        db.session.add(user)
        db.session.commit()
        
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }, app.config['JWT_SECRET_KEY'], algorithm='HS256')
        
        try:
            msg = Message(
                subject='Welcome to Background Remover!',
                recipients=[email],
                body=f'Hi {name or "there"},\n\nWelcome to Background Remover! You can now start removing backgrounds from your images.\n\nYou have {4} free trials remaining.\n\nBest regards,\nThe Background Remover Team'
            )
            mail.send(msg)
        except Exception as e:
            print(f"Failed to send welcome email: {e}")
        
        return jsonify({
            'user': user.to_dict(),
            'token': token
        }), 201
    except ValueError as e:
        return jsonify({'error': 'Invalid data provided. Please check your input.', 'details': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Unexpected error in registration: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred during registration. Please try again.', 'details': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }, app.config['JWT_SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'user': user.to_dict(),
            'token': token
        })
    except ValueError as e:
        return jsonify({'error': 'Invalid data provided. Please check your input.', 'details': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Unexpected error in login: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred during login. Please try again.', 'details': str(e)}), 500

@app.route('/api/auth/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify(current_user.to_dict())

@app.route('/api/users/<int:user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    try:
        if current_user.id != user_id and not current_user.is_admin:
            return jsonify({'error': 'Access denied'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict())
    except ValueError as e:
        return jsonify({'error': 'Invalid user ID provided.', 'details': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Unexpected error in get_user: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred while fetching user data. Please try again.', 'details': str(e)}), 500

@app.route('/api/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    try:
        if not current_user.is_admin:
            return jsonify({'error': 'Access denied'}), 403
        
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    except ValueError as e:
        return jsonify({'error': 'Invalid data provided.', 'details': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Unexpected error in get_all_users: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred while fetching users. Please try again.', 'details': str(e)}), 500

@app.route('/api/create-checkout-session', methods=['POST'])
@token_required
def create_checkout_session(current_user):
    try:
        # Instead of creating a Stripe session, we'll create a payment record
        # with a fixed amount of $30 and mark it as pending
        payment = Payment(
            user_id=current_user.id,
            stripe_payment_id=f"bmc_{secrets.token_hex(16)}",  # Generate a unique ID for BMC
            amount=3000,  # $30 in cents
            currency='usd',
            status='pending'
        )
        
        db.session.add(payment)
        db.session.commit()
        
        # Return the payment ID which will be used to redirect to Buy Me a Coffee
        return jsonify({'id': payment.id, 'payment_id': payment.stripe_payment_id})
    except ValueError as e:
        return jsonify({'error': 'Invalid data provided for checkout.', 'details': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Unexpected error in create_checkout_session: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred while creating checkout session. Please try again.', 'details': str(e)}), 500

@app.route('/api/webhook', methods=['POST'])
def payment_webhook():
    # This endpoint is no longer needed for Stripe, but we'll keep it for potential
    # future use with Buy Me a Coffee webhooks if needed
    return jsonify({'status': 'success'})

@app.route('/api/payments/history', methods=['GET'])
@token_required
def get_payment_history(current_user):
    try:
        payments = Payment.query.filter_by(user_id=current_user.id).all()
        return jsonify([payment.to_dict() for payment in payments])
    except ValueError as e:
        return jsonify({'error': 'Invalid data provided.', 'details': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Unexpected error in get_payment_history: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred while fetching payment history. Please try again.', 'details': str(e)}), 500

@app.route('/api/usage', methods=['POST'])
@token_required
def track_usage(current_user):
    try:
        data = request.get_json()
        action = data.get('action', 'background_removal')
        metadata_json = data.get('metadata_json', {})
        
        usage_record = UsageRecord(
            user_id=current_user.id,
            action=action,
            metadata_json=metadata_json
        )
        
        db.session.add(usage_record)
        db.session.commit()
        
        return jsonify({'status': 'success'}), 201
    except ValueError as e:
        return jsonify({'error': 'Invalid data provided for usage tracking.', 'details': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Unexpected error in track_usage: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred while tracking usage. Please try again.', 'details': str(e)}), 500

@app.route('/api/usage/history', methods=['GET'])
@token_required
def get_usage(current_user):
    try:
        usage_records = UsageRecord.query.filter_by(user_id=current_user.id).all()
        return jsonify([record.to_dict() for record in usage_records])
    except ValueError as e:
        return jsonify({'error': 'Invalid data provided.', 'details': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Unexpected error in get_usage: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred while fetching usage data. Please try again.', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    host = os.environ.get('BIND_ADDRESS', '0.0.0.0')
    
    app.run(debug=False, host=host, port=port)