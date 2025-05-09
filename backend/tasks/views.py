from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework_simplejwt.tokens import AccessToken
from tasks.models import Task
from tasks.models import Tag
from tasks.models import TaskTag
from users.models import User
import google.generativeai as genai
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from dateutil import parser
from django.utils.timezone import make_aware, is_naive

"""
conf de la api key de gemini para hacer la inferencia
"""

model = genai.GenerativeModel("gemini-2.0-flash")
genai.configure(api_key="AIzaSyCH_CVlqllzqiXjlJcFLHIfwle0TUz_qoc")

# Create your views here.



#  crear una tarea
@csrf_exempt
@permission_classes([IsAuthenticated])
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
        
        
        # Validar que la fecha sea posterior a la actual


        date_formatted = parser.parse(end_date)


        if is_naive(date_formatted):
            date_formatted = make_aware(date_formatted)

        date_formatted = date_formatted.strftime('%Y-%m-%d %H:%M:%S')
        
        if date_formatted < datetime.now().strftime('%Y-%m-%d %H:%M:%S'):
            return JsonResponse({'error': 'La fecha debe ser posterior a la actual'}, status=400)
        
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
        

        # Crear la tarea
        task = Task(title=title, description=description, start_date=start_date, end_date=end_date, status='pending', user=user)
        task.save()
        for tag_id in tags:
            try:
                tag = Tag.objects.get(id=tag_id)  

                print(tag)
                taskTag = TaskTag(task=task, tag=tag)
                taskTag.save()  
            except Tag.DoesNotExist:
                return JsonResponse({'error': f'La etiqueta con ID {tag_id} no existe'}, status=400)


        # Devolver datos en json
        return JsonResponse({
            'message': 'Tarea creada correctamente',
            }, status=201)
    except Exception as e:
        return JsonResponse({'error': f'Error al crear la tarea: {str(e)}'}, status=500)

# listar todas tus tareas

def get_tasks(request):
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
        
        if not user or user.is_anonymous:
            return JsonResponse({'error': 'Usuario no autenticado'}, status=401)
        
        try:
            tasks = Task.objects.filter(user=user)
            result = []
            for task in tasks:
                tags = TaskTag.objects.filter(task=task)
                array_tags = []
                for tag in tags:
                    tag_id = tag.tag.id
                    tag_name = tag.tag.name
                    tag_color = tag.tag.color
                    array_tags.append({
                        'id' : tag_id,
                        'name': tag_name,
                        'color': tag_color,
                    })
                result.append({
                    'id': task.id,
                    'title': task.title,
                    'description': task.description,
                    'start_date': task.start_date,
                    'end_date': task.end_date,
                    'status': task.status,
                    'tags': array_tags,
                })
                
            return JsonResponse(result, status=200, safe=False)
        except Exception as e:
            return JsonResponse({'error': f'Error al obtener las tareas: {str(e)}'}, status=500)

    except Exception as e:
        return JsonResponse({'error': f'Error al obtener las tareas: {str(e)}'}, status=500)
# actualizar una tarea

