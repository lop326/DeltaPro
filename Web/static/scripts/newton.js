let variable, func, deriv, x0, f, df;
let tolerancia = 1e-6;
let maxIter = 20;
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
function mostrar(id) {
  document.getElementById(id).classList.remove("hidden");
}

function validarVariable() {
  const varInput = document.getElementById("variable").value.trim();
  if (/^[a-zA-Z_]+$/.test(varInput)) {
    variable = varInput;
    mostrar("funcion-section");
  } else {
    alert("Error: la variable debe contener solo letras");
  }
}

function procesarFuncion() {
  let funcStr = document.getElementById("funcion").value;
  if (!funcStr) {
    alert("La función no puede estar vacía");
    return;
  }

  funcStr = funcStr.replace(/\^/g, "**")
                   .replace(/sen/g, "sin")
                   .replace(/ln/g, "log")
                   .replace(/tg/g, "tan")
                   .replace(/ctg/g, "cot")
                   .replace(/raiz/g, "sqrt");

  try {
    const expr = math.parse(funcStr);
    const compiled = expr.compile();
    func = (x) => compiled.evaluate({ [variable]: x });

    deriv = math.derivative(expr, variable);
    const derivCompiled = deriv.compile();
    df = (x) => derivCompiled.evaluate({ [variable]: x });

    if (math.simplify(deriv).toString() === '0') {
      alert("La derivada es cero. La función es constante.");
      return;
    }

    buscarValorInicial();
  } catch (e) {
    alert("Error en la función ingresada. Revisar sintaxis.");
  }
}

function buscarValorInicial() {
  for (let x = -10; x <= 10; x += 0.5) {
    try {
      if (Math.abs(df(x)) > 1e-6 && func(x) * func(x + 0.5) < 0) {
        x0 = x;
        document.getElementById("valor-inicial-msg").innerText = `Valor inicial automático: ${x0}`;
        mostrar("config-section");
        return;
      }
    } catch {}
  }

  const entrada = prompt("No se pudo encontrar un valor inicial adecuado. Ingrese uno manual:");
  x0 = parseFloat(entrada);
  if (isNaN(x0)) {
    alert("El valor inicial debe ser un número.");
    return;
  }
  document.getElementById("valor-inicial-msg").innerText = `Valor inicial manual: ${x0}`;
  mostrar("config-section");
}

function ajustarParametros() {
  const opc = document.getElementById("ajustar").value.trim().toLowerCase();
  if (opc === "s", "si") {
    mostrar("parametros-section");
  } else if (opc === "n" , "no") {
    iniciarMetodo();
  } else {
    alert("Entrada inválida. Escriba 's' o 'n'.");
  }
}

function iniciarMetodo() {
  const tolInput = document.getElementById("tolerancia");
  const iterInput = document.getElementById("max_iter");
  if (tolInput && iterInput && !tolInput.parentElement.classList.contains("hidden")) {
    tolerancia = parseFloat(tolInput.value);
    maxIter = parseInt(iterInput.value);
  }

  const resultados = [];
  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    let fx = func(x);
    let dfx = df(x);
    if (dfx === 0) {
      resultados.push("Derivada 0. No se puede continuar");
      break;
    }
    let x1 = x - fx / dfx;
    resultados.push(`Iteración ${i + 1}: x = ${x1}, f(x) = ${func(x1)}`);
    if (Math.abs(x1 - x) < tolerancia) {
      resultados.push(`Raíz aproximada encontrada: ${x1}`);
      break;
    }
    x = x1;
  }

  if (resultados.length === maxIter) {
    resultados.push("No se alcanzó la tolerancia en el número máximo de iteraciones.");
  }

  document.getElementById("resultado").innerText = resultados.join("\n");
}
