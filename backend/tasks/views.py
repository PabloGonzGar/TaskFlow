from django.shortcuts import render
from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
import json
import time
from rest_framework_simplejwt.tokens import AccessToken
from tasks.models import Task
from tasks.models import Tag
from users.models import User
import google.generativeai as genai
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
"""
conf de la api key de gemini para hacer la inferencia
"""

model = genai.GenerativeModel("gemini-2.0-flash")
genai.configure(api_key="AIzaSyCH_CVlqllzqiXjlJcFLHIfwle0TUz_qoc")

# Create your views here.



#  crear una tarea
def create_task(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'El unico método permitido es POST'}, status=405)

    # Obtener datos del formulario

    try:

        data = json.loads(request.body)
        title = data.get('title')
        description = data.get('description')
        start_date =  datetime.now().strftime('%Y-%m-%d')
        end_date = data.get('end_date')
        tags = data.get('tags')

        #Validar los datos

        if not title or not description or not end_date:
            return JsonResponse({'error': 'Faltan datos obligatorios'}, status=400)
        
        # Validar el formato de la fecha

        try:
            end_date = end_date.split('-')
            end_date = f'{end_date[2]}-{end_date[1]}-{end_date[0]}'
        except Exception as e:
            return JsonResponse({'error': f'Formato de fecha incorrecto: {str(e)}'}, status=400)
        
        # Validar que la fecha sea posterior a la actual
        
        if end_date < datetime.now().strftime('%Y-%m-%d'):
            return JsonResponse({'error': 'La fecha debe ser posterior a la actual'}, status=400)
        
        for tag in tags:
            if not Task.objects.filter(title=tag).exists():
                tag_name =  tag.name
                tag_color = tag.color
                Tag.objects.create(name=tag_name, color=tag_color)
        

        # Crear la tarea 

        task = Task(title=title, description=description, start_date=start_date, end_date=end_date, status='pending', user=request.user.id)
        task.save()

        # Devolver datos en json
        return JsonResponse({
            'message': 'Tarea creada correctamente',
            }, status=201)
    except Exception as e:
        return JsonResponse({'error': f'Error al crear la tarea: {str(e)}'}, status=500)

# listar todas tus tareas


# actualizar una tarea


# eliminar una tarea


# mostrar recomendaciones haciendo inferencia a gemini 

@csrf_exempt
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    try:
        if request.method != 'GET':
            return JsonResponse({'error': 'El unico método permitido es GET'}, status=405)

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'No autorizado'}, status=401)

        token = auth_header.split(' ')[1]
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)

        except Exception as e:
            return JsonResponse({'error': f'Error al validar el token: {str(e)}'}, status=401)
        #Identificar usuario que realiza la consulta

        print(user_id)
        if not user or user.is_anonymous:
            return JsonResponse({'error': 'Usuario no autenticado'}, status=401)

        print(user)

        #Sacar datos de la base de datos 
        try:
            tasks = Task.objects.filter(user=user)
            print('tareas de usuario' + str(tasks))
        except Exception as e:
            return JsonResponse({'error': f'Error al obtener las tareas: {str(e)}'}, status=500)

        prompt = f"""
            Eres un experto de gestion y recomendacion de tareas,
            Para las siguientes tareas: {tasks}, quiero que me ayudes a hacer 
            una recomendacion por relevancia que creas mas importante y me devuelvas 5 tareas como maximo.
            devuelvemelas estrictamente en formato json y ordenadas por relevancia
            Si no encuentras ninguna recomendacion, devuelveme una lista vacia.
        """


        try:

        # Inferencia a gemini
            response = model.generate_content(prompt)
            result = response.text
        except Exception as e:
            return JsonResponse({'error': f'Error al realizar la inferencia: {str(e)}'}, status=500)

        #devolver resultados en json
        return JsonResponse({
            'message': result,
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': f'Error al obtener las recomendaciones: {str(e)}'}, status=500)






# crear recordatorio via email
