import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  
django.setup()

from tasks.models import Tag  
from django.core.exceptions import ObjectDoesNotExist

tags_data = [
    {'name': 'Urgente', 'color': '#FF5733'},
    {'name': 'Trabajo', 'color': '#FFC300'},
    {'name': 'Salud', 'color': '#4CAF50'},
    {'name': 'Personal', 'color': "#0062FF"},
    {'name': 'Finanzas', 'color': '#F71639'},
    {'name': 'Deporte', 'color': '#5556FK'},
]

for tag_data in tags_data:
    tag_name = tag_data['name']
    tag_color = tag_data['color']

    tag, created = Tag.objects.get_or_create(name=tag_name, defaults={'color': tag_color})

    if created:
        print(f"TAG CREADA'")
    else:
        print(f"YA EXISTE ESTE")
