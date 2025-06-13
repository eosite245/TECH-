
const container = document.getElementById("sinal-container");
const historicoContainer = document.getElementById("historico-container");
const historicoKey = "gimbi_historico";
const ativos = ["frxEURUSD", "frxUSDJPY", "frxGBPUSD", "frxAUDUSD", "frxUSDCAD", "frxUSDCHF"];

// Telegram config
const telegramToken = "8172104920:AAFZOufruBO7Nqddwy02eaPSIL_g4IDU5xc";
const telegramChatId = "-4872023189";

function salvarNoHistorico(sinal) {
  const historico = JSON.parse(localStorage.getItem(historicoKey)) || [];
  historico.unshift(sinal);
  localStorage.setItem(historicoKey, JSON.stringify(historico.slice(0, 20)));
  renderizarHistorico();
}

function renderizarHistorico() {
  const historico = JSON.parse(localStorage.getItem(historicoKey)) || [];
  historicoContainer.innerHTML = historico.map(s =>
    `<div class="sinal ${s.forca}">
      <h3>${s.ativo} - ${s.direcao}</h3>
      <p>Entrada: ${s.entrada} | Força: ${s.forca.toUpperCase()}</p>
      <small>${s.hora}</small>
    </div>`
  ).join("");
}

function enviarParaTelegram(sinal) {
  const msg = `🟢 NOVO SINAL\nAtivo: ${sinal.ativo}\nDireção: ${sinal.direcao}\nForça: ${sinal.forca.toUpperCase()}\nEntrada: ${sinal.entrada}\nHora: ${sinal.hora}`;
  fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: telegramChatId, text: msg })
  });
}

function mostrarSinal(sinal) {
  const div = document.createElement("div");
  div.className = `sinal ${sinal.forca}`;
  div.innerHTML = `
    <h3>${sinal.ativo} - ${sinal.direcao}</h3>
    <p>Entrada: ${sinal.entrada} | Força: ${sinal.forca.toUpperCase()}</p>
    <small>${sinal.hora}</small><br/>
    <button onclick="navigator.clipboard.writeText('${sinal.ativo} ${sinal.direcao}')">Copiar</button>
  `;
  container.prepend(div);
  salvarNoHistorico(sinal);
  enviarParaTelegram(sinal);
  new Audio("assets/alerta.mp3").play();
}

function analisarCandle(anterior, atual, simbolo) {
  const rsi = 50 + ((atual.close - atual.open) * 100 / (atual.high - atual.low + 0.01));
  const resistencia = atual.close > anterior.high;
  const suporte = atual.close < anterior.low;

  let confluencias = 0;
  if (rsi < 30 || rsi > 70) confluencias++;
  if (resistencia || suporte) confluencias++;
  if (anterior.open > anterior.close && atual.close > atual.open) confluencias++;
  if (anterior.open < anterior.close && atual.close < atual.open) confluencias++;

  if (confluencias >= 2) {
    const direcao = atual.close > atual.open ? "CALL" : "PUT";
    const forca = confluencias >= 3 ? "forte" : "medio";
    mostrarSinal({
      ativo: simbolo.replace("frx", ""),
      direcao,
      entrada: "Próxima vela",
      forca,
      hora: new Date().toLocaleTimeString()
    });
  }
}

function conectarAtivo(simbolo) {
  const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
  ws.onopen = () => {
    ws.send(JSON.stringify({
      ticks_history: simbolo,
      style: "candles",
      end: "latest",
      count: 2,
      granularity: 60
    }));
  };
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.candles && data.candles.length === 2) {
      const [anterior, atual] = data.candles;
      analisarCandle(anterior, atual, simbolo);
    }
  };
}

function iniciar() {
  renderizarHistorico();
  setInterval(() => {
    ativos.forEach(conectarAtivo);
  }, 30000);
}

iniciar();
