import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
if User.objects.filter(username='admin').exists():
    print("User 'admin' EXISTS.")
else:
    print("User 'admin' does NOT exist.")
