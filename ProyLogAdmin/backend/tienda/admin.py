from django.contrib import admin

from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Brand, Product, ProductImage

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'logo_preview')
    search_fields = ('name',)
    readonly_fields = ('logo_preview',)
    
    def logo_preview(self, obj):
        if obj.logo:
            return mark_safe(f'<img src="{obj.logo.url}" width="100" />')
        return "No image available"
    logo_preview.short_description = "Logo Preview"

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="100" />')
        return "No image available"
    image_preview.short_description = "Preview"

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ('title', 'brand', 'current_price', 'stock_status', 'featured', 'category_deal', 'category','description','origin')
    list_filter = ('category', 'origin', 'featured', 'category_deal', 'brand')
    search_fields = ('title', 'description', 'brand__name')
    list_editable = ('featured', 'category_deal')
    readonly_fields = ('current_price', 'created_at', 'updated_at', 'price_calculation')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'brand', 'category', 'origin')
        }),
        ('Pricing', {
            'fields': ('original_price', 'discount', 'current_price', 'price_calculation')
        }),
        ('Inventory', {
            'fields': ('stock',)
        }),
        ('Flags', {
            'fields': ('featured', 'category_deal')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def current_price(self, obj):
        if obj.price is None:
            return "Not calculated"
        return f"${obj.price:.2f}"
    current_price.short_description = 'Price'
    
    def stock_status(self, obj):
        return "In Stock" if obj.stock > 0 else "Out of Stock"
    stock_status.short_description = 'Stock Status'
    
    def price_calculation(self, obj):
        if obj.discount > 0:
            return f"Calculated from ${obj.original_price:.2f} - {obj.discount}% discount"
        return "No discount applied (original price)"
    price_calculation.short_description = 'Price Calculation'

    def save_model(self, request, obj, form, change):
        # Asegura el cálculo del precio antes de guardar
        if obj.discount > 0:
            obj.price = obj.original_price * (100 - obj.discount) / 100
        else:
            obj.price = obj.original_price if obj.original_price is not None else 0.00
        super().save_model(request, obj, form, change)

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_preview', 'order')
    list_editable = ('order',)
    readonly_fields = ('image_preview',)
    
    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="100" />')
        return "No image available"
    image_preview.short_description = "Preview"