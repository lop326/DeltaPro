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
  
  function gaussSustituyeAtras(AB, tolerancia = 1e-12) {
    let n = AB.length;
    let X = new Array(n).fill(0);
  
    for (let i = n - 1; i >= 0; i--) {
      let suma = 0;
      for (let j = i + 1; j < n; j++) {
        suma += AB[i][j] * X[j];
      }
  
      if (Math.abs(AB[i][i]) < tolerancia) {
        if (Math.abs(AB[i][n] - suma) < tolerancia) return null;
        return undefined;
      }
  
      X[i] = (AB[i][n] - suma) / AB[i][i];
    }
  
    return X;
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
  
        let X = gaussSustituyeAtras(AB);
        const resDiv = document.getElementById('resultado');
        resDiv.style.display = 'block';
  
        if (X === undefined) {
          resDiv.innerText = 'El sistema no tiene solución.';
        } else if (X === null) {
          resDiv.innerText = 'El sistema tiene infinitas soluciones.';
        } else {
          resDiv.innerHTML = `Solución:\n${X.map((x, i) => `x${i+1} = ${x.toFixed(4)}`).join('\n')}`;
        }
  
      } catch (error) {
        document.getElementById('resultado').style.display = 'block';
        document.getElementById('resultado').innerText = 'Error en el ingreso de datos.';
      }
    });
  });
  


   
