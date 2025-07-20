
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

########################################################################
# Serializer for user validation and registration
# This serializer is used to create new users and return a JWT token
########################################################################

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user

    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)
        return {
            'id': instance.id,
            'username': instance.username,
            'email': instance.email,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }



########################################################################
# Serializer for Categoria model
# This serializer is used to serialize and deserialize Product model instances
########################################################################
from .models import CategoriaImagen
class CategoriaImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaImagen
        fields = ['id', 'category', 'image', 'order']

########################################################################
# Serializer for Categoria model
# This serializer is used to serialize and deserialize Product model instances
########################################################################
from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    cantidad_de_productos = serializers.IntegerField(read_only=True)
    #images = CategoriaImagenSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'cantidad_de_productos']
########################################################################
# Serializer for Product model
# This serializer is used to serialize and deserialize Product model instances
########################################################################


from .models import Product, ProductImage, Brand

#-----------------------------------------------------------------
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'order','product']
#-----------------------------------------------------------------
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'logo']
#-----------------------------------------------------------------
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    brand = BrandSerializer(read_only=True)
    brand_id = serializers.PrimaryKeyRelatedField(  # Para crear el producto (solo ID)
        queryset=Brand.objects.all(),
        source='brand',
        write_only=True
    )
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), 
        source='category',
        write_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description',
            'original_price', 'discount', 'price',
            'stock', 'category','category_id', 'featured', 'category_deal',
            'brand', 'images','brand_id'
        ]
        extra_kwargs = {
            'price': {'required': False, 'read_only': True}  # Marca el campo como no requerido y solo lectura
        }
#-----------------------------------------------------------------
########################################################################
# Serializer for Servicio model
# This serializer is used to serialize and deserialize Product model instances
########################################################################
from .models import Servicio, ServicioImagen

class ServicioImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicioImagen
        fields = ['id', 'service', 'image', 'order']

class ServicioSerializer(serializers.ModelSerializer):
    images = ServicioImagenSerializer(many=True, read_only=True)

    class Meta:
        model = Servicio
        fields = ['id', 'nombreServicio', 'descripcion', 'precio', 'images', 'descuento', 'precioOriginal']
        extra_kwargs = {
            'precio': {'required': False, 'read_only': True},  # Marca el campo como no requerido y solo lectura
            'precioOriginal': {'required': True,}
        }


