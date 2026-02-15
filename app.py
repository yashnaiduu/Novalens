import os
import jwt
from functools import wraps
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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

# Enable CORS for frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(16))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///background_remover.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', secrets.token_hex(32))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Email configuration
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')

# Initialize extensions
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

# Create tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/remove_background', methods=['POST'])
def remove_background():
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Pull out the image and settings
        image_data = data['image']
        output_format = data.get('format', 'PNG').upper()
        # Optional settings for the heavy lifting
        model_name = data.get('model', 'u2netp')
        alpha_matting = bool(data.get('alpha_matting', False))
        am_fg = int(data.get('alpha_matting_foreground_threshold', 240))
        am_bg = int(data.get('alpha_matting_background_threshold', 10))
        am_erode = int(data.get('alpha_matting_erode_structure_size', 10))
        am_base = int(data.get('alpha_matting_base_size', 1000))
        
        # Decode the base64 string
        try:
            image_bytes = base64.b64decode(image_data.split(',')[1])
            input_image = Image.open(io.BytesIO(image_bytes))
        except Exception:
             return jsonify({'error': 'Invalid image data'}), 400
        
        # Time to do the magic - remove that bg!
        output_image: Image.Image
        if True: # Rembg is usually better, so stick with it
            try:
                # Alpha matting helps with hair/fur details
                output_image = rembg_remove(
                    input_image,
                    alpha_matting=alpha_matting,
                    alpha_matting_foreground_threshold=am_fg,
                    alpha_matting_background_threshold=am_bg,
                    alpha_matting_erode_size=am_erode
                )
            except Exception as e:
                print(f"rembg crashed: {e}, attempting backup option")
                if HAS_BGREMOVER:
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
                else:
                    raise e
        
        # Export it as whatever the user asked for
        if output_format == 'JPG' or output_format == 'JPEG':
            # JPG needs a white background since it hates transparency
            white_background = Image.new('RGB', output_image.size, (255, 255, 255))
            white_background.paste(output_image, mask=output_image.split()[-1] if output_image.mode == 'RGBA' else None)
            output_image = white_background
            format_ext = 'JPEG'
        elif output_format == 'WEBP':
            format_ext = 'WEBP'
        else:
            format_ext = 'PNG'
        
        # Save to memory buffer
        output_buffer = io.BytesIO()
        output_image.save(output_buffer, format=format_ext, quality=95)
        output_buffer.seek(0)
        
        # Encode back to base64
        output_base64 = base64.b64encode(output_buffer.getvalue()).decode('utf-8')
        
        # Send it back
        result = {
            'success': True,
            'image': f'data:image/{format_ext.lower()};base64,{output_base64}',
            'format': format_ext,
            'engine': 'backgroundremover' if HAS_BGREMOVER else 'rembg',
        }
        
        return jsonify(result)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        error_msg = str(e)
        if not error_msg:
            error_msg = f"Unknown error: {type(e).__name__}"
        return jsonify({'error': error_msg}), 500

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
        
        user = User()
        user.email = email
        user.name = name
        db.session.add(user)
        db.session.commit()
        
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }, app.config['JWT_SECRET_KEY'], algorithm='HS256')
        
        # Send welcome email (optional - won't fail if email not configured)
        try:
            if app.config['MAIL_USERNAME']:
                msg = Message(
                    subject='Welcome to Background Remover!',
                    recipients=[email],
                    body=f'Hi {name or "there"},\n\nWelcome to Background Remover! You can now start removing backgrounds from your images.\n\nYou have 4 free trials remaining.\n\nBest regards,\nThe Background Remover Team'
                )
                mail.send(msg)
        except Exception as e:
            print(f"Failed to send welcome email: {e}")
        
        return jsonify({
            'user': user.to_dict(),
            'token': token
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    try:
        if not current_user.is_admin:
            return jsonify({'error': 'Access denied'}), 403
        
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/create-checkout-session', methods=['POST'])
@token_required
def create_checkout_session(current_user):
    try:
        payment = Payment()
        payment.user_id = current_user.id
        payment.stripe_payment_id = f"bmc_{secrets.token_hex(16)}"
        payment.amount = 3000  # $30 in cents
        payment.currency = 'usd'
        payment.status = 'pending'
        
        db.session.add(payment)
        db.session.commit()
        
        return jsonify({'id': payment.id, 'payment_id': payment.stripe_payment_id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/webhook', methods=['POST'])
def payment_webhook():
    try:
        data = request.get_json()
        
        payment_id = data.get('payment_id') or data.get('external_id') or data.get('id')
        amount = data.get('amount', 0)
        currency = data.get('currency', 'USD')
        status = data.get('status', 'pending')
        
        payment = None
        if payment_id:
            payment = Payment.query.filter_by(stripe_payment_id=payment_id).first()
            if not payment:
                try:
                    payment_id_int = int(payment_id.split('_')[-1]) if '_' in str(payment_id) else int(payment_id)
                    payment = Payment.query.get(payment_id_int)
                except (ValueError, TypeError):
                    pass
        
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404
        
        payment.status = status
        if amount:
            payment.amount = int(float(amount) * 100)
        payment.currency = currency.lower()
        
        if status.lower() in ['completed', 'success', 'paid']:
            user = User.query.get(payment.user_id)
            if user:
                user.is_premium = True
                user.premium_since = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payments/history', methods=['GET'])
@token_required
def get_payment_history(current_user):
    try:
        payments = Payment.query.filter_by(user_id=current_user.id).all()
        return jsonify([payment.to_dict() for payment in payments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/usage', methods=['POST'])
@token_required
def track_usage(current_user):
    try:
        data = request.get_json()
        action = data.get('action', 'background_removal')
        metadata_json = data.get('metadata_json', {})
        
        usage_record = UsageRecord()
        usage_record.user_id = current_user.id
        usage_record.action = action
        usage_record.metadata_json = metadata_json
        
        db.session.add(usage_record)
        db.session.commit()
        
        return jsonify({'status': 'success'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/usage/history', methods=['GET'])
@token_required
def get_usage(current_user):
    try:
        usage_records = UsageRecord.query.filter_by(user_id=current_user.id).all()
        return jsonify([record.to_dict() for record in usage_records])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    host = os.environ.get('BIND_ADDRESS', '0.0.0.0')
    
    app.run(debug=False, host=host, port=port)