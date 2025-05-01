
  const elementos = document.querySelectorAll('.hidden-on-load');

  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('show-on-scroll');
        observer.unobserve(entrada.target); // para que no se repita
      }
    });
  }, {
    threshold: 0.1  // porcentaje de visibilidad
  });

  elementos.forEach(el => observer.observe(el));

