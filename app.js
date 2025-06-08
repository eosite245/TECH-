document.addEventListener('DOMContentLoaded', () => {
  const sinalInfo = document.getElementById('sinalInfo');
  const listaHistorico = document.getElementById('listaHistorico');
  const audio = document.getElementById('audioNotificacao');

  function gerarSinalFake() {
    const direcao = Math.random() > 0.5 ? 'CALL' : 'PUT';
    const agora = new Date().toLocaleTimeString('pt-BR');
    const sinal = `SINAL ${direcao} às ${agora} (confirmação por candle OK)`;

    sinalInfo.textContent = sinal;
    const li = document.createElement('li');
    li.textContent = sinal;
    listaHistorico.prepend(li);

    audio.play();
  }

  gerarSinalFake();
  setInterval(gerarSinalFake, 600000); // A cada 10 minutos
});