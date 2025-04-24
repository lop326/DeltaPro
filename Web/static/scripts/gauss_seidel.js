function crearTabla() {
    const n = parseInt(document.getElementById('tamano').value);
    const contenedor = document.getElementById('tablaInputs');
    contenedor.innerHTML = '';
  
    for (let i = 0; i < n; i++) {
      let fila = document.createElement('div');
      fila.className = 'fila d-flex justify-content-center align-items-center';
  
      // Crear los inputs para la matriz A
      for (let j = 0; j < n; j++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `a_${i}_${j}`;
        input.step = 'any';
        input.placeholder = `a${i + 1}${j + 1}`;
        input.className = 'form-control m-1 text-center';
        fila.appendChild(input);
      }
  
      // Añadir la etiqueta del igual
      const igual = document.createElement('label');
      igual.innerText = '=';
      igual.className = 'm-1';
      fila.appendChild(igual);
  
      // Crear el input para el vector B
      const inputB = document.createElement('input');
      inputB.type = 'number';
      inputB.id = `b_${i}`;
      inputB.step = 'any';
      inputB.placeholder = `b${i + 1}`;
      inputB.className = 'form-control m-1 text-center';
      fila.appendChild(inputB);
  
      // Añadir la fila al contenedor
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

function esDominante(M) {
  for (let i = 0; i < M.length; i++) {
    let suma = 0;
    for (let j = 0; j < M.length; j++) {
      if (i !== j) suma += Math.abs(M[i][j]);
    }
    if (Math.abs(M[i][i]) < suma) return false;
  }
  return true;
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

function resolver(event) {
  event.preventDefault();
  const n = parseInt(document.getElementById('tamano').value);
  const iter = parseInt(document.getElementById('iteraciones').value);
  let X = Array(n).fill(0);
  const { A, B } = obtenerDatos(n);

  if (!esDominante(A)) {
    document.getElementById('resultado').innerText = "La matriz no es diagonalmente dominante.";
    document.getElementById('resultado').style.display = 'block';
    return;
  }

  mostrarMatriz('paso1', 'Matriz A y vector B:', A, B);

  for (let k = 0; k < iter; k++) {
    for (let i = 0; i < n; i++) {
      let sum = B[i];
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          sum -= A[i][j] * X[j];
        }
      }
      X[i] = sum / A[i][i];
    }
  }

  mostrarMatriz('paso2', `Solución aproximada tras ${iter} iteraciones:`, [X]);

  document.getElementById('resultado').innerText = "Resultado aproximado: [" + X.map(x => x.toFixed(4)).join(", ") + "]";
  document.getElementById('resultado').style.display = 'block';
}


window.onload = () => {
  crearTabla();
  document.getElementById('gaussForm').addEventListener('submit', resolver);
};
