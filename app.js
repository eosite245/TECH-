function mostrar(secao) {
  document.querySelectorAll('section').forEach(s => s.classList.add('oculto'));
  document.getElementById(secao).classList.remove('oculto');
}

function copiarSinal() {
  const texto = document.getElementById('sinalGerado').innerText;
  navigator.clipboard.writeText(texto);
  alert('Sinal copiado: ' + texto);
}

function gerarResultado(score) {
  const chance = {5: 90, 4: 80, 3: 60}[score] || 50;
  return Math.random() * 100 < chance ? '✅ Resultado: WIN' : '❌ Resultado: LOSS';
}

function gerarSinal() {
  const agora = new Date();
  const hora = agora.getUTCHours() - 3; // Brasília (UTC-3)
  if (hora < 6 || hora >= 16) {
    document.getElementById('sinalGerado').innerText = "Fora do horário de geração de sinais (06h às 16h).";
    return;
  }

  const ativos = ['EUR/USD', 'GBP/JPY', 'AUD/USD', 'USD/JPY'];
  const direcoes = ['CALL', 'PUT'];
  const tempos = ['M5', 'M15'];
  const entradas = ['Próxima vela', 'Retração'];

  const score = Math.floor(Math.random() * 3) + 3;
  const ativo = ativos[Math.floor(Math.random() * ativos.length)];
  const direcao = direcoes[Math.floor(Math.random() * direcoes.length)];
  const tempo = tempos[Math.floor(Math.random() * tempos.length)];
  const entrada = entradas[Math.floor(Math.random() * entradas.length)];
  const horario = agora.toLocaleTimeString().slice(0,5);
  const expiracao = `${tempo} (final da vela)`;
  const resultado = gerarResultado(score);

  const sinal = `${ativo} | ${direcao} | ${tempo} | Score: ${score}/5 | ${horario}\n📌 Entrada: ${entrada}\n📆 Expiração: ${expiracao}\n${resultado}`;

  document.getElementById('sinalGerado').innerText = sinal;

  const li = document.createElement('li');
  li.innerText = sinal;
  document.getElementById('historicoSinais').prepend(li);
}

window.onload = () => {
  gerarSinal();
  setInterval(gerarSinal, 600000);

  const ctx = document.getElementById('graficoAcertos').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['WIN', 'LOSS'],
      datasets: [{ data: [82, 18], backgroundColor: ['#0f0', '#f00'] }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
};