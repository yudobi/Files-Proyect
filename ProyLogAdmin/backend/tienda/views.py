from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Product, ProductImage, Brand ,Category , CategoriaImagen
from .serializers import RegisterSerializer, ProductSerializer, BrandSerializer ,CategorySerializer ,ProductImageSerializer ,CategoriaImagenSerializer

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
# View for Product model
# This view handles CRUD operations for the Product model
########################################################################

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CategoriaImagenViewSet(viewsets.ModelViewSet):
    queryset = CategoriaImagen.objects.all()
    serializer_class = CategoriaImagenSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CreateGetBrandView(APIView):
    permission_classes = [IsAuthenticated]

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

########################################################################
# Vistas para el modelo de Servicio
# Estas vistas manejan las operaciones CRUD para el modelo Servicio 
########################################################################
from .models import Servicio, ServicioImagen
from .serializers import ServicioSerializer, ServicioImagenSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ServicioImagenViewSet(viewsets.ModelViewSet):
    queryset = ServicioImagen.objects.all()
    serializer_class = ServicioImagenSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

   