from django.contrib.auth.models import User
print(f"Admin exists: {User.objects.filter(username='admin').exists()}")
