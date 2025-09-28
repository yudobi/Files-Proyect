from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product, ProductImage, Brand ,Category , CategoriaImagen
from .serializers import RegisterSerializer, ProductSerializer, BrandSerializer ,CategorySerializer ,ProductImageSerializer ,CategoriaImagenSerializer ,Servicio , ServicioSerializer
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.decorators import api_view, parser_classes  # 👈 Import agregado
from rest_framework.parsers import MultiPartParser, FormParser  # 👈 Import agregado

from django.db import transaction

########################################################################
# View for user registration
# This view is used to register new users and return a JWT token
########################################################################

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
########################################################################
# Vistas para paginacion
# Estas vistas manejan la paginación de los productos
########################################################################  
from rest_framework.pagination import PageNumberPagination

class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'total_items': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'next_page': self.get_next_link(),
            'previous_page': self.get_previous_link(),
            'items_per_page': self.get_page_size(self.request),
            'products': data  # Aquí van los productos serializados
        })

########################################################################
# View for Product model
# This view handles CRUD operations for the Product model
########################################################################

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = ProductPagination  # Añade esta línea

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]






# views.py - Modifica tu BrandViewSet
# views.py - Modifica tu BrandViewSet
class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        print("=== 🎯 BRAND CREATE - FRONTEND REQUEST ===")
        
        # Debug de autenticación
        print(f"🔐 User: {request.user}")
        print(f"🔐 Authenticated: {request.user.is_authenticated}")
        print(f"🔐 Auth header: {request.headers.get('Authorization')}")
        
        # Debug completo de la request
        print(f"🌐 Method: {request.method}")
        print(f"🌐 Content-Type: {request.content_type}")
        print(f"🌐 Path: {request.path}")
        
        # Debug de datos y archivos
        print("📦 Request DATA keys:", list(request.data.keys()))
        print("📦 Request FILES keys:", list(request.FILES.keys()))
        
        for key, value in request.data.items():
            if hasattr(value, 'name'):  # Es un archivo
                print(f"📁 {key}: {value.name} ({value.size} bytes)")
            else:
                print(f"📝 {key}: {value}")
        
        for key, file in request.FILES.items():
            print(f"📂 {key}: {file.name} ({file.size} bytes, {file.content_type})")
        
        # Debug del serializer
        print("=== 🔄 SERIALIZER PROCESSING ===")
        serializer = self.get_serializer(data=request.data)
        print(f"Serializer data: {serializer.initial_data}")
        print(f"Serializer valid: {serializer.is_valid()}")
        
        if not serializer.is_valid():
            print(f"❌ Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=400)
        
        # Procesar la creación
        try:
            brand = serializer.save()
            print(f"✅ Brand created: {brand.name}")
            print(f"✅ Logo: {brand.logo.name if brand.logo else 'None'}")
            print(f"✅ Logo URL: {brand.logo.url if brand.logo else 'None'}")
            
            return Response(serializer.data, status=201)
            
        except Exception as e:
            print(f"❌ Error saving brand: {e}")
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)
    

    def create(self, request, *args, **kwargs):
        print("=== 🔍 FRONTEND vs POSTMAN DEBUG ===")
        
        # Identificar origen
        origin = request.META.get('HTTP_ORIGIN', '')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        if 'localhost' in origin or '5173' in origin:
            print("🌐 Request from: FRONTEND")
        else:
            print("🌐 Request from: POSTMAN")
        
        # Debug crítico de la estructura de datos
        print(f"📦 request.data keys: {list(request.data.keys())}")
        print(f"📁 request.FILES keys: {list(request.FILES.keys())}")
        
        # Debug profundo de DONDE está el archivo
        if 'logo' in request.data:
            logo_in_data = request.data['logo']
            print(f"❌ Logo in DATA: {type(logo_in_data)} - {getattr(logo_in_data, 'name', 'No name')}")
        
        if 'logo' in request.FILES:
            logo_in_files = request.FILES['logo']
            print(f"✅ Logo in FILES: {logo_in_files.name} ({logo_in_files.size} bytes)")
        
        # Esto es importante para el serializer
        print("🔍 Serializer initial data:")
        print(f"  name: {request.data.get('name', 'Not found')}")
        print(f"  logo present: {'logo' in request.data}")
        
        return super().create(request, *args, **kwargs)


