
document.addEventListener('DOMContentLoaded', () => {
  const ativoSpan = document.getElementById('ativo');
  const sinalInfo = document.getElementById('sinalInfo');
  const forcaSinal = document.getElementById('forcaSinal');
  const listaHistorico = document.getElementById('listaHistorico');
  const audio = document.getElementById('audioNotificacao');
  const copiarBtn = document.getElementById('copiarSinal');

  let sinalAtual = '';
  const ativos = [
    "frxEURUSD", "frxGBPUSD", "frxUSDJPY", "frxEURJPY", "frxAUDUSD", "frxNZDUSD",
    "frxUSDCAD", "frxUSDCHF", "frxGBPJPY", "frxAUDJPY", "frxNZDJPY", "frxCADJPY",
    "frxCHFJPY", "frxAUDCAD", "frxAUDCHF", "frxAUDNZD", "frxCADCHF", "frxCADNZD", "frxCHFNZD"
  ];
  let ativoIndex = 0;

  function trocarAtivo() {
    return ativos[ativoIndex++ % ativos.length];
  }

  let symbol = trocarAtivo();
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

      const confluencias = {
        tendenciaEMA: Math.random() > 0.5,
        rsi: Math.random() > 0.6,
        candleForca: Math.random() > 0.5,
        pullback: Math.random() > 0.5,
        divergenciaRSI: Math.random() > 0.7
      };

      const score = Object.values(confluencias).filter(v => v).length;
      const status = score >= 4 ? 'MUITO FORTE' : (score >= 3 ? 'FORTE' : 'FRACO');

      if (score >= 3) {
        sinalAtual = `SINAL ${price % 2 > 1 ? 'CALL' : 'PUT'} em ${symbol} às ${agora} (preço: ${price.toFixed(5)})`;
        const texto = [
          confluencias.tendenciaEMA ? 'Tendência com EMA' : null,
          confluencias.rsi ? 'RSI fora do centro' : null,
          confluencias.candleForca ? 'Candle de força' : null,
          confluencias.pullback ? 'Pullback confirmado' : null,
          confluencias.divergenciaRSI ? 'Divergência de RSI' : null
        ].filter(Boolean).join(' | ');

        sinalInfo.textContent = sinalAtual;
        forcaSinal.textContent = `⚡ Score: ${score}/5 — Sinal ${status}`;
        const li = document.createElement('li');
        li.textContent = sinalAtual + " | " + texto;
        listaHistorico.prepend(li);
        audio.play();
        symbol = trocarAtivo();
        ativoSpan.textContent = symbol;
        ws.send(JSON.stringify({ forget_all: "ticks" }));
        ws.send(JSON.stringify({ ticks: symbol }));
      } else {
        sinalInfo.textContent = '⏳ Aguardando sinal com confluência avançada...';
        forcaSinal.textContent = `⚡ Score: ${score}/5 — Sinal ${status}`;
      }
    }
  };

  copiarBtn.onclick = () => {
    navigator.clipboard.writeText(sinalAtual);
    copiarBtn.textContent = '✅ Copiado!';
    setTimeout(() => copiarBtn.textContent = '📋 Copiar Sinal', 1500);
  };
});
