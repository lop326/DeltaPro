let baseLayout = {
    margin: { t: 30 },
    xaxis: { title: 'x', zeroline: true },
    yaxis: { title: 'f(x)', zeroline: true },
    dragmode: 'pan'
  };

  Plotly.newPlot('grafico', [], baseLayout, {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToAdd: ['resetScale2d']
  });

  let colores = [
    '#e74c3c', '#2ecc71', '#3498db', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#34495e', '#d35400', '#7f8c8d'
  ];
  let colorIndex = 0;
  let inputActivo = null;

  function agregarInput() {
    const contenedor = document.getElementById('contenedor-funciones');
    const div = document.createElement('div');
    const color = colores[colorIndex % colores.length];
    colorIndex++;

    div.className = 'input-funcion';
    div.innerHTML = `
      <input type="text" placeholder="Ej: x^2" style="border-color: ${color}" onfocus="seleccionarInput(this)">
      <button onclick="eliminarInput(this)">−</button>
    `;
    contenedor.appendChild(div);
  }

  function eliminarInput(boton) {
    const div = boton.parentNode;
    div.remove();
  }

  function seleccionarInput(input) {
    inputActivo = input;
  }

  function insertar(simbolo) {
    if (inputActivo) {
      const start = inputActivo.selectionStart;
      const end = inputActivo.selectionEnd;
      const text = inputActivo.value;
      inputActivo.value = text.slice(0, start) + simbolo + text.slice(end);
      inputActivo.focus();
      inputActivo.setSelectionRange(start + simbolo.length, start + simbolo.length);
    }
  }

  function graficar() {
    const inputs = document.querySelectorAll('#contenedor-funciones input');
    const trazas = [];

    inputs.forEach((input, i) => {
      const expr = input.value.trim();
      const color = input.style.borderColor || colores[i % colores.length];

      if (expr.length === 0) return;

      const x = [], y = [];

      for (let xi = -10; xi <= 10; xi += 0.1) {
        x.push(xi);
        try {
          y.push(math.evaluate(expr, { x: xi }));
        } catch {
          y.push(null);
        }
      }

      trazas.push({
        x: x,
        y: y,
        mode: 'lines',
        type: 'scatter',
        name: expr,
        line: { color: color }
      });
    });

    Plotly.react('grafico', trazas, baseLayout);
  }

  function borrarFunciones() {
    Plotly.react('grafico', [], baseLayout);
  }