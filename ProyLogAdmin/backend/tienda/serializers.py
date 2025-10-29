
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
    logo = serializers.ImageField(required=False)  # 👈 Esto permite la subida de archivos
    
    class Meta:
        model = Brand
        fields = ['id', 'name', 'logo']
    
    def create(self, validated_data):
        # Maneja la creación con el archivo
        return Brand.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        
        # Actualiza el logo si se proporciona uno nuevo
        if 'logo' in validated_data:
            instance.logo = validated_data['logo']
        
        instance.save()
        return instance
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
        fields = ['id', 'image', 'order']
       

class ServicioSerializer(serializers.ModelSerializer):
    images = ServicioImagenSerializer(many=True, read_only=True)

    class Meta:
        model = Servicio
        fields = ['id', 'nombreServicio', 'descripcion', 'precio', 'images', 'descuento', 'precioOriginal']
        extra_kwargs = {
            'precio': {'required': False, 'read_only': True},  # Marca el campo como no requerido y solo lectura
            'precioOriginal': {'required': True,}
        }
    

########################################################################
# Serializer for Order y OrderItem model
# This serializer is used to serialize and deserialize Product model instances
########################################################################
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.title', read_only=True)
    subtotal = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'quantity', 'price_at_purchase', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'customer_email', 'address',
                  'payment_method', 'payment_status', 'paypal_order_id', 'created_at', 'items', 'total_amount']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product'].id)
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item_data['quantity'],
                price_at_purchase=product.price  # guardamos el precio con descuento
            )
        return order