# ================================
# ENDPOINT ESPEJO PARA DEBUG
# ================================
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def mirror_request(request):
    """
    Endpoint espejo que devuelve EXACTAMENTE lo que recibe
    Útil para debug de requests desde frontend vs postman
    """
    print("=== 🪞 MIRROR REQUEST DEBUG ===")
    print(f"🔍 Request received from: {request.META.get('HTTP_ORIGIN', 'Unknown')}")
    print(f"🔍 User: {request.user} (Authenticated: {request.user.is_authenticated})")
    print(f"🔍 Content-Type: {request.content_type}")
    
    # Prepara los datos para la respuesta
    response_data = {
        'request_info': {
            'method': request.method,
            'content_type': request.content_type,
            'path': request.path,
            'origin': request.META.get('HTTP_ORIGIN'),
            'user_agent': request.META.get('HTTP_USER_AGENT'),
        },
        'authentication': {
            'user': str(request.user),
            'is_authenticated': request.user.is_authenticated,
            'auth_header': request.META.get('HTTP_AUTHORIZATION'),
        },
        'data_received': {},
        'files_received': {}
    }
    
    # Datos del formulario
    for key, value in request.data.items():
        if hasattr(value, 'name'):  # Es un archivo que fue puesto en data
            response_data['data_received'][key] = {
                'type': 'file_in_data',
                'name': value.name,
                'size': value.size,
                'content_type': getattr(value, 'content_type', 'unknown')
            }
        else:
            response_data['data_received'][key] = {
                'type': 'regular_data',
                'value': value
            }
    
    # Archivos (FILES)
    for key, file_obj in request.FILES.items():
        response_data['files_received'][key] = {
            'name': file_obj.name,
            'size': file_obj.size,
            'content_type': file_obj.content_type,
            'charset': getattr(file_obj, 'charset', 'unknown')
        }
    
    # Headers (solo los relevantes)
    headers_debug = {}
    for header in ['Content-Type', 'Authorization', 'Origin', 'User-Agent', 'X-CSRFToken']:
        if header in request.META:
            headers_debug[header] = request.META[header]
        elif f'HTTP_{header.upper()}' in request.META:
            headers_debug[header] = request.META[f'HTTP_{header.upper()}']
    
    response_data['headers'] = headers_debug
    
    # Debug en consola del servidor
    print(f"📦 Data keys: {list(request.data.keys())}")
    print(f"📁 Files keys: {list(request.FILES.keys())}")
    print(f"🔐 Auth header: {request.META.get('HTTP_AUTHORIZATION')}")
    print(f"✅ Mirror response prepared")
    
    return Response(response_data, status=status.HTTP_200_OK)










class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)  # ← Esto permite recibir archivos

class CategoriaImagenViewSet(viewsets.ModelViewSet):
    queryset = CategoriaImagen.objects.all()
    serializer_class = CategoriaImagenSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)  # ← Esto permite recibir archivos

"""class CreateGetBrandView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # ← Esto permite recibir archivos

    def post(self, request):
        print("📩 POST received in CreateGetBrandView")

        if not request.user or request.user.is_anonymous:
            return Response({"error": "Unauthenticated user"}, status=status.HTTP_401_UNAUTHORIZED)

        name = request.data.get("name")
        if not name:
            return Response({"error": "Name is missing"}, status=status.HTTP_400_BAD_REQUEST)

        brand, created = Brand.objects.get_or_create(name=name)
        serializer = BrandSerializer(brand)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def get(self, request):
        return Response({"message": "GET working in CreateGetBrandView"})
"""
########################################################################
# Vistas para el modelo de Servicio
# Estas vistas manejan las operaciones CRUD para el modelo Servicio 
########################################################################
from .models import Servicio, ServicioImagen
from .serializers import ServicioSerializer, ServicioImagenSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    parser_classes = (MultiPartParser, FormParser)  # necesario para archivos
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        request = self.request

        print("=== DEBUG DETALLADO BACKEND ===")
        print("METHOD:", request.method)
        print("CONTENT_TYPE:", request.content_type)
        print("HEADERS:", dict(request.headers))
    
        # Verificar FILES
        print("FILES keys:", list(request.FILES.keys()))
        images = request.FILES.getlist('images')
        print(f"Número de imágenes recibidas: {len(images)}")
    
        for i, img in enumerate(images):
           print(f"Imagen {i}: name={img.name}, size={img.size}, type={img.content_type}")
    
        # Verificar POST data
        print("POST data:", dict(request.POST))
        orders = request.POST.getlist('orders[]')
        print(f"Órdenes recibidas: {orders}")
 
        images = request.FILES.getlist('images')  # toma todos los archivos con nombre 'images'
        
        orders = request.POST.getlist('orders[]')

        with transaction.atomic():
            servicio = serializer.save()  # crea el Servicio
            # crear imágenes relacionadas
            for idx, image_file in enumerate(images):
            # si existe un order enviado desde frontend, usarlo
             order = int(orders[idx]) if idx < len(orders) else idx + 1
             ServicioImagen.objects.create(
                service=servicio,
                image=image_file,
                order=order)
      

class ServicioImagenViewSet(viewsets.ModelViewSet):
    queryset = ServicioImagen.objects.all()
    serializer_class = ServicioImagenSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

