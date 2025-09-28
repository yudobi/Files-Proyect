# tienda/signals.py
from django.db.models.signals import pre_delete , post_delete
from django.dispatch import receiver
from .models import ServicioImagen , Servicio , Brand
from django.core.files.storage import default_storage
 
import logging

logger = logging.getLogger(__name__)

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

########################################################################
# tienda/signals.py
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.core.files.storage import default_storage
import logging

logger = logging.getLogger(__name__)

def eliminar_logo_de_marca_al_borrar(sender, instance, **kwargs):
    """
    Elimina automáticamente el LOGO de S3 cuando se borra una marca
    """
    print("🔥🔥🔥 SEÑAL DE LOGO ACTIVADA 🔥🔥🔥")
    print(f"📦 Marca: {instance.name}")
    print(f"🆔 ID: {instance.id}")
    
    if instance.logo:
        try:
            filename = instance.logo.name
            print(f"📁 Archivo a eliminar: {filename}")
            
            # VERIFICACIÓN EXTRA: ¿Qué storage estamos usando?
            print(f"🗃️ Storage del campo: {type(instance.logo.storage)}")
            print(f"🗃️ Storage default: {type(default_storage)}")
            print(f"🔍 Son iguales: {instance.logo.storage is default_storage}")
            
            # Usar default_storage directamente (el que sabemos que funciona)
            exists = default_storage.exists(filename)
            print(f"🔍 Existe en S3: {exists}")
            
            if exists:
                # ELIMINACIÓN DIRECTA Y CONFIRMACIÓN
                print("🔄 Eliminando con default_storage...")
                default_storage.delete(filename)
                print("✅ Comando de eliminación ejecutado")
                
                # Verificación inmediata
                still_exists = default_storage.exists(filename)
                print(f"🔍 Verificación - Logo aún existe: {still_exists}")
                
                if not still_exists:
                    print("🎉 ¡Logo eliminado exitosamente de S3!")
                else:
                    print("❌ ELIMINACIÓN FALLIDA - El logo persiste en S3")
                    print("💡 Posible causa: Permisos IAM o problema de timing")
                    
            else:
                print("⚠️ Logo no existe en S3 (quizás ya fue eliminado)")
                
        except Exception as e:
            print(f"❌ Error crítico eliminando logo: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("ℹ️ No hay logo asociado a esta marca")