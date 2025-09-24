#!/bin/sh

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Check if the superuser exists before creating
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser("admin", "admin@gmail.com", "admin")
    print("Superuser created successfully!")
else:
    print("Superuser already exists.")
EOF

# Start the Django server
exec python manage.py runserver 0.0.0.0:8000
