import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings") 
django.setup()


User = get_user_model()

username = "admin"
password = "admin123"
email = "admin@gmail.com"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print("Superusuario creado")
else:
    print("El superusuario ya existe")
