document.addEventListener('DOMContentLoaded', () => {
  const sinalInfo = document.getElementById('sinalInfo');
  const listaHistorico = document.getElementById('listaHistorico');
  const taxaAcerto = document.getElementById('taxaAcerto');
  const audio = document.getElementById('audioNotificacao');
  const copiarBtn = document.getElementById('copiarSinal');

  let total = 0;
  let wins = 0;

  const abas = document.querySelectorAll('.aba');
  const paineis = document.querySelectorAll('.painel');
  abas.forEach(aba => {
    aba.onclick = () => {
      abas.forEach(a => a.classList.remove('ativa'));
      paineis.forEach(p => p.classList.remove('ativo'));
      aba.classList.add('ativa');
      document.getElementById(aba.dataset.aba).classList.add('ativo');
    };
  });

  const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
  let symbol = null;
  let sinalAtual = '';

  ws.onopen = () => {
    sinalInfo.textContent = '🔗 Conectado à Deriv...';
    ws.send(JSON.stringify({ active_symbols: 'brief', product_type: 'basic' }));
  };

  ws.onmessage = msg => {
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
      const preco = data.tick.quote.toFixed(5);
      const agora = new Date().toLocaleTimeString('pt-BR');
      sinalAtual = `SINAL ${direcao} em ${symbol} às ${agora} (preço: ${preco})`;

      sinalInfo.textContent = sinalAtual;
      const li = document.createElement('li');
      li.textContent = sinalAtual;
      listaHistorico.prepend(li);

      total++;
      if (Math.random() > 0.3) wins++;
      const taxa = ((wins / total) * 100).toFixed(1);
      taxaAcerto.textContent = `${wins} WIN / ${total - wins} LOSS (${taxa}% acerto)`;

      audio.play();
    }
  };

  copiarBtn.onclick = () => {
    navigator.clipboard.writeText(sinalAtual);
    copiarBtn.textContent = '✅ Copiado!';
    setTimeout(() => copiarBtn.textContent = '📋 Copiar Sinal', 1500);
  };
});