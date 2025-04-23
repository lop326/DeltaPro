function toggleEdit(icon) {
    const container = icon.parentElement;
    const span = container.querySelector('.display-text');
    const input = container.querySelector('.editable-input');

    if (input.style.display === 'none' || input.style.display === '') {
        span.style.display = 'none';
        input.style.display = 'block';
        input.focus();
    } else {
        span.style.display = 'inline-block';
        input.style.display = 'none';
    }
}
function guardarDatos() {
const fields = document.querySelectorAll('.field');
fields.forEach(field => {
    const input = field.querySelector('.editable-input');
    const span = field.querySelector('.display-text');
    
    if (input && span) {
        // Mostrar el input y ocultar el texto
        input.style.display = 'block';
        span.style.display = 'none';
    }
});

// Enviar el formulario manualmente
document.getElementById('mi-formulario').submit();
alert('datos actualizados')


}
