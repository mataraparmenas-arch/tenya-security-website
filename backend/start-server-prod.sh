#!/bin/bash
set -e

echo "Running migrations..."
python3 manage.py migrate --noinput

# Free hosting tiers have no shell access. With CREATE_DEFAULT_ADMIN=true the
# first admin is created from env vars: DJANGO_SUPERUSER_EMAIL,
# DJANGO_SUPERUSER_PASSWORD (required the first time). Remove/flip the flag to
# false afterwards.
if [ "$CREATE_DEFAULT_ADMIN" = "true" ]; then
python3 manage.py shell <<'PY'
import os
from users.models import User
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(
        email=email,
        password=os.environ["DJANGO_SUPERUSER_PASSWORD"],
        role=getattr(User, "ADMIN", "ADMIN"),
    )
    print(f"Default admin created: {email}")
else:
    print(f"Admin already exists: {email}")
PY
fi

echo "Collecting static files..."
python3 manage.py collectstatic --noinput

echo "Starting gunicorn..."
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WEB_CONCURRENCY:-3} \
    --access-logfile -
