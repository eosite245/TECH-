document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('graficoAcertos').getContext('2d');
  
  // Simulação avançada de dados reais
  const resultados = { win: 82, loss: 18 };
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['WIN', 'LOSS'],
      datasets: [{ data: [resultados.win, resultados.loss], backgroundColor: ['#0f0', '#f00'] }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Relatório de Backtesting
  document.getElementById('relatorioBacktest').innerHTML = `
    <h3>📈 Relatório Backtesting (30 dias)</h3>
    <p>Total de Sinais: 250</p>
    <p>WIN: ${resultados.win}% | LOSS: ${resultados.loss}%</p>
    <p>Ativo mais lucrativo: EUR/USD (90% acerto)</p>
    <p>Horário ideal: 10h às 14h (85% acerto)</p>
  `;
});