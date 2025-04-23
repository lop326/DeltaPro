from django import forms
from django.contrib.auth.models import User
from .models import CodigoCliente, DatosUsuario
from django.core.exceptions import ValidationError

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Repeat Password', widget=forms.PasswordInput)
    codigo_cliente = forms.CharField(label='Código de cliente', max_length=10)
    dni = forms.CharField(label='DNI', max_length=10)
    direccion = forms.CharField(label='Dirección', max_length=255, required=False)
    telefono = forms.CharField(label='Teléfono', max_length=15, required=False)

    class Meta:
        model = User
        fields = ['username', 'first_name','last_name', 'email']

    def clean(self):
        cleaned_data = super().clean()
        codigo = cleaned_data.get('codigo_cliente')
        dni = cleaned_data.get('dni')

        # Validar el código
        try:
            codigo_cliente = CodigoCliente.objects.get(codigo=codigo)
        except CodigoCliente.DoesNotExist:
            raise forms.ValidationError('El código no es válido.')

        # Validar si el DNI coincide con el código
        if codigo_cliente.dni != dni:
            raise forms.ValidationError('El DNI no coincide con el código.')

        # Validar que el DNI no esté ya registrado en DatosUsuario
        if DatosUsuario.objects.filter(dni=dni).exists():
            raise ValidationError('El DNI ya está registrado.')

        # Validar que las contraseñas coincidan
        password = cleaned_data.get('password')
        password2 = cleaned_data.get('password2')
        if password and password2 and password != password2:
            raise forms.ValidationError('Las contraseñas no coinciden.')

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])  # Guardar la contraseña encriptada
        if commit:
            user.save()
        return user
    


