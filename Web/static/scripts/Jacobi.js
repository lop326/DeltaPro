function crearTabla() {
    const n = parseInt(document.getElementById('tamano').value);
    const contenedor = document.getElementById('tablaInputs');
    contenedor.innerHTML = '';
  
    for (let i = 0; i < n; i++) {
      let fila = document.createElement('div');
      fila.className = 'fila';
  
      for (let j = 0; j < n; j++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `a_${i}_${j}`;
        input.step = 'any';
        input.placeholder = `a${i+1}${j+1}`;
        fila.appendChild(input);
      }
  
      const igual = document.createElement('label');
      igual.innerText = '=';
      fila.appendChild(igual);
  
      const inputB = document.createElement('input');
      inputB.type = 'number';
      inputB.id = `b_${i}`;
      inputB.step = 'any';
      inputB.placeholder = `b${i+1}`;
      fila.appendChild(inputB);
  
      contenedor.appendChild(fila);
    }
  }
  function obtenerDatos() {
    const n = parseInt(document.getElementById('tamano').value);
    let A = [], B = [];

    for (let i = 0; i < n; i++) {
        let fila = [];
        for (let j = 0; j < n; j++) {
            const val = document.getElementById(`a_${i}_${j}`).value;
            fila.push(parseFloat(val) || 0);
        }
        A.push(fila);

        const bVal = document.getElementById(`b_${i}`).value;
        B.push(parseFloat(bVal) || 0);
    }

    const error = document.getElementById("error").value;
    return { A, B, error };
}



// === VALIDACIONES ===


function esDiagonalDominante(A) {
    for (let i = 0; i < A.length; i++) {
        let suma = 0;
        for (let j = 0; j < A.length; j++) {
            if (j !== i) suma += Math.abs(A[i][j]);
        }
        if (Math.abs(A[i][i]) <= suma) return false;
    }
    return true;
}

function esMatrizNumerica(A) {
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A[i].length; j++) {
            if (isNaN(parseFloat(A[i][j]))) {
                throw new Error(`Elemento no numérico en la matriz A en la posición (${i + 1}, ${j + 1}): '${A[i][j]}'`);
            }
        }
    }
    return true;
}

function esVectorNumerico(b) {
    for (let i = 0; i < b.length; i++) {
        if (isNaN(parseFloat(b[i]))) {
            throw new Error(`Elemento no numérico en el vector b en la posición (${i + 1}): '${b[i]}'`);
        }
    }
    return true;
}

function esErrorValido(error) {
    let num = parseFloat(error);
    if (isNaN(num) || num <= 0) {
        throw new Error(`❌ El error debe ser un valor numérico positivo (mayor que 0)\n` +
            `   ➤ Ejemplos válidos: 1e-5, 0.001, "0.0001"\n` +
            `   ➤ Ejemplos inválidos: "cero", -0.01, null`);
    }
    return true;
}

// === MÉTODO DE JACOBI ===

function metodoJacobi(A, b, error, continuarSiNoDominante = false) {
    esMatrizNumerica(A);
    esVectorNumerico(b);
    esErrorValido(error);

    A = A.map(fila => fila.map(Number));
    b = b.map(Number);
    error = parseFloat(error);

    const n = A.length;
    if (!A.every(fila => fila.length === n)) throw new Error("La matriz A no es cuadrada.");
    if (b.length !== n) throw new Error("El tamaño del vector b no coincide con las dimensiones de A.");
    if (A.some((fila, i) => fila[i] === 0)) throw new Error("La matriz A contiene ceros en su diagonal.");

    let maxIter = null;
    if (!esDiagonalDominante(A)) {
        if (!continuarSiNoDominante) throw new Error("⚠️ La matriz no es diagonalmente dominante.");
        maxIter = 1000;
    }

    let xAnterior = Array(n).fill(0);
    let iteraciones = 0;
    let errorPrevio = Infinity;
    const historial = [];

    while (true) {
        let nuevoX = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            let suma = 0;
            for (let j = 0; j < n; j++) {
                if (j !== i) suma += A[i][j] * xAnterior[j];
            }
            nuevoX[i] = (b[i] - suma) / A[i][i];
        }

        let err = Math.max(...nuevoX.map((val, idx) => Math.abs(val - xAnterior[idx])));
        historial.push({
            iter: iteraciones,
            error: err,
            vector: [...nuevoX]
        });

        if (err < error) return { solucion: nuevoX, iteraciones, historial, mensaje: "✅ Convergencia alcanzada." };
        if (maxIter !== null && iteraciones >= maxIter) return { solucion: nuevoX, iteraciones, historial, mensaje: `❌ Límite de ${maxIter} iteraciones alcanzado.` };
        if (iteraciones > 1 && Math.abs(errorPrevio - err) < 1e-10) return { solucion: nuevoX, iteraciones, historial, mensaje: "⚠️ El error no disminuye significativamente." };

        xAnterior = [...nuevoX];
        iteraciones++;
        errorPrevio = err;
    }
}

