
const container = document.getElementById("sinal-container");
const historicoKey = "gimbi_historico";

const ativos = ["frxEURUSD", "frxUSDJPY", "frxGBPUSD", "frxAUDUSD", "frxUSDCAD", "frxUSDCHF"];

function mostrarMensagem(texto) {
  container.innerHTML = `<p style='color: orange;'>${texto}</p>`;
}

function salvarNoHistorico(sinal) {
  const historico = JSON.parse(localStorage.getItem(historicoKey)) || [];
  historico.unshift(sinal);
  localStorage.setItem(historicoKey, JSON.stringify(historico.slice(0, 20)));
}

function mostrarSinal(sinal) {
  const div = document.createElement("div");
  div.className = `sinal ${sinal.forca}`;
  div.innerHTML = `
    <h3>${sinal.ativo} - ${sinal.direcao}</h3>
    <p>Entrada: ${sinal.entrada} | Força: ${sinal.forca.toUpperCase()}</p>
    <small>${new Date().toLocaleTimeString()}</small><br/>
    <button onclick="navigator.clipboard.writeText('${sinal.ativo} ${sinal.direcao}')">Copiar</button>
  `;
  container.prepend(div);
  salvarNoHistorico(sinal);
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
      forca
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
  ws.onerror = () => {
    console.warn("Erro com ativo", simbolo);
  };
}

function iniciar() {
  mostrarMensagem("🔍 Buscando sinais nos ativos reais...");
  setInterval(() => {
    ativos.forEach(conectarAtivo);
  }, 30000);
}

iniciar();
