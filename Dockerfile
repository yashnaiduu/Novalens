# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies required for OpenCV and other libs
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create a writable directory for the cache (Hugging Face requires this sometimes)
RUN mkdir -p /app/cache
ENV XDG_CACHE_HOME=/app/cache
RUN chmod -R 777 /app/cache

# Expose the port that Hugging Face Spaces expects (7860)
EXPOSE 7860

# Define environment variable
ENV PORT=7860
ENV BIND_ADDRESS=0.0.0.0

# Run app.py when the container launches
# Using gunicorn for production stability with threads for better concurrency
CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app", "--timeout", "120", "--workers", "2", "--threads", "4", "--worker-class", "gthread"]