// === MANEJO DEL FORMULARIO EN LA WEB ===

document.getElementById("jacobi-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const salida = document.getElementById("resultado");
    salida.textContent = ""; // Limpiar resultados previos

    try {
        // Llamar a la función obtenerDatos para obtener los valores de A, B y el error
        const { A, B, error } = obtenerDatos();

        // Llamada a la función metodoJacobi
        const resultado = metodoJacobi(A, B, error);

        salida.style.display = "block"; // Mostrar div de resultados

        // Mostrar mensaje general (éxito o advertencia)
        salida.innerHTML += `<p><strong>${resultado.mensaje}</strong></p><br>`;

        // Mostrar las iteraciones
        resultado.historial.forEach(i => {
            salida.innerHTML += `
                <p>Iteración ${i.iter.toString().padStart(3)} | Error: ${i.error.toExponential(2)} | 
                x = [${i.vector.map(v => v.toFixed(6)).join(", ")}]</p>
            `;
        });

        // Mostrar la solución final
        salida.innerHTML += `<p>✅ Solución encontrada en ${resultado.iteraciones} iteraciones:</p>`;
        resultado.solucion.forEach((val, i) => {
            salida.innerHTML += `<p>x${i + 1} = ${val.toFixed(6)}</p>`;
        });
    } catch (err) {
        salida.style.display = "block";
        salida.textContent = `❌ Error: ${err.message}`;
    }
});


//FUNCION PARA EL BOTON LIMPIAR
function limpiarR() {
    // Limpiar todos los inputs generados de la matriz A y vector B
    const inputs = document.querySelectorAll('#tablaInputs input');
    inputs.forEach(input => input.value = '');

    // Limpiar campo de error
    document.getElementById("error").value = "";

    // Limpiar comentario
    document.getElementById("comentario").value = "";

    // Limpiar resultado
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "";
}

//FUNCION PARA EL BOTON CALCULAR
function Calcular() {
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.textContent = ""; // Limpiar resultados previos

    try {
        const { A, B, error } = obtenerDatos();
        const resultado = metodoJacobi(A, B, error);

        resultadoDiv.style.display = "block";

        resultadoDiv.innerHTML += `<p><strong>${resultado.mensaje}</strong></p><br>`;

        let lineaIteraciones = resultado.historial.map(i => {
            return `Iter ${i.iter} (err: ${i.error.toExponential(2)}) x=[${i.vector.map(v => v.toFixed(4)).join(", ")}]`;
        }).join(" | ");
        
        resultadoDiv.innerHTML += `<p>${lineaIteraciones}</p><br>`;
        

        resultadoDiv.innerHTML += `<p>✅ Solución encontrada en ${resultado.iteraciones} iteraciones:</p>`;
        resultado.solucion.forEach((val, i) => {
            resultadoDiv.innerHTML += `<p>x${i + 1} = ${val.toFixed(6)}</p>`;
        });

    } catch (e) {
        resultadoDiv.style.display = "block";
        resultadoDiv.textContent = `❌ Error: ${e.message}`;
    }
}
// Crear la tabla al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    crearTabla();
});
