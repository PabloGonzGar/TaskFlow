# Documentación TaskFlow Automate

Proyecto final del ciclo formativo de Desarrollo de Aplicaciones Web (DAW) — IES Martínez Montañés
<br> Pablo Segundo González García

---

## Índice

1. [Introducción](#1-introducción)
2. [Análisis de Requisitos](#2-análisis-de-requisitos)
3. [Diseño del Sistema](#3-diseño-del-sistema)
4. [Desarrollo](#4-desarrollo)
5. [Anexos](#5-anexos)

---

## 1. Introducción

TaskFlow es una aplicación web desarrollada como proyecto de fin de grado. Tiene como objetivo la gestión de tareas tanto a nivel personal como laboral, ofreciendo funciones inteligentes de recomendación y paneles de administración.

Se divide en tres módulos principales para el usuario:

* **Dashboard / Recomendaciones**: muestra las 4 tareas más prioritarias mediante IA (API de Google Gemini 2.0 Flash).
* **Tareas**: permite gestionar las tareas (crear, editar, eliminar, completar).
* **Estadísticas**: ofrece una visualización gráfica de tareas (completadas, pendientes, incompletas).

Para administradores:

* **Dashboard**: resumen de tareas de todos los usuarios.
* **Usuarios**: listado y eliminación de usuarios.
* **Configuración**: gestión de categorías de tareas.

---

## 2. Análisis de Requisitos

### Requisitos Funcionales

**Usuarios:**

* CRUD de tareas
* Recomendaciones por IA
* Estadísticas personalizadas
* Personalización visual de la interfaz

**Administradores:**

* Gestión de usuarios
* Estadísticas globales
* CRUD de categorías

### Requisitos No Funcionales

* Seguridad en el acceso
* Interfaz intuitiva
* Navegación clara con indicación de ubicación

---

## 3. Diseño del Sistema

### Arquitectura

Modelo cliente-servidor desacoplado (SPA):

* **Cliente:** Angular 19 desplegado en Vercel
* **Servidor:** Django + Django Rest Framework con autenticación JWT, desplegado en Render

### Tecnologías

* **Frontend:** Angular 19, Tailwind CSS v3
* **Backend:** Django + DRF, Simple JWT, API Gemini 2.0 Flash
* **Base de Datos:** MySQL (desarrollo), PostgreSQL (producción vía Render)

---

## 4. Desarrollo

### Integraciones

* **Google Generative AI**: para priorización de tareas vía IA
* **Django Rest Framework**: creación de la API REST
* **ng2-charts**: representación gráfica de estadísticas

### Personalización de interfaz

* Cambios de tema guardados en Local Storage

### Despliegue

* **Frontend:** Vercel (auto despliegue vía GitHub)
* **Backend y BD:** Render (PostgreSQL, servicios web)

---

## 5. Anexos

### Modelos de Base de Datos (Django ORM)

```python
class User(AbstractBaseUser, PermissionsMixin):
    ROL_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=200)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELD = 'name'   

    def __str__(self):
        return self.name

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=50)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

```

### Diseño de base de datos

Realizado en Draw\.io, implementado mediante migraciones desde modelos en Django ORM.

![image](https://github.com/user-attachments/assets/64158226-b613-48f3-9eb6-98c7341cebe8)

---

**IES Martínez Montañés – Desarrollo de Aplicaciones Web – Pablo Segundo González García**
