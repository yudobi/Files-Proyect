from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    ProductViewSet,
    ProductImageViewSet,
    BrandViewSet,
    CreateGetBrandView,
    RegisterView,
    ServicioViewSet,
    ServicioImagenViewSet,
    CategoryViewSet,
    CategoriaImagenViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'product-images', ProductImageViewSet, basename='product-images')
router.register(r'brands', BrandViewSet, basename='brands')

router.register(r'servicios', ServicioViewSet, basename='servicios')
router.register(r'servicio-imagenes', ServicioImagenViewSet, basename='servicio-imagenes')

router.register(r'categorias', CategoryViewSet, basename='categoria')
router.register(r'categoria-imagenes', CategoriaImagenViewSet, basename='categoria-imagen')


urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),  # User registration endpoint
    path('create-brand/', CreateGetBrandView.as_view(), name='create_or_get_brand'),
]

# If in DEBUG mode, add media URL patterns
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


