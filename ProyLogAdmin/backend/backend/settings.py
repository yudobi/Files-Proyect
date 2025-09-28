from pathlib import Path
from dotenv import load_dotenv
import os
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

################################################
load_dotenv()

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-fallback-key-for-development')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False') == 'True'


ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
if not ALLOWED_HOSTS[0]:
    ALLOWED_HOSTS = []

# Agregar después de ALLOWED_HOSTS
CSRF_TRUSTED_ORIGINS = os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(',')
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in CSRF_TRUSTED_ORIGINS if origin.strip()]

# Si no hay valores en la variable de entorno, usar estos por defecto
if not CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS = [
        "https://*.onrender.com",
        "http://localhost:5173",
        "http://localhost:5174",
    ]

################################################

# Add Render host
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)


# Database configuration
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}
""" SE USA PARA CONECTAR A LA BASE DE DATOS DE RENDER EJEMPLO Y CREAR UN SUPERUSUARIO
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postgresql_ccox',
        'USER': 'postgresql_ccox_user',
        'PASSWORD': 'zjIVAb9IIkQoMsO1SM0iEF7h9XvtqJzP',
        'HOST': 'dpg-d2kbsdbe5dus7392n6mg-a.oregon-postgres.render.com',
        'PORT':'5432',
    }
}   
"""
# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Configuración adicional
WHITENOISE_MAX_AGE = 315360000
WHITENOISE_IMMUTABLE_FILE_TEST = lambda path, url: url.startswith('/static/')


# Configuración de AWS S3 para archivos media
################################################################################################


AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'us-east-2')
AWS_S3_SIGNATURE_VERSION = 's3v4'

# Opcional: URLs públicas limpias sin query string
AWS_QUERYSTRING_AUTH = False

# Evitar que se apliquen ACLs por defecto
AWS_DEFAULT_ACL = None

# Cache control para mejorar performance
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}

# URL base de los archivos media
MEDIA_URL = f'https://{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com/'

# Usa s3 para almacenamiento de archivos en producción
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'


################################################################################################

# CORS configuration for production
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
# Filtrar elementos vacíos por si hay comas extras
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ALLOWED_ORIGINS if origin.strip()]

# Después de CORS_ALLOWED_ORIGINS, añade:
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Solo permitir todos en desarrollo



    # Security settings for production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    ##################
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
     ##################
    'authentication',
    'tienda',
    #'django_extensions',
    'storages',
    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    ##################
    "corsheaders.middleware.CorsMiddleware",
    #################
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]



# Configuración de tokens
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
       #  'rest_framework.authentication.TokenAuthentication',
       #  'rest_framework.authentication.SessionAuthentication',  
       'rest_framework_simplejwt.authentication.JWTAuthentication', # Autenticación JWT
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Solo usuarios logueados
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '30/minute',  # Límite para no autenticados
        'user': '100/minute',  # Límite para autenticados
    },

      # Añade estas configuraciones para la paginación
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,  # Tamaño de página por defecto
    
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),   # ⏱️ Access token válido por 60 minutos
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),      # 🔄 Refresh token válido por 7 días

    # Opcional: otros ajustes útiles
    #'ROTATE_REFRESH_TOKENS': False,
    #'BLACKLIST_AFTER_ROTATION': True,
    #'AUTH_HEADER_TYPES': ('Bearer',),
}
######################################################


ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True






DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# settings.py
# Añade estas configuraciones
SECURE_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 10,  # Mejor a 10 caracteres mínimo
        }
    },
    # Otros validadores...
]





############################################################################# Agrega esto al final de settings.py

# AL FINAL de settings.py agrega:
from storages.backends.s3boto3 import S3Boto3Storage
import django.core.files.storage

# Sobrescribe el storage por defecto
django.core.files.storage.default_storage = S3Boto3Storage()

# Verificación
print(f"Storage configurado: {DEFAULT_FILE_STORAGE}")
print(f"Storage actual: {django.core.files.storage.default_storage.__class__}")