function limpiarFuncion(funcStr) {
    const funciones = ['sin', 'cos', 'tan', 'exp', 'log', 'sqrt'];
    funciones.forEach(func => {
        const regex = new RegExp(`\\b${func}\\b`, 'g');
        funcStr = funcStr.replace(regex, `Math.${func}`);
    });
    return funcStr;
}

function regulaFalsi(f, a, b, maxIter, tolError, tolFx, salida) {
    let fa = f(a);
    let fb = f(b);

    if (fa * fb > 0) {
        throw new Error("La función no cambia de signo en el intervalo [a, b]. Verificá que f(a) y f(b) tengan signos opuestos.");
    }

    let xrOld = a;
    salida.innerText += `Valores iniciales: f(a)=${fa.toExponential(6)}, f(b)=${fb.toExponential(6)}\n\n`;

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

        salida.innerText += `Iteración ${i + 1}: a=${a.toFixed(6)}, b=${b.toFixed(6)}, xr=${xr.toFixed(6)}, f(xr)=${fxr.toExponential(6)}, error=${errorRelativo !== null ? errorRelativo.toFixed(6) + "%" : "N/A"}\n`;

        if (Math.abs(fxr) < tolFx || (errorRelativo !== null && errorRelativo < tolError)) {
            salida.innerText += `\n✅ Convergencia alcanzada en ${i + 1} iteraciones.\n`;
            return xr;
        }

        if (fa * fxr < 0) {
            b = xr;
        } else {
            a = xr;
        }

        xrOld = xr;
    }

    salida.innerText += `\n⚠ Máximo número de iteraciones alcanzado.\n`;
    return xrOld;
}

function resolver() {
    const funcionStr = document.getElementById("funcion").value;
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const tolError = parseFloat(document.getElementById("tolError").value);
    const tolFx = parseFloat(document.getElementById("tolFx").value);
    const maxIter = parseInt(document.getElementById("maxIter").value, 10);
    const salida = document.getElementById("salida");
    salida.innerText = "";

    if (funcionStr === "" || isNaN(a) || isNaN(b) || isNaN(tolError) || isNaN(tolFx) || isNaN(maxIter)) {
        salida.innerText = "❌ Por favor, completá todos los campos correctamente.";
        return;
    }

    if (a === b) {
        salida.innerText = "❌ Los valores de a y b no pueden ser iguales.";
        return;
    }

    try {
        const funcionLimpia = limpiarFuncion(funcionStr);
        const f = (x) => eval(funcionLimpia);
        f(1); // Validación rápida

        const raiz = regulaFalsi(f, a, b, maxIter, tolError, tolFx, salida);
        salida.innerText += `\n✅ Raíz aproximada: ${raiz.toFixed(6)}\n`;
    } catch (e) {
        salida.innerText = `❌ Error: ${e.message}`;
    }
}
