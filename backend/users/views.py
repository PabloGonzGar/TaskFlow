from users.models import User
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from tasks.models import Task
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework_simplejwt.tokens import AccessToken
from tasks.models import Task
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import make_aware, is_naive




'''-------------------------------------------------------LOGICA DE NEGOCIO DE USUARIOS --------------------------------------------------- '''

# funcion para el registro de usuarios
@csrf_exempt
def user_register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'El unico metodo permitido es POST'}, status=405)

    # Obtener datos del formulario
    data = json.loads(request.body)
    email = data.get('email','').strip()
    name = data.get('name')
    password = data.get('password')

    # Validar el formato del email y la password
    try:
        validate_email(email)
    except ValidationError as e:
        return JsonResponse({'error': f'Email no valido: {str(e)}'}, status=400)
    
    try:
        # Validar password
        validate_password(password)
    except ValidationError as e:
        return JsonResponse({'error': f'Password no valida:  {str(e)}'}, status=400)
    
    # Validar que el nombre no este vacío
    if not name:
        return JsonResponse({'error': 'El nombre es obligatorio'}, status=400)

    # Verificar si el usuario ya existe
    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Este email ya esta registrado'}, status=400)

    # Crear el usuario
    try:
        user = User.objects.create_user(email=email, password=password, name=name)
        user.save()

        # Generar el token de acceso 
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        #Devuelve  algo en json
        return JsonResponse({
            'message': 'Usuario creado con exito',
            'user':{
                'id': user.id,
                'email': email,
                'name': name
            },
            'access_token': access_token,
            'refresh_token': refresh_token
        }, status=201)
    
    except Exception as e:
        return JsonResponse({'error': f'Error al crear el usuario: {str(e)}'}, status=500)

    


#Funcion de login-------------------------------------------------------------------------------------------------------------

@csrf_exempt
def user_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'El unico metodo permitido es POST'}, status=405)

        #Obtener datos del formulario
    try:
        data = json.loads(request.body)
        email = data.get('email','').strip()
        password = data.get('password')
    except Exception as e:  
        return JsonResponse({'error': f'Error al obtener los datos del formulario: {str(e)}'}, status=500)


    #Comprobar que el email y la password no esten vacios
    if email and password:
        #Validar el formato del email y la password 
        try:
            validate_email(email)
        except ValidationError as e:
            return JsonResponse({'error': f'Email no valido'}, status=400)
        
        
        
        #Verificar si el usuario existe y la password es correcta
        if User.objects.filter(email=email).exists() and User.objects.get(email=email).check_password(password):
                
            #Sacar al usuario
            user = User.objects.get(email=email)

            #Generar el token de acceso
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            print(user.is_superuser)

            #Devolver codigo success 200
            return JsonResponse({
                'message': 'Se ha iniciado sesion correctamente',
                'user':{
                    'id': user.id,
                    'email': email,
                    'name': user.name,
                    'is_admin': user.is_superuser
                },
                'access_token': access_token,
                'refresh_token': refresh_token
            },status=200)

                
        else:
            return JsonResponse({'error': 'Email o password incorrecto'}, status=400)

    else:
        return JsonResponse({'error': 'Email y password son obligatorios'}, status=400)
    
    


#Funcion de logout


@csrf_exempt
def user_logout(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'El unico metodo permitido es POST'}, status=405)
    
    data = json.loads(request.body)
    refresh_token = data.get('refresh_token')

    if not refresh_token:
        return JsonResponse({'error': 'Falta el token de refresco'}, status=400)

    try:
        token =  RefreshToken(refresh_token)
        token.blacklist()
    except Exception as e:
        return JsonResponse({'error': f'Error al revocar el token de refresco: {str(e)}'}, status=500)

    return JsonResponse({'message': 'Token de refresco revocado'}, status=200)



def refresh_token(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Metodo no permitido'}, status=405)

    try:
        data = json.loads(request.body)
        refresh_token = data.get('refresh_token')

        if not refresh_token:
            return JsonResponse({'error': 'Falta el token de refresco'}, status=400)

        token = RefreshToken(refresh_token)
        user_id = token['user_id']
        user = User.objects.get(id=user_id) 

        token.blacklist()

        new_access_token = str(AccessToken.for_user(user))
        new_refresh_token = str(RefreshToken.for_user(user))

        return JsonResponse({   
            'message': 'Token de acceso actualizado',
            'access_token': new_access_token,
            'refresh_token': new_refresh_token
        }, status=200)

    except TokenError:
        return JsonResponse({'error': 'Token invalido o expirado'}, status=401)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'error': f'Error al refrescar el token: {str(e)}'}, status=500)

#Mostrar las estadísticas del usuario
@csrf_exempt
@permission_classes([IsAuthenticated])
def show_user_stats(request):
    if request.method != 'GET': 
        return JsonResponse({'error': 'El unico ,metodo permitido es GET'}, status=405)

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
        

        total_tasks = Task.objects.filter(user=user)
        completed_tasks = Task.objects.filter(user=user, status='completed')
        pending_tasks = Task.objects.filter(user=user, status='pending')
        uncompleted_tasks = Task.objects.filter(user=user, status='uncompleted')
        
        result = {
            'total_tasks': total_tasks.count(),
            'completed_tasks': completed_tasks.count(),
            'pending_tasks': pending_tasks.count(),
            'uncompleted_tasks': uncompleted_tasks.count(),
        }   


        return JsonResponse(result, status=200)

    except Exception as e:
        return JsonResponse({'error': f'Ha ocurrido algun errror: {str(e)}'}, status=401)

''' --------------------------------------------------- LOGICA DE NEGOCIO DE ADMINISTRADORES ----------------------------------------------------------------- '''


''' DEJAR PARA LO ULTIMO '''

#Crear un nuevo usuario (solo si eres superuser)

#Funcion de actualizar un usuario (solo si eres superuser)

#Funcion de eliminar un usuario (solo si eres superuser)

#Funcion de obtener el numero de usuarios registrados