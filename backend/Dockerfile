FROM python:3.13-slim

WORKDIR /app

# Prevent Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
# Prevent Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . .

# Expose the Django port
EXPOSE 8000

# Production container: migrates, collects statics, serves via gunicorn.
# For local dev run `bash start-server.sh` (Django runserver) instead.
RUN chmod +x start-server.sh start-server-prod.sh
CMD ["bash", "start-server-prod.sh"]
