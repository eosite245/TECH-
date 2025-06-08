document.addEventListener('DOMContentLoaded', () => {
  const sinalInfo = document.getElementById('sinalInfo');
  const listaHistorico = document.getElementById('listaHistorico');
  const audio = document.getElementById('audioNotificacao');

  const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

  ws.onopen = () => {
    sinalInfo.textContent = '🔗 Conectado à Deriv. Aguardando preços...';

    // Solicita lista de ativos binários
    ws.send(JSON.stringify({
      active_symbols: 'brief',
      product_type: 'basic'
    }));
  };

  let symbol = null;

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.msg_type === 'active_symbols') {
      const ativos = data.active_symbols.filter(a => a.market === 'forex' || a.market === 'commodities');
      if (ativos.length > 0) {
        symbol = ativos[Math.floor(Math.random() * ativos.length)].symbol;
        ws.send(JSON.stringify({ ticks: symbol }));
      }
    }

    if (data.msg_type === 'tick') {
      const direcao = Math.random() > 0.5 ? 'CALL' : 'PUT';
      const agora = new Date().toLocaleTimeString('pt-BR');
      const sinal = `SINAL ${direcao} em ${symbol} às ${agora} (preço: ${data.tick.quote.toFixed(5)})`;

      sinalInfo.textContent = sinal;
      const li = document.createElement('li');
      li.textContent = sinal;
      listaHistorico.prepend(li);
      audio.play();
    }
  };
});