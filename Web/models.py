from django.db import models
from django.contrib.auth.models import User

class CodigoCliente(models.Model):
    codigo = models.CharField(max_length=10, unique=True)
    dni = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.codigo
    

class DatosUsuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Relación con el usuario
    codigo_cliente = models.OneToOneField(CodigoCliente, on_delete=models.CASCADE)  # Relación con el código de empleado
    dni = models.CharField(max_length=10)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=15)
    imagen = models.ImageField(upload_to='perfiles/', null=True, blank=True)


    def __str__(self):
        return self.user.username