@csrf_exempt
@permission_classes([IsAuthenticated])
def update_task(request):
    if request.method != 'PUT':
        return JsonResponse({'error': 'El unico método permitido es PUT'}, status=405)
    try:
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
        
        if not user or user.is_anonymous:
            return JsonResponse({'error': 'Usuario no autenticado'}, status=401)
        

        data = json.loads(request.body)
        title = data.get('title')
        description = data.get('description')
        start_date =  datetime.now().strftime('%Y-%m-%d')
        end_date = data.get('end_date')
        tags = data.get('tags')
        id = data.get('id')

        if not title or not description or not end_date or not id:
            return JsonResponse({'error': 'Faltan datos obligatorios'}, status=400)
        

        # Validar que la fecha sea posterior a la actual
        date_formatted = parser.parse(end_date)
        if is_naive(date_formatted):
            date_formatted = make_aware(date_formatted)

        date_formatted = date_formatted.strftime('%Y-%m-%d %H:%M:%S')
        
        if date_formatted < datetime.now().strftime('%Y-%m-%d %H:%M:%S'):
            return JsonResponse({'error': 'La fecha debe ser posterior a la actual'}, status=400)

        try:
            task = Task.objects.get(id=id)
            task.title = title
            task.description = description
            task.start_date = start_date
            task.end_date = end_date
            task.save()
            taskTag = TaskTag.objects.filter(task=task)
            taskTag.delete()
            for tag_id in tags:
                try:
                    tag = Tag.objects.get(id=tag_id)  
                    taskTag = TaskTag(task=task, tag=tag)
                    taskTag.save()  
                except Tag.DoesNotExist:
                    return JsonResponse({'error': f'La etiqueta con ID {tag_id} no existe'}, status=400)
                except TaskTag.DoesNotExist:    
                    taskTag = TaskTag(task=task, tag=tag)
                    taskTag.save()
                
            return JsonResponse({'message': 'Tarea actualizada correctamente'}, status=200)

        except Exception as e:
            return JsonResponse({'error': f'Error al actualizar la tarea: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'Error al actualizar la tarea: {str(e)}'}, status=500)




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
            result = []
            for task in tasks:
                tags = TaskTag.objects.filter(task=task)
                array_tags = []
                for tag in tags:
                    tag_name = tag.tag.name
                    tag_color = tag.tag.color
                    array_tags.append({
                        'name': tag_name,
                        'color': tag_color,
                    })
                result.append({
                    'id': task.id,
                    'title': task.title,
                    'description': task.description,
                    'start_date': task.start_date,
                    'end_date': task.end_date,
                    'status': task.status,
                    'tags': array_tags,
                })
        except Exception as e:
            return JsonResponse({'error': f'Error al obtener las tareas: {str(e)}'}, status=500)


        prompt = f"""
                Eres un sistema de recomendación de tareas. Devuelve exactamente 4 tareas como máximo en formato JSON estricto. 
                Formato obligatorio:
                [
                {{
                    "titulo": "string",
                    "descripcion": "string",
                    "categoria": [
                    {{"name": "string", "color": "hex"}}
                    ]
                }}
                ]
                NO debes escribir mas que el contenido interno de los json. Si no encuentras nada devuelve las tareas con algo como nada por aqui de momento
                Tareas: {result}
            """



        try:

        # Inferencia a gemini
            response = model.generate_content(prompt)
            result = response.text
            print(result)
        except Exception as e:
            return JsonResponse({'error': f'Error al realizar la inferencia: {str(e)}'}, status=500)

        #devolver resultados en json
        return JsonResponse({
            'message': result,
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': f'Error al obtener las recomendaciones: {str(e)}'}, status=500)



@csrf_exempt
@permission_classes([IsAuthenticated])
def get_tags(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET requests allowed'}, status=405)
    try:
        tags = Tag.objects.all()
        result = []
        for tag in tags:
            result.append({
                'id': tag.id,
                'name': tag.name,
                'color': tag.color,
            })

        print(result)

        return JsonResponse(result, status=200, safe=False)

    except Exception as e:
        return JsonResponse({'error-message': str(e)}, status=500)

# eliminar task
@csrf_exempt
@permission_classes([IsAuthenticated])
def delete_task(request, id):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'El único método permitido es DELETE'}, status=405)

    try:
        task = Task.objects.get(id=id)
        
        task_tags = TaskTag.objects.filter(task=task)
        for tag in task_tags:
            tag.delete()

        task.delete()

        return JsonResponse({'message': 'Tarea eliminada correctamente'}, status=200)

    except Task.DoesNotExist:
        return JsonResponse({'error': 'La tarea no existe'}, status=404)
    except Exception as e:
        return JsonResponse({'error': f'Error al eliminar la tarea: {str(e)}'}, status=500)


# crear recordatorio via email


