from users.models import User
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
import json

# Vista para el registro de usuarios
@csrf_exempt
def user_register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'El único método permitido es POST'}, status=405)

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
        return JsonResponse({'error': 'Este email ya está registrado'}, status=400)

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
            'message': 'Usuario creado con éxito',
            'access_token': access_token,
            'refresh_token': refresh_token
        }, status=201)
    
    except Exception as e:
        return JsonResponse({'error': f'Error al crear el usuario: {str(e)}'}, status=500)

    


#Funcion de login

@csrf_exempt
def user_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'El único método permitido es POST'}, status=405)

        #Obtener datos del formulario

    data = json.loads(request.body)
    email = data.get('email','').strip()
    password = data.get('password')

    #Comprobar que el email y la password no esten vacios
    if email and password:
        #Validar el formato del email y la password 
        try:
            validate_email(email)
        except ValidationError as e:
            return JsonResponse({'error': f'Email no valido: {str(e)}'}, status=400)
        
        try:
            validate_password(password)
        except ValidationError as e:
            return JsonResponse({'error': f'Password no valida:  {str(e)}'}, status=400)
        
        #Verificar si el usuario existe y la password es correcta
        if User.objects.filter(email=email).exists() and  User.objects.get(email=email).check_password(password):
                
            #Sacar al usuario
            user = User.objects.get(email=email)

            #Generar el token de acceso
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            #Devolver codigo success 200
            return JsonResponse({
                'message': 'Se ha iniciado sesion correctamente',
                'access_token': access_token,
                'refresh_token': refresh_token
            },status=200)
                
        else:
            return JsonResponse({'error': 'Email o password incorrecto'}, status=400)

    else:
        return JsonResponse({'error': 'Email y password son obligatorios'}, status=400)
    
    


#Funcion de logout

#Mostrar las estadísticas del usuario



''' --------------------------------------------------- LOGICA DE NEGOCIO DE ADMINISTRADORES --------------------------------------------------- '''


''' DEJAR PARA LO ULTIMO '''

#Crear un nuevo usuario (solo si eres superuser)

#Funcion de actualizar un usuario (solo si eres superuser)

#Funcion de eliminar un usuario (solo si eres superuser)

#Funcion de obtener el numero de usuarios registrados


