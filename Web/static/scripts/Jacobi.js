// ✅ Verifica si la matriz A es diagonalmente dominante
function esDiagonalDominante(A) {
    for (let i = 0; i < A.length; i++) {
        let suma = 0;
        for (let j = 0; j < A.length; j++) {
            if (j !== i) {
                suma += Math.abs(A[i][j]);
            }
        }
        if (Math.abs(A[i][i]) <= suma) {
            return false;  // No cumple con la condición de dominancia
        }
    }
    return true;
}

// ✅ Verifica si todos los elementos de la matriz son numéricos
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

// ✅ Verifica si todos los elementos del vector b son numéricos
function esVectorNumerico(b) {
    for (let i = 0; i < b.length; i++) {
        if (isNaN(parseFloat(b[i]))) {
            throw new Error(`Elemento no numérico en el vector b en la posición (${i + 1}): '${b[i]}'`);
        }
    }
    return true;
}

// ✅ Verifica si el valor del error es numérico y positivo
function esErrorValido(error) {
    let num = parseFloat(error);
    if (isNaN(num) || num <= 0) {
        throw new Error(`❌ El error debe ser un valor numérico positivo (mayor que 0)\n` +
            `   ➤ Ejemplos válidos: 1e-5, 0.001, "0.0001"\n` +
            `   ➤ Ejemplos inválidos: "cero", -0.01, null`);
    }
    return true;
}

// ✅ Método de Jacobi como tal
function metodoJacobi(A, b, error, continuarSiNoDominante = false) {
    // Validación de entradas
    esMatrizNumerica(A);
    esVectorNumerico(b);
    esErrorValido(error);

    // Convertir todos los valores a números reales
    A = A.map(fila => fila.map(Number));
    b = b.map(Number);
    error = parseFloat(error);

    const n = A.length;

    // Verifica que la matriz sea cuadrada
    if (!A.every(fila => fila.length === n)) {
        throw new Error("La matriz A no es cuadrada.");
    }

    // Verifica que b tenga dimensiones compatibles
    if (b.length !== n) {
        throw new Error("El tamaño del vector b no coincide con las dimensiones de A.");
    }

    // Verifica que no haya ceros en la diagonal
    if (A.some((fila, i) => fila[i] === 0)) {
        throw new Error("La matriz A contiene ceros en su diagonal. No se puede aplicar el método.");
    }

    // Verifica la diagonal dominante. Si no lo es, permite continuar solo si está habilitado
    let maxIter = null;
    if (!esDiagonalDominante(A)) {
        if (!continuarSiNoDominante) {
            throw new Error("⚠️ La matriz no es diagonalmente dominante.");
        }
        maxIter = 1000;  // Establece un límite si se continúa igual
    }

    // Inicializa el vector solución y otras variables
    let x = Array(n).fill(0);         // Solución actual
    let xAnterior = Array(n).fill(0); // Solución anterior
    let iteraciones = 0;
    let errorPrevio = Infinity;

    // Muestra encabezado de la tabla
    console.log("Iteración |  Error             | Vector x");
    console.log("-------------------------------------------------------------");

    // 🔁 Iteraciones del método
    while (true) {
        let nuevoX = Array(n).fill(0);

        // Recorre las filas para actualizar cada componente del vector x
        for (let i = 0; i < n; i++) {
            let suma = 0;
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    suma += A[i][j] * xAnterior[j];
                }
            }
            nuevoX[i] = (b[i] - suma) / A[i][i];  // Fórmula de Jacobi
        }

        // Calcula el error (norma infinito)
        let err = Math.max(...nuevoX.map((val, idx) => Math.abs(val - xAnterior[idx])));

        // Muestra el resultado de esta iteración
        console.log(`${iteraciones.toString().padStart(9)} | ${err.toExponential(2)}          | [${nuevoX.map(v => v.toFixed(6)).join(", ")}]`);

        // ✅ Criterio de parada: error aceptable
        if (err < error) {
            console.log("\n✅ El error se ha reducido, el método de Jacobi ha convergido correctamente.");
            return [nuevoX, iteraciones];
        }

        // ❌ Criterio de parada: demasiadas iteraciones
        if (maxIter !== null && iteraciones >= maxIter) {
            console.log(`❌ Se alcanzó el límite de ${maxIter} iteraciones. El método podría no haber convergido.`);
            return [nuevoX, iteraciones];
        }

        // ⚠️ Criterio de parada: el error no mejora significativamente
        if (iteraciones > 1 && Math.abs(errorPrevio - err) < 1e-10) {
            console.log("⚠️ El error no está disminuyendo significativamente. El método podría no estar convergiendo.");
            return [nuevoX, iteraciones];
        }

        // Prepara para la siguiente iteración
        xAnterior = [...nuevoX];
        iteraciones++;
        errorPrevio = err;
    }
}

// 🔁 Exportar las funciones para que se puedan usar desde otros archivos (por ejemplo, desde un archivo de pruebas)
module.exports = {
    metodoJacobi,
    esErrorValido
};