const container = document.getElementById("sinal-container");
const historicoContainer = document.getElementById("historico-container");
const historicoKey = "gimbi_historico";
const ativos = ["frxEURUSD", "frxUSDJPY", "frxGBPUSD", "frxAUDUSD", "frxUSDCAD", "frxUSDCHF"];

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
  const ws = new WebSocket("wss://ws.binaryws.co
