// Crear la tabla de entradas para el Método de Seidel
function crearTablaSeidel() {
    const tamano = document.getElementById('tamano').value;
    const tablaInputs = document.getElementById('tablaInputsSeidel');
    tablaInputs.innerHTML = ''; // Limpiar la tabla de entradas

    // Crear la tabla para las incógnitas (X1, X2, X3...)
    let html = '<h3>Ingrese los valores de la matriz A y el vector B:</h3>';
    html += `<table class="table table-bordered">`;
    for (let i = 0; i < tamano; i++) {
        html += '<tr>';
        for (let j = 0; j < tamano; j++) {
            html += `<td><input type="number" class="form-control" id="a${i}${j}" placeholder="A${i+1}${j+1}" required></td>`;
        }
        html += `<td><input type="number" class="form-control" id="b${i}" placeholder="B${i+1}" required></td>`;
        html += '</tr>';
    }
    html += '</table>';
    tablaInputs.innerHTML = html;
}

// Calcular la solución con el Método de Seidel
document.getElementById('seidelForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar recarga de la página

    const tamano = document.getElementById('tamano').value;
    let A = [], B = [], X = Array(tamano).fill(0); // Matriz A, Vector B, Solución X

    // Obtener los valores de A y B
    for (let i = 0; i < tamano; i++) {
        A[i] = [];
        for (let j = 0; j < tamano; j++) {
            A[i].push(parseFloat(document.getElementById(`a${i}${j}`).value));
        }
        B.push(parseFloat(document.getElementById(`b${i}`).value));
    }

    // Aplicar el método de Seidel
    let maxIterations = 100;  // Número máximo de iteraciones
    let tolerance = 0.0001;   // Tolerancia para la convergencia
    let iteration = 0;
    let error = 1;
    let Xnew = [...X]; // Inicializamos con X = 0

    while (iteration < maxIterations && error > tolerance) {
        iteration++;
        error = 0;
        
        // Iterar sobre cada incógnita
        for (let i = 0; i < tamano; i++) {
            let sum = B[i];
            for (let j = 0; j < tamano; j++) {
                if (i !== j) {
                    sum -= A[i][j] * Xnew[j];
                }
            }
            Xnew[i] = sum / A[i][i];
            
            // Calcular el error como la diferencia en las soluciones
            error = Math.max(error, Math.abs(Xnew[i] - X[i]));
        }

        // Actualizar la solución
        X = [...Xnew];

        // Mostrar el paso actual
        mostrarPasosSeidel(iteration, Xnew);
    }

    // Mostrar resultado final
    document.getElementById('resultado-seidel').innerText = `Solución: X = [${Xnew.join(', ')}]`;
    document.getElementById('resultado-seidel').style.display = 'block';
});

// Mostrar los pasos de Seidel
function mostrarPasosSeidel(iteration, Xnew) {
    document.getElementById(`paso${iteration}-seidel`).innerHTML = `Iteración ${iteration}: [${Xnew.join(', ')}]`;
    document.getElementById(`paso${iteration}-seidel`).style.display = 'block';
}

// Limpiar los resultados
function limpiarResultadosSeidel() {
    document.getElementById('resultado-seidel').style.display = 'none';
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`paso${i}-seidel`).style.display = 'none';
    }
}
