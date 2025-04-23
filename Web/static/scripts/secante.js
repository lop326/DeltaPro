function secante(f, x0, x1, tolerancia = 1e-6, maxIteraciones = 100) {
    for (let iteracion = 0; iteracion < maxIteraciones; iteracion++) {
        let f_x0, f_x1;
        try {
            f_x0 = f(x0);
            f_x1 = f(x1);
        } catch (e) {
            console.error(`❌ Error al evaluar la función: ${e}`);
            return null;
        }

        const denominador = f_x1 - f_x0;

        if (Math.abs(denominador) < 1e-12) {
            console.warn(`⚠️ División por un número muy pequeño. Método inestable.`);
            return null;
        }

        let x2;
        try {
            x2 = x1 - f_x1 * (x1 - x0) / denominador;
        } catch (e) {
            console.error(`❌ Error en el cálculo de x2: ${e}`);
            return null;
        }

        const errorRel = x2 !== 0 ? Math.abs((x2 - x1) / x2) : Math.abs(x2 - x1);

        if (errorRel < tolerancia) {
            return x2;
        }

        x0 = x1;
        x1 = x2;
    }

    console.error("❌ No se encontró una raíz dentro de la tolerancia.");
    return null;
}

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

function obtenerFuncionUsuario(variable, funcionUsuario) {
    try {
        funcionUsuario = procesarFuncion(funcionUsuario);
        const f = new Function(variable, `return ${funcionUsuario};`);
        const prueba = f(1);
        if (isNaN(prueba)) throw new Error("No retorna número");
        return f;
    } catch (e) {
        console.error(`❌ Error en la función ingresada: ${e}`);
        return null;
    }
}

function ejecutarSecante() {
    const variable = document.getElementById("variable").value.trim();
    const funcionUsuario = document.getElementById("funcion").value.trim();
    const x0 = parseFloat(document.getElementById("x0").value);
    const x1 = parseFloat(document.getElementById("x1").value);
    const tolerancia = parseFloat(document.getElementById("tolerancia").value);

    if (x0 === x1) {
        alert("❌ Los valores iniciales no pueden ser iguales.");
        return;
    }

    const f = obtenerFuncionUsuario(variable, funcionUsuario);
    if (!f) {
        alert("❌ La función ingresada no es válida.");
        return;
    }

    if (f(x0) === f(x1)) {
        alert("⚠️ Cuidado: la función parece constante entre los valores dados.");
    } else if (f(x0) * f(x1) > 0) {
        alert("⚠️ f(x0) y f(x1) tienen el mismo signo. Puede que el método no converja.");
    }

    const raiz = secante(f, x0, x1, tolerancia);

    const resultadoDiv = document.getElementById("resultado");
    if (raiz !== null) {
        try {
            const valorFuncion = f(raiz);
            resultadoDiv.innerHTML = `✅ Raíz encontrada: ${raiz}<br>f(${raiz}) = ${valorFuncion}`;
            resultadoDiv.className = "result success";
            if (Math.abs(valorFuncion) > tolerancia) {
                resultadoDiv.innerHTML += `<br>⚠️ Advertencia: f(${raiz}) = ${valorFuncion} no es exactamente cero.`;
            }
        } catch (e) {
            resultadoDiv.className = "result warning";
            resultadoDiv.innerHTML = `⚠️ Se obtuvo una raíz, pero no se pudo evaluar f(x): ${e}`;
        }
    } else {
        resultadoDiv.className = "result error";
        resultadoDiv.innerHTML = "❌ El método no logró encontrar una raíz.";
    }
}
