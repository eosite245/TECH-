function mostrar(secao) {
  document.querySelectorAll('section').forEach(s => s.classList.add('oculto'));
  document.getElementById(secao).classList.remove('oculto');
}

window.onload = () => {
  const ctx = document.getElementById('graficoAcertos').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['WIN', 'LOSS'],
      datasets: [{ data: [82, 18], backgroundColor: ['#0f0', '#f00'] }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
};