import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
users = User.objects.all()
if users.exists():
    print("EXISTING USERS:")
    for u in users:
        print(f" - {u.username} (Staff: {u.is_staff})")
else:
    print("NO USERS FOUND.")
