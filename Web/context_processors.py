from .models import DatosUsuario

def user_data(request):
    if request.user.is_authenticated:
        try:
            datos = DatosUsuario.objects.get(user=request.user)
            return {'user_data': datos}
        except DatosUsuario.DoesNotExist:
            return {}
    return {}