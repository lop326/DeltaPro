function procesarFuncion(funcionUsuario) {
    return funcionUsuario
        .replace(/\bsen\b/gi, "Math.sin")
        .replace(/\bcos\b/gi, "Math.cos")
        .replace(/\btan\b/gi, "Math.tan")
        .replace(/\blog\b/gi, "Math.log")
        .replace(/\bexp\b/gi, "Math.exp")
        .replace(/\braiz\b/gi, "Math.sqrt")
        .replace(/\babs\b/gi, "Math.abs")
        .replace(/\bpi\b/gi, "Math.PI")
        .replace(/\be\b/gi, "Math.E");
}

function secante(f, x0, x1, tolerancia = 1e-6, maxIteraciones = 100) {
    const pasos = [];
    for (let iteracion = 0; iteracion < maxIteraciones; iteracion++) {
        let f_x0 = f(x0);
        let f_x1 = f(x1);

        const denominador = f_x1 - f_x0;
        if (Math.abs(denominador) < 1e-12) {
            pasos.push("⚠️ División por número muy pequeño. Método inestable.");
            return { raiz: null, pasos };
        }

        let x2 = x1 - f_x1 * (x1 - x0) / denominador;
        const errorRel = x2 !== 0 ? Math.abs((x2 - x1) / x2) : Math.abs(x2 - x1);

        pasos.push(`Iteración ${iteracion + 1}: x = ${x2.toFixed(6)}, f(x) = ${f(x2).toExponential(2)}, error = ${errorRel.toExponential(2)}`);

        if (errorRel < tolerancia) {
            pasos.push(`✅ Raíz encontrada: ${x2}`);
            return { raiz: x2, pasos };
        }

        x0 = x1;
        x1 = x2;
    }

    pasos.push("❌ No se encontró raíz dentro de la tolerancia.");
    return { raiz: null, pasos };
}

function graficarFuncion(f, variable, raiz = null) {
    const datosX = [];
    const datosY = [];
    const rangoMin = -20;
    const rangoMax = 40;
    const pasos = 500;

    for (let i = 0; i <= pasos; i++) {
        const x = rangoMin + i * (rangoMax - rangoMin) / pasos;
        try {
            const y = f(x);
            if (!isNaN(y) && isFinite(y)) {
                datosX.push(x);
                datosY.push(y);
            } else {
                datosX.push(x);
                datosY.push(null);
            }
        } catch (e) {
            datosX.push(x);
            datosY.push(null);
        }
    }

    const trazas = [{
        x: datosX,
        y: datosY,
        mode: 'lines',
        name: `f(${variable})`,
        line: { color: '#0074D9' }
    }];

    if (raiz !== null) {
        trazas.push({
            x: [raiz],
            y: [f(raiz)],
            mode: 'markers',
            name: 'Raíz',
            marker: { size: 10, color: '#FF4136' }
        });
    }

    const layout = {
        title: 'Gráfico de f(' + variable + ')',
        xaxis: { title: variable },
        yaxis: { title: 'f(' + variable + ')' },
        showlegend: true
    };

    Plotly.newPlot('graficoFuncion', trazas, layout, { responsive: true });
}

document.getElementById('formulario').addEventListener('submit', (e) => {
    e.preventDefault();

    const variable = document.getElementById('variable').value.trim();
    const funcionInput = document.getElementById('funcion').value.trim();
    const x0Input = document.getElementById('x0').value;
    const x1Input = document.getElementById('x1').value;
    const toleranciaInput = document.getElementById('tolerancia').value;

    if (!/^[a-zA-Z]$/.test(variable)) {
        alert("⚠️ La variable debe ser una sola letra. Ejemplo: x, y, t...");
        return;
    }

    if (funcionInput === "") {
        alert("⚠️ Debes ingresar una función.");
        return;
    }

    if (funcionInput.includes("^")) {
        alert("⚠️ Usaste el símbolo '^' para potencias. Usá '**' en su lugar (Ej: x**2).");
        return;
    }

    const x0 = parseFloat(x0Input);
    const x1 = parseFloat(x1Input);
    const tolerancia = parseFloat(toleranciaInput);

    if (isNaN(x0) || isNaN(x1)) {
        alert("⚠️ x0 y x1 deben ser números válidos.");
        return;
    }

    if (x0 === x1) {
        alert("⚠️ x0 y x1 no pueden ser iguales. El método necesita dos valores distintos.");
        return;
    }

    if (isNaN(tolerancia) || tolerancia <= 0) {
        alert("⚠️ La tolerancia debe ser un número positivo.");
        return;
    }

    let funcionProcesada = procesarFuncion(funcionInput);
    let f;
    try {
        f = new Function(variable, `return ${funcionProcesada};`);
        const test = f(1);
        if (typeof test !== "number" || !isFinite(test)) throw new Error();
    } catch (error) {
        alert("⚠️ La función ingresada es inválida. Verificá la sintaxis.");
        return;
    }

    const { raiz, pasos } = secante(f, x0, x1, tolerancia);

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = pasos.map(p => `<p>${p}</p>`).join('');

    graficarFuncion(f, variable, raiz);
});