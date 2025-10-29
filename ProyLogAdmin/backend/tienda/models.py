from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import os
from django.utils import timezone
##############################################################################################################################
# Categorias imagenes
##############################################################################################################################



def categoria_image_path(instance, filename):
    return os.path.join('categorias', str(instance.category.id), filename)

class CategoriaImagen(models.Model):
    category = models.ForeignKey('Category', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField('Image', upload_to=categoria_image_path)
    order = models.PositiveIntegerField('Order', default=0)

    class Meta:
        verbose_name = 'Category image'
        verbose_name_plural = 'Category images'
        ordering = ['order']

    def __str__(self):
        return f"Image {self.id} of {self.category.name}"

##############################################################################################################################
# Categorias
##############################################################################################################################
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categorias/', null=True, blank=True)

    @property
    def cantidad_de_productos(self):
        return self.products.count()

    def __str__(self):
        return self.name

##############################################################################################################################
#  Parte de los productos
##############################################################################################################################
class Brand(models.Model):
    name = models.CharField('Brand name', max_length=100, unique=True)
    logo = models.ImageField('Brand logo', upload_to='brands/logos/')

    class Meta:
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'

    def __str__(self):
        return self.name

class Product(models.Model):
    
    
    ORIGINS = (
        ('USA', 'United States'),
        ('JPN', 'Japan'),
        ('GER', 'Germany'),
        ('KOR', 'South Korea'),
        ('CHN', 'China'),
    )
    
    title = models.CharField('Title', max_length=200)
    description = models.TextField('Description')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, related_name='products', blank=True, null=True)
    origin = models.CharField('Origin', max_length=3, choices=ORIGINS, default='USA')
    original_price = models.DecimalField('Original price', max_digits=8, decimal_places=2)
    discount = models.PositiveIntegerField('Discount (%)', validators=[MinValueValidator(0), MaxValueValidator(100)], default=0)
    price = models.DecimalField('Discounted price', max_digits=8, decimal_places=2)
    stock = models.PositiveIntegerField('Stock quantity', default=0)
    featured = models.BooleanField('Featured product', default=False)
    category_deal = models.BooleanField('Category deal', default=False)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, related_name='products')  # 👈 clave nueva
    
    created_at = models.DateTimeField('Creation date', auto_now_add=True)
    updated_at = models.DateTimeField('Last update', auto_now=True)
    
    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-featured', '-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
      if self.discount > 0:
        self.price = self.original_price * (100 - self.discount) / 100
      else:
        self.price = self.original_price
    # Asegura que price tenga un valor incluso si original_price es None
      if self.price is None:
        self.price = 0.00
      super().save(*args, **kwargs)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField('Image', upload_to='products/images/')
    order = models.PositiveIntegerField('Order', default=0)

    class Meta:
        verbose_name = 'Product image'
        verbose_name_plural = 'Product images'
        ordering = ['order']

    def __str__(self):
        return f"Image {self.id} of {self.product.title}"
#-------------------------------------------------------------------------------------------------------
##############################################################################################################################
# Parte de los Servicios
##############################################################################################################################
class Servicio(models.Model):
    nombreServicio = models.CharField(max_length=200)
    precioOriginal = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.PositiveIntegerField('Discount (%)',default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    caracteristicas = models.JSONField(default=dict)  # Mejor manejo de valores por defecto

    created_at = models.DateTimeField('Creation date', auto_now_add=True)
    updated_at = models.DateTimeField('Last update', auto_now=True)

    class Meta:
        verbose_name = "Servicio"
        verbose_name_plural = "Servicios"
    
    def __str__(self):
        return self.nombreServicio
    
    def save(self, *args, **kwargs):
      if self.descuento > 0:
        self.precio = self.precioOriginal * (100 - self.descuento) / 100
      else:
        self.precio = self.precioOriginal
    # Asegura que price tenga un valor incluso si original_price es None
      if self.precio is None:
        self.precio = 0.00
      super().save(*args, **kwargs)

#-------------------------------------------------------------------------------------------------------
def servicio_image_path(instance, filename):
    return os.path.join('servicios', str(instance.id), filename)

class ServicioImagen(models.Model):
    service = models.ForeignKey(Servicio, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField('Image', upload_to=servicio_image_path)
    order = models.PositiveIntegerField('Order', default=0)

    class Meta:
        verbose_name = 'Servicio image'
        verbose_name_plural = 'Servicio images'
        ordering = ['order']

    def __str__(self):
        return f"Image {self.id} of {self.servicio.nombreServicio}"
##############################################################################################################################
# Parte de las Ordenes
##############################################################################################################################
class Order(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pendiente'),
        ('COMPLETED', 'Completado'),
        ('FAILED', 'Fallido'),
    ]

    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    address = models.TextField()
    payment_method = models.CharField(max_length=50, default='PayPal')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    paypal_order_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    @property
    def total_amount(self):
        # Suma el precio de todos los productos en la orden
        return sum(item.subtotal for item in self.items.all())

    def __str__(self):
        return f"Orden #{self.id} - {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)  # proteger para no borrar productos comprados
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=8, decimal_places=2)  # precio al momento de la compra

    @property
    def subtotal(self):
        return self.price_at_purchase * self.quantity
