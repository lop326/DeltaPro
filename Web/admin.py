from django.contrib import admin
from .models import CodigoCliente,DatosUsuario

# Register your models here.

@admin.register(CodigoCliente)
class CodigoAdmin(admin.ModelAdmin):
    #esto muestra los datos en tablas
    list_display = ('id','dni','codigo')
    #ordena los registros por id
    ordering = ('id',)
    #permite usar barra de busqueda para filtrar con el dni
    search_fields = ('dni',)
    #datos editable
    list_editable = ('codigo',)
    #campo para poder entrar a detalles
    list_display_links = ('dni',)
    #define cantidad de registros que se mostraran
    list_per_page = 8

@admin.register(DatosUsuario)
class DatosAdmin(admin.ModelAdmin):
    list_display = ('id','dni',)
    ordering = ('id',)
    search_fields = ('dni',)
    