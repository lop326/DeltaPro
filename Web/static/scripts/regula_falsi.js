function regulaFalsi(f, a, b, maxIter, tolError, tolFx) {
    let fa = f(a);
    let fb = f(b);

    if (fa * fb > 0) {
        throw new Error("La función no cambia de signo en el intervalo [a, b]. Verificá que f(a) y f(b) tengan signos opuestos.");
    }

    let xrOld = a;
    let iteraciones = [];

    for (let i = 0; i < maxIter; i++) {
        fa = f(a);
        fb = f(b);

        let denominador = fa - fb;
        if (denominador === 0) {
            throw new Error("División por cero al calcular xr. Verificá la función o ajustá el intervalo.");
        }

        let xr = b - (fb * (a - b)) / denominador;
        let fxr = f(xr);

        let errorRelativo = null;
        if (i > 0) {
            errorRelativo = xr !== 0 ? Math.abs((xr - xrOld) / xr) * 100 : Infinity;
        }

        iteraciones.push({
            iteracion: i + 1,
            a: a,
            b: b,
            xr: xr.toFixed(6),
            fxr: fxr.toExponential(6),
            error: errorRelativo !== null ? errorRelativo.toFixed(6) + "%" : "N/A"
        });

        if (Math.abs(fxr) < tolFx || (errorRelativo !== null && errorRelativo < tolError)) {
            break;
        }

        if (fa * fxr < 0) {
            b = xr;
        } else {
            a = xr;
        }

        xrOld = xr;
    }

    return iteraciones;
}

function limpiarFuncion(funcStr) {
    const funciones = ['sin', 'cos', 'tan', 'exp', 'log', 'sqrt'];
    funciones.forEach(func => {
        const regex = new RegExp(`\\b${func}\\b`, 'g');
        funcStr = funcStr.replace(regex, `Math.${func}`);
    });

    // Reemplazar el símbolo π por Math.PI
    funcStr = funcStr.replace(/π/g, 'Math.PI');

    return funcStr;
}
function mostrarGrafico(f, a, b, raiz) {
    const xValues = [];
    const yValues = [];

    for (let x = a - 1; x <= b + 1; x += 0.1) {
        xValues.push(x);
        yValues.push(f(x));
    }

    const data = [
        {
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'lines',
            name: 'f(x)',
            line: { color: '#3b3737' }
        },
        {
            x: [raiz],
            y: [f(raiz)],
            type: 'scatter',
            mode: 'markers+text',
            name: 'Raíz Encontrada',
            text: [`Raíz: ${parseFloat(raiz).toFixed(6)}`],
            textposition: 'top right',
            marker: { color: '#991818', size: 10 }
        }
    ];

    const layout = {
        title: 'Gráfico de la Función con la Raíz Encontrada',
        xaxis: { title: 'x' },
        yaxis: { title: 'f(x)' },
        showlegend: true
    };

    Plotly.newPlot('grafico-regula', data, layout);
}

document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();

    const funcionStr = document.getElementById('funcion-regula').value.trim();
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const maxIter = parseInt(document.getElementById('maxIter').value, 10);
    const tolError = parseFloat(document.getElementById('tolError').value);
    const tolFx = parseFloat(document.getElementById('tolFx').value);

    if (a === b) {
        alert("⚠️ Los valores de a y b no pueden ser iguales.");
        return;
    }

    try {
        const f = new Function('x', `return ${limpiarFuncion(funcionStr)}`);
        const iteraciones = regulaFalsi(f, a, b, maxIter, tolError, tolFx);

        let resultadoHTML = "<table><tr><th>Iteración</th><th>a</th><th>b</th><th>xr</th><th>f(xr)</th><th>Error</th></tr>";
        iteraciones.forEach(iteracion => {
            resultadoHTML += `
                <tr>
                    <td>${iteracion.iteracion}</td>
                    <td>${iteracion.a}</td>
                    <td>${iteracion.b}</td>
                    <td>${iteracion.xr}</td>
                    <td>${iteracion.fxr}</td>
                    <td>${iteracion.error}</td>
                </tr>
            `;
        });
        resultadoHTML += "</table>";

        const raizFinal = iteraciones.length > 0 ? parseFloat(iteraciones[iteraciones.length - 1].xr) : NaN;

        if (isNaN(raizFinal)) {
            document.getElementById('raiz').textContent = "No se encontró solución.";
        } else {
            document.getElementById('raiz').textContent = `Raíz aproximada: ${raizFinal.toFixed(6)}`;
            mostrarGrafico(f, a, b, raizFinal);
        }

        document.getElementById('output').innerHTML = resultadoHTML;
        document.getElementById('resultados-regula').style.display = 'block';

    } catch (e) {
        alert("❌ Error: " + e.message);
    }
});
function insertar(valor) {
    const input = document.getElementById("funcion-regula");
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const texto = input.value;
  
    input.value = texto.substring(0, start) + valor + texto.substring(end);
    input.focus();
    input.selectionStart = input.selectionEnd = start + valor.length;
  }
  
function limpiar() {
    document.getElementById("funcion-regula").value = "";
  }
  
   




