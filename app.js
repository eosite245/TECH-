document.addEventListener('DOMContentLoaded', () => {
  const ativoSpan = document.getElementById('ativo');
  const sinalInfo = document.getElementById('sinalInfo');
  const forcaSinal = document.getElementById('forcaSinal');
  const listaHistorico = document.getElementById('listaHistorico');
  const audio = document.getElementById('audioNotificacao');
  const copiarBtn = document.getElementById('copiarSinal');

  let sinalAtual = '';
  const symbol = 'frxEURUSD'; // Ativo fixo para testes

  ativoSpan.textContent = symbol;

  const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

  ws.onopen = () => {
    ws.send(JSON.stringify({ ticks: symbol }));
  };

  ws.onmessage = msg => {
    const data = JSON.parse(msg.data);
    if (data.msg_type === 'tick') {
      const price = parseFloat(data.tick.quote);
      const agora = new Date().toLocaleTimeString('pt-BR');

      // Simular confluência técnica
      const confluencia = {
        suporte: price % 1 < 0.1,
        candle: Math.random() > 0.6,
        rsi: Math.random() > 0.7
      };

      const totalConfluencias = Object.values(confluencia).filter(v => v).length;
      const forca = totalConfluencias + '/3';
      const status = totalConfluencias >= 2 ? 'ALTA' : 'FRACA';

      if (totalConfluencias >= 2) {
        sinalAtual = `SINAL ${price % 2 > 1 ? 'CALL' : 'PUT'} em ${symbol} às ${agora} (preço: ${price.toFixed(5)})`;
        sinalInfo.textContent = sinalAtual;
        forcaSinal.textContent = `⚡ Confluência: ${forca} — Força do Sinal: ${status}`;
        const li = document.createElement('li');
        li.textContent = sinalAtual;
        listaHistorico.prepend(li);
        audio.play();
      } else {
        sinalInfo.textContent = '⏳ Aguardando confluência técnica...';
        forcaSinal.textContent = `⚡ Confluência: ${forca} — Força do Sinal: ${status}`;
      }
    }
  };

  copiarBtn.onclick = () => {
    navigator.clipboard.writeText(sinalAtual);
    copiarBtn.textContent = '✅ Copiado!';
    setTimeout(() => copiarBtn.textContent = '📋 Copiar Sinal', 1500);
  };
});