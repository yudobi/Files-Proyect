# tienda/signals.py
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import ServicioImagen , Servicio

@receiver(post_delete, sender=ServicioImagen)
def eliminar_imagen_servicio(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(save=False)

# 🔸 Esta señal se activa cuando se borra un Servicio
@receiver(post_delete, sender=Servicio)
def eliminar_imagenes_del_servicio(sender, instance, **kwargs):
    imagenes = ServicioImagen.objects.filter(service=instance)
    for imagen in imagenes:
        if imagen.image:
            imagen.image.delete(save=False)
        imagen.delete()
