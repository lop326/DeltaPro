    let carpetas = [];
    let contenidoCarpetas = {};

    function cerrarSesion() {
      alert("Sesión cerrada.");
      sessionStorage.clear(); // 🔥 Elimina los datos temporales
      // Redirigir o cerrar sesión real aquí si aplica
    }
    

    function crearCarpeta() {
      const input = document.getElementById("nuevaCarpetaInput");
      const nombre = input.value.trim();
      if (!nombre) return alert("El nombre de la carpeta no puede estar vacío.");
      if (carpetas.includes(nombre)) return alert("Ya existe una carpeta con ese nombre.");
      carpetas.push(nombre);
      input.value = "";
      mostrarCarpetas();
    }

    function mostrarCarpetas() {
      const lista = document.getElementById("lista-carpetas");
      const select = document.getElementById("selectCarpeta");
      lista.innerHTML = "";
      select.innerHTML = "<option selected disabled>Selecciona una carpeta</option>";

      carpetas.forEach(nombre => {
        const item = document.createElement("div");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
          <span>📁 ${nombre}</span>
          <div>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="verCarpeta('${nombre}')">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarCarpeta('${nombre}')">
              <i class="bi bi-x"></i>
            </button>
          </div>`;
        lista.appendChild(item);

        const option = document.createElement("option");
        option.value = nombre;
        option.textContent = nombre;
        select.appendChild(option);
      });

      document.getElementById("select-carpeta").style.display = carpetas.length > 0 ? "block" : "none";
    }

    function eliminarCarpeta(nombre) {
      if (confirm(`¿Eliminar carpeta "${nombre}"?`)) {
        carpetas = carpetas.filter(c => c !== nombre);
        delete contenidoCarpetas[nombre];
        mostrarCarpetas();
      }
    }

    function guardarEnCarpeta() {
      const carpeta = document.getElementById("selectCarpeta").value;
      if (!carpeta) return alert("Por favor, selecciona una carpeta.");

      const paso1 = document.getElementById("paso1").outerHTML;
      const paso2 = document.getElementById("paso2").outerHTML;
      const paso3 = document.getElementById("paso3").outerHTML;
      const resultado = document.getElementById("resultado").outerHTML;
      const comentario = document.getElementById("comentarioUsuario").value.trim();
      if (!paso1 && !resultado) return alert("No hay datos para guardar.");

      const contenido = `
        ${paso1}
        ${paso2}
        ${paso3}
        ${resultado}
        ${comentario ? `<div class="mt-3"><strong>Comentario del usuario:</strong><br>${comentario}</div>` : ""}
      `;

      contenidoCarpetas[carpeta] = contenidoCarpetas[carpeta] || [];
      contenidoCarpetas[carpeta].push(contenido);

      sessionStorage.setItem("carpetas", JSON.stringify(carpetas));
      sessionStorage.setItem("contenidoCarpetas", JSON.stringify(contenidoCarpetas));
      alert(`Guardado en carpeta: ${carpeta}`);
    }

    function verCarpeta(nombre) {
      const contenido = contenidoCarpetas[nombre] || [];
      if (!contenido.length) return alert(`La carpeta "${nombre}" está vacía.`);

      let html = `
        <h5>Contenido de "${nombre}"</h5>
        <div class="d-flex gap-2 mb-3">
          <button class="btn btn-outline-danger btn-sm" onclick="descargarCarpetaPDF('${nombre}')">📄 Descargar PDF</button>
          <button class="btn btn-outline-success btn-sm" onclick="compartirCarpeta('${nombre}')">🔗 Compartir</button>
        </div>
      `;

      contenido.forEach((item, i) => {
        html += `<div class="border p-2 mb-3 carpeta-item"><strong>Ejercicio ${i + 1}</strong><br>${item}</div>`;
      });

      document.getElementById("modalContenidoBody").innerHTML = html;
      new bootstrap.Modal(document.getElementById('modalContenido')).show();
    }

    function compartirCarpeta(nombre) {
      const contenido = contenidoCarpetas[nombre] || [];
      if (!contenido.length) return;

      let texto = `📁 Contenido de "${nombre}":\n\n`;
      contenido.forEach((item, i) => {
        const textoPlano = item.replace(/<[^>]+>/g, '');
        texto += `🧮 Ejercicio ${i + 1}:\n${textoPlano.trim()}\n\n`;
      });

      navigator.clipboard.writeText(texto)
        .then(() => alert("Contenido copiado al portapapeles. ¡Pégalo donde quieras!"))
        .catch(err => alert("No se pudo copiar: " + err));
    }


    
    function descargarCarpetaPDF(nombre) {
      const contenido = contenidoCarpetas[nombre] || [];
      if (!contenido.length) return;

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `<h2>Contenido de "${nombre}"</h2>`;
      contenido.forEach((item, i) => {
        tempDiv.innerHTML += `<h4>Ejercicio ${i + 1}</h4>${item}`;
      });

      html2pdf().set({
        margin: 0.5,
        filename: `${nombre.replace(/\s+/g, '_').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }).from(tempDiv).save();
    }

    // 🔁 Restaurar si la pestaña no se ha cerrado
    const guardadoCarpetas = sessionStorage.getItem("carpetas");
    const guardadoContenido = sessionStorage.getItem("contenidoCarpetas");

    if (guardadoCarpetas) carpetas = JSON.parse(guardadoCarpetas);
    if (guardadoContenido) contenidoCarpetas = JSON.parse(guardadoContenido);

    // Inicial
    mostrarCarpetas();


    function limpiarResultados() {
      // Limpiar la tabla de inputs
    document.getElementById('tablaInputs').innerHTML = '';

    // Volver a generar la tabla con el tamaño actual
    crearTabla();

    // Ocultar pasos
    document.querySelectorAll('.paso').forEach(paso => {
      paso.style.display = "none";
      paso.innerHTML = "";
    });

    // Ocultar y limpiar resultado
    const resultado = document.getElementById("resultado");
    resultado.style.display = "none";
    resultado.innerHTML = "";

    // Limpiar comentario
    document.getElementById("comentarioUsuario").value = "";
  }

  function descargarEjercicioPDF() {
    const contenedor = document.getElementById("ejercicios-resueltos");
    if (!contenedor) return;
  
    const comentarioTextarea = document.getElementById("comentarioUsuario");
    const comentario = comentarioTextarea?.value.trim() || "";
  
    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-ES').replace(/\//g, '-');
    const horaStr = fecha.toLocaleTimeString('es-ES');
  
    const path = window.location.pathname.split('/').filter(Boolean);
    const metodo = path[path.length - 1] || "ejercicio";
  
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
      <h2>Ejercicios Resueltos</h2>
      <p><strong>Fecha:</strong> ${fechaStr} - <strong>Hora:</strong> ${horaStr}</p>
    `;
  
    // Clonar el contenido y eliminar el bloque del comentario completo
    const clone = contenedor.cloneNode(true);
    const comentarioBloque = clone.querySelector("#comentarioUsuario")?.closest("div");
    if (comentarioBloque) comentarioBloque.remove();
  
    tempDiv.appendChild(clone);
  
    // Agregar el comentario, si existe
    if (comentario) {
      tempDiv.innerHTML += `
        <h4>Comentario del usuario:</h4>
        <p>${comentario}</p>
      `;
    }
  
    html2pdf().set({
      margin: 0.5,
      filename: `ejercicio_${metodo}_${fechaStr}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(tempDiv).save();
  }


function descargarMetodoPDF() {
    const metodo = document.querySelector('body').getAttribute('data-metodo');
    console.log(metodo);  
    switch (metodo) {
        case 'biseccion':
            descargarBiseccion();
            break;

        default:
            alert('No se reconoce el método para la descarga.');
    }
}

function descargarBiseccion(){
  console.log("funcion llamada")
  const funcion = document.getElementById('funcion').value;
  const a = document.getElementById('a').value;
  const b = document.getElementById('b').value;
  const resultado = document.getElementById('result').innerText;
  const iteraciones = document.getElementById('log').innerText;
  const grafico = document.getElementById('grafico');

  const contenido = document.createElement('div');
  contenido.style.padding = '20px';
  contenido.style.fontFamily = 'Arial, sans-serif';
  contenido.innerHTML = `
      <h2>Método de Bisección</h2>
      <p><strong>Función:</strong> ${funcion}</p>
      <p><strong>Intervalo:</strong> a = ${a}, b = ${b}</p>
      <p><strong>Resultado:</strong> ${resultado}</p>
      <h3>Iteraciones:</h3>
      <pre style="white-space: pre-wrap;">${iteraciones}</pre>
  `;

  html2canvas(grafico).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const img = new Image();
      img.src = imgData;
      img.style.maxWidth = '100%';
      contenido.appendChild(img);

      html2pdf()
          .from(contenido)
          .set({
              margin: 0.5,
              filename: 'biseccion_resultado.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          })
          .save();
  });
}