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
            input.placeholder = `a${i + 1}${j + 1}`;
            fila.appendChild(input);
        }

        const igual = document.createElement('label');
        igual.innerText = '=';
        fila.appendChild(igual);

        const inputB = document.createElement('input');
        inputB.type = 'number';
        inputB.id = `b_${i}`;
        inputB.step = 'any';
        inputB.placeholder = `b${i + 1}`;
        fila.appendChild(inputB);

        contenedor.appendChild(fila);
    }
}

function obtenerDatos(n) {
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
    return { A, B };
}

function mostrarMatriz(id, titulo, matriz, vector = null) {
    let html = `${titulo}\n`;
    const n = matriz.length;
    for (let i = 0; i < n; i++) {
        let fila = matriz[i].map(v => v.toFixed(2).padStart(6)).join('');
        let izq = i === 0 ? '⎡' : i === n - 1 ? '⎣' : '⎢';
        let der = i === 0 ? '⎤' : i === n - 1 ? '⎦' : '⎥';

        if (vector) {
            let v = vector[i].toFixed(2).padStart(6);
            html += `${izq}${fila} ${der}   ${izq}${v}${der}\n`;
        } else {
            html += `${izq}${fila}${der}\n`;
        }
    }
    const div = document.getElementById(id);
    div.style.display = 'block';
    div.textContent = html;
}

function pivoteAFila(A, B) {
    let AB = A.map((row, i) => [...row, B[i]]);
    let n = AB.length;

    for (let i = 0; i < n - 1; i++) {
        let max = Math.abs(AB[i][i]);
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(AB[k][i]) > max) {
                max = Math.abs(AB[k][i]);
                maxRow = k;
            }
        }
        if (maxRow !== i) {
            [AB[i], AB[maxRow]] = [AB[maxRow], AB[i]];
        }
    }

    return AB;
}

function gaussEliminaAdelante(AB, tolerancia = 1e-12) {
    let n = AB.length;
    let m = AB[0].length;

    for (let i = 0; i < n; i++) {
        let pivote = AB[i][i];
        if (Math.abs(pivote) < tolerancia) continue;

        for (let k = i + 1; k < n; k++) {
            let factor = AB[k][i] / pivote;
            for (let j = 0; j < m; j++) {
                AB[k][j] -= factor * AB[i][j];
            }
        }
    }
    return AB;
}

function eliminacionHaciaAtras(AB, precision = 5, tolerancia = 1e-15) {
    const n = AB.length;
    const m = AB[0].length;

    const ultFila = n - 1;
    const ultColumna = m - 1;

    for (let i = ultFila; i >= 0; i--) {
        const pivote = AB[i][i];
        const atras = i - 1;

        for (let k = atras; k >= 0; k--) {
            if (Math.abs(AB[k][i]) >= tolerancia) {
                const factor = AB[k][i] / pivote;

                for (let j = 0; j < m; j++) {
                    AB[k][j] -= factor * AB[i][j];
                }
            }
        }

        const diag = AB[i][i];
        for (let j = 0; j < m; j++) {
            AB[i][j] = AB[i][j] / diag;
        }
    }

    const X = AB.map(fila => parseFloat(fila[ultColumna].toFixed(precision)));

    // Redondeamos también la matriz resultante
    const matrizRedondeada = AB.map(fila =>
        fila.map(valor => parseFloat(valor.toFixed(precision)))
    );

    return {
        X: X,
        matriz: matrizRedondeada
    };
}




document.addEventListener('DOMContentLoaded', function () {
    crearTabla();

    document.getElementById('gaussForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const n = parseInt(document.getElementById('tamano').value);

        try {
            const { A, B } = obtenerDatos(n);
            mostrarMatriz('paso1', 'Matriz original A y vector B:', A, B);

            let AB = pivoteAFila(A, B);
            mostrarMatriz('paso2', 'Matriz aumentada [A|B]:', AB.map(row => row.slice(0, -1)), AB.map(row => row.at(-1)));

            AB = gaussEliminaAdelante(AB);
            mostrarMatriz('paso3', 'Matriz escalonada:', AB.map(row => row.slice(0, -1)), AB.map(row => row.at(-1)));

            
            let X = eliminacionHaciaAtras(AB);
            const resDiv = document.getElementById('resultado');
            resDiv.style.display = 'block';
            
            // Verificamos si hay valores NaN o infinitos en la solución
            const tieneValoresInvalidos = X.X.some(x => isNaN(x) || !isFinite(x));
            
            if (tieneValoresInvalidos) {
                resDiv.innerText = 'El sistema no tiene solución o tiene infinitas soluciones.';
                document.getElementById('paso4').textContent = '';
            } else {
                mostrarMatriz('paso4', 'Matriz transformada y reducida:', X.matriz.map(row => row.slice(0, -1)), X.matriz.map(row => row.at(-1)));
                resDiv.innerHTML = `Solución:\n${X.X.map((x, i) => `x${i + 1} = ${x.toFixed(4)}`).join('\n')}`;
            }
            
            

        } catch (error) {
            document.getElementById('resultado').style.display = 'block';
            document.getElementById('resultado').innerText = 'Error en el ingreso de datos.';
        }
    });
});
