import os
import django

# Initialize Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# Check if user exists
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superuser 'admin' created successfully.")
else:
    # Reset password if it exists
    user = User.objects.get(username='admin')
    user.set_password('admin123')
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print("User 'admin' password reset to 'admin123'.")
