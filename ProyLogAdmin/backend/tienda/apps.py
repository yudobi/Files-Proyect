# tienda/apps.py
# tienda/apps.py
from django.apps import AppConfig
import os

class TiendaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tienda'

    def ready(self):
        # Usar este approach para evitar problemas de timing
        if os.environ.get('RUN_MAIN'):
            self.registrar_señales_con_seguridad()
    
    def registrar_señales_con_seguridad(self):
        """Registra señales después de verificar que las apps están listas"""
        try:
            from django.apps import apps
            from django.db.models.signals import pre_delete
            
            # Esperar a que las apps estén completamente cargadas
            if not apps.ready:
                print("⚠️ Apps no están listas aún, reintentando...")
                import threading
                threading.Timer(0.5, self.registrar_señales_con_seguridad).start()
                return
            
            # Ahora sí importar y registrar - ¡CAMBIADO el nombre de la función!
            from .models import Brand
            from .signals import eliminar_logo_de_marca_al_borrar  # ← ¡CAMBIADO!
            
            pre_delete.connect(eliminar_logo_de_marca_al_borrar, sender=Brand)  # ← ¡CAMBIADO!
            print("🎯 Señal de eliminación de LOGO CONECTADA exitosamente")  # ← Actualizado
            
        except Exception as e:
            print(f"❌ Error en registro de señales: {e}")