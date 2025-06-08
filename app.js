document.getElementById('entrar').onclick = () => {
  document.getElementById('login').classList.add('oculto');
  document.getElementById('painel').classList.remove('oculto');
};

document.getElementById('logout').onclick = () => {
  document.getElementById('painel').classList.add('oculto');
  document.getElementById('login').classList.remove('oculto');
};

// Simulação básica de estatísticas
window.onload = () => {
  const ctx = document.getElementById('graficoAcertos').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['WIN', 'LOSS'],
      datasets: [{ data: [75, 25], backgroundColor: ['#0f0', '#f00'] }]
    }
  });
};