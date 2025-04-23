from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import UserRegistrationForm
from .models import DatosUsuario, CodigoCliente




# Create your views here.

def registration(request):
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        if user_form.is_valid():
            # Crear un nuevo usuario pero no lo guardamos aún
            new_user = user_form.save(commit=False)
            # Establecer la contraseña
            new_user.set_password(user_form.cleaned_data['password'])
            # Guardar el nuevo usuario
            new_user.save()

            # Obtener el código de empleado
            codigo_cliente_form = CodigoCliente.objects.get(codigo=user_form.cleaned_data['codigo_cliente'])

            # Crear una entrada en DatosUsuario
            DatosUsuario.objects.create(
                user=new_user,
                codigo_cliente=codigo_cliente_form,
                dni = user_form.cleaned_data.get('dni'),
                direccion=user_form.cleaned_data.get('direccion'),
                telefono=user_form.cleaned_data.get('telefono')
            )

            # Redireccionar al login después de un registro exitoso
            return redirect('login')  # Asume que 'login' es el nombre de la vista de login

        else:
            # Si el formulario no es válido, se renderiza de nuevo el formulario con errores
            return render(request, 'register.html', {'user_form': user_form})
    
    else:
        # Si la petición no es POST, mostrar el formulario vacío
        user_form = UserRegistrationForm()
        return render(request, 'register.html', {'user_form': user_form})
    




@login_required
def home(request):
 
    return render(request, 'home.html')

@login_required
def actualizar_perfil(request):
    if request.method == 'POST':
        user = request.user
        
        user.username = request.POST.get('username')
        user.email = request.POST.get('email')
        
        user.save()
        try:
            datos = DatosUsuario.objects.get(user=request.user)

            datos.telefono = request.POST.get('telefono')
        
            datos.save()
        except DatosUsuario.DoesNotExist:
            pass
        
    return redirect(request.META.get('HTTP_REFERER', '/'))

@login_required
def nosotros(request):
    return render(request, 'nosotros.html')

@login_required
def mRaices(request):
    return render(request,'m_raices.html')
@login_required
def mSistemas(request):
    return render(request,'m_sistemas.html')
login_required
def ayuda(request):
    return render(request, 'ayuda.html')


@login_required
def gauss(request):
    return render(request, 'gauss.html')
@login_required
def gauss_jordan(request):
    return render(request, 'gauss_jordan.html')

@login_required
def gauss_seidel(request):
    return render(request,'gauss_seidel.html')

@login_required
def secante(request):
    return render(request, 'secante.html')

@login_required
def biseccion(request):
    return render(request, 'biseccion.html')

@login_required
def regula_falsi(request):
    return render(request, 'regula_falsi.html')

@login_required
def jacobi(request):
    return render(request, 'jacobi.html')

@login_required
def newton(request):
    return render(request, 'newton.html')