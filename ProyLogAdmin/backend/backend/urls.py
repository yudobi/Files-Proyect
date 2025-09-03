"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# En tu archivo urls.py principal
from django.http import JsonResponse
from django.conf import settings
import cloudinary
import cloudinary.uploader

def cloudinary_diagnostic(request):
    try:
        # Probar subida a Cloudinary
        test_upload = cloudinary.uploader.upload(
            "https://res.cloudinary.com/demo/image/upload/w_100/docs/cloudinary_logo.png",
            folder="test_diagnostic"
        )
        upload_success = True
        upload_url = test_upload['url']
    except Exception as e:
        upload_success = False
        upload_error = str(e)
    
    return JsonResponse({
        'debug': settings.DEBUG,
        'cloud_name': settings.CLOUDINARY_STORAGE.get('CLOUD_NAME'),
        'api_key_configured': bool(settings.CLOUDINARY_STORAGE.get('API_KEY')),
        'api_secret_configured': bool(settings.CLOUDINARY_STORAGE.get('API_SECRET')),
        'default_storage': settings.DEFAULT_FILE_STORAGE,
        'cloudinary_upload_test': {
            'success': upload_success,
            'url': upload_url if upload_success else None,
            'error': upload_error if not upload_success else None
        }
    })



from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

from django.http import HttpResponse

def home(request):
    return HttpResponse("Servidor Django en Render funcionando 🚀")

urlpatterns = [
    path('', home),   # <- ruta raíz
    path('admin/', admin.site.urls),
    path('api/', include('tienda.urls')),  # Changed from 'tienda' to 'store' for consistency
    # Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # login endpoint
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # token refresh endpoint
    path('diagnostic/', cloudinary_diagnostic, name='cloudinary_diagnostic'),
]

# If in DEBUG mode, add routes to serve static and media files
# This is useful for development but not recommended in production
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)