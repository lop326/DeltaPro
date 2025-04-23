function traducirFuncion(func) {
    return func
        
        .replace(/sen/g, "sin")
        .replace(/ln/g, "log")
        .replace(/π/g, "pi")
        .replace(/raiz/g, "sqrt");
        
}

function insertarFuncion(simbolo) {
    const input = document.getElementById("funcion");
    const cursorPos = input.selectionStart;
    const textBefore = input.value.substring(0, cursorPos);
    const textAfter = input.value.substring(cursorPos);
    input.value = textBefore + simbolo + textAfter;
    input.focus();
    input.selectionEnd = cursorPos + simbolo.length;
}

function limpiarFuncion() {
    document.getElementById("funcion").value = "";
}

function encontrarRaiz() {
    let expr = document.getElementById("funcion").value;
    let a = parseFloat(document.getElementById("a").value);
    let b = parseFloat(document.getElementById("b").value);
    const resultDiv = document.getElementById("result");
    const errorDiv = document.getElementById("error");
    const logDiv = document.getElementById("log");

    resultDiv.style.display = "none";
    errorDiv.style.display = "none";
    logDiv.innerText = "";

    expr = traducirFuncion(expr);

    let f;
    try {
        f = math.compile(expr);
        f.evaluate({ x: a });
    } catch (e) {
        errorDiv.innerText = "La función ingresada no es válida.";
        errorDiv.style.display = "block";
        return;
    }

    let fa = f.evaluate({ x: a });
    let fb = f.evaluate({ x: b });

    if (fa * fb > 0) {
        errorDiv.innerHTML = `
            No hay cambio de signo entre <strong>a</strong> y <strong>b</strong>, por lo tanto 
            <strong>no se puede aplicar el método de bisección</strong>.<br>
            La condición <code>f(a) * f(b) &lt; 0</code> no se cumple.<br>
            f(a) = ${fa.toFixed(4)}, f(b) = ${fb.toFixed(4)}
        `;
        errorDiv.style.display = "block";
        return;
    }

    let iter = 0;
    const maxIter = 100;
    const tol = 1e-6;
    let c, fc, log = "";

    while (iter < maxIter) {
        c = (a + b) / 2;
        fc = f.evaluate({ x: c });
        log += `Iteración ${iter + 1}: a=${a}, b=${b}, c=${c}, f(c)=${fc}\n`;

        if (Math.abs(fc) < tol || (b - a) / 2 < tol) {
            break;
        }

        if (fa * fc < 0) {
            b = c;
            fb = fc;
        } else {
            a = c;
            fa = fc;
        }

        iter++;
    }

    if (Math.abs(fc) < tol) {
        resultDiv.innerText = `Raíz encontrada: ${c.toFixed(6)}`;
        resultDiv.style.display = "block";
        logDiv.innerText = log;
        dibujarGrafico(expr, a, b, c);
    } else {
        errorDiv.innerText = "No se pudo encontrar la raíz dentro del número máximo de iteraciones.";
        errorDiv.style.display = "block";
    }
}

function dibujarGrafico(funcStr, a, b, raiz) {
    const f = math.compile(funcStr);
    const x = [];
    const y = [];

    // Definir rango general dinámico, por ejemplo -10 a 10
    const desde = isFinite(a) && isFinite(b) ? Math.min(a, b) - 2 : -10;
    const hasta = isFinite(a) && isFinite(b) ? Math.max(a, b) + 2 : 10;

    for (let i = desde; i <= hasta; i += 0.1) {
        x.push(i);
        try {
            y.push(f.evaluate({ x: i }));
        } catch {
            y.push(NaN); // Saltar errores (por ejemplo log(-1))
        }
    }

    const trace = {
        x: x,
        y: y,
        type: "scatter",
        name: "f(x)",
    };

    const rootMarker = {
        x: [raiz],
        y: [0],
        mode: "markers",
        type: "scatter",
        name: "Raíz",
        marker: { color: "red", size: 10 }
    };

    Plotly.newPlot("grafico", [trace, rootMarker], {
        title: "Gráfico de la función",
        xaxis: { title: "x" },
        yaxis: { title: "f(x)" }
    });
}