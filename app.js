// === CONFIGURAÇÕES PRINCIPAIS ===

const ativos = [

"frxEURUSD","frxGBPUSD","frxUSDJPY","frxAUDUSD","frxUSDCAD","frxUSDCHF","frxEURGBP","frxEURJPY","frxGBPJPY","frxAUDJPY","frxEURNZD","frxNZDUSD","frxEURCHF","frxAUDCHF","frxGBPCHF","frxEURAUD","frxUSDMXN","frxUSDZAR","frxEURCAD"

];

const timeframes = [

{ nome: "M5", granularity: 300, expiracao: 5 },

{ nome: "M15", granularity: 900, expiracao: 15 }

];

const telegramToken = "8172104920:AAFZOufruBO7Nqddwy02eaPSIL_g4IDU5xc";

const telegramChatId = "-4872023189";

const historicoKey = "gimbi_historico";

const MIN_CONFLUENCIAS = 1;

// === FUNÇÕES AUXILIARES ===

function horaBrasiliaStr() {

return new Date().toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" });

}

function salvarNoHistorico(sinal) {

const h = JSON.parse(localStorage.getItem(historicoKey) || "[]");

h.unshift(sinal);

localStorage.setItem(historicoKey, JSON.stringify(h.slice(0, 30)));

renderizarHistorico();

}

function renderizarHistorico() {

const h = JSON.parse(localStorage.getItem(historicoKey) || "[]");

document.getElementById("historico-container").innerHTML = h.map(s =>

`<div class="sinal ${s.forca}">

  <strong>${s.ativo}</strong> - ${s.direcao}<br/>

  Força: ${s.forca.toUpperCase()}<br/>

  Gerado às: ${s.hora}<br/>

  <small>Expiração: ${s.expiracao}min | Result: ${s.resultado || "-"}</small>

</div>`

).join("");

}

// === ENVIO TELEGRAM ===

function enviarParaTelegram(msg) {

fetch(https://api.telegram.org/bot${telegramToken}/sendMessage, {

method: "POST",

headers: { "Content-Type": "application/json" },

body: JSON.stringify({ chat_id: telegramChatId, text: msg })

});

}

// === ANÁLISE DE CONFLUÊNCIAS (EXEMPLO BÁSICO/ADAPTE PARA LÓGICA COMPLETA) ===

function analisarConfluencias(candles) {

 Aqui você vai// inserir toda a lógica real dos indicadores: RSI, MACD, Fibo, OCO, Marubozu, etc.

function analisarConfluencias(candles) {
  let c = 0, info = [];
  const ultimo = candles[candles.length - 1];
  const anterior = candles[candles.length - 2];
  const anteAnterior = candles[candles.length - 3];

  // 1. Martelo (Alta)
  if (ultimo.close > ultimo.open && (ultimo.low - Math.min(ultimo.open, ultimo.close)) > (ultimo.high - ultimo.low) * 0.6) {
    c++; info.push("Martelo");
  }
  // 2. Martelo Invertido (Alta)
  if (ultimo.close > ultimo.open && (ultimo.high - Math.max(ultimo.open, ultimo.close)) > (ultimo.high - ultimo.low) * 0.6) {
    c++; info.push("Martelo Invertido");
  }
  // 3. Engolfo de Alta
  if (ultimo.close > ultimo.open && anterior.close < anterior.open && ultimo.close > anterior.open && ultimo.open < anterior.close) {
    c++; info.push("Engolfo de Alta");
  }
  // 4. Estrela da Manhã
  if (
    anteAnterior.close < anteAnterior.open &&
    anterior.open === anterior.close &&
    ultimo.close > ultimo.open &&
    ultimo.close > anteAnterior.open
  ) {
    c++; info.push("Estrela da Manhã");
  }
  // 5. Marubozu de Alta
  if (ultimo.close > ultimo.open && (ultimo.open === ultimo.low) && (ultimo.close === ultimo.high)) {
    c++; info.push("Marubozu de Alta");
  }
  // 6. Pavio Inferior Longo (Alta)
  if ((ultimo.low - Math.min(ultimo.open, ultimo.close)) > (ultimo.high - ultimo.low) * 0.7) {
    c++; info.push("Pavio Inferior Longo");
  }
  // 7. 3 Soldados Brancos (Alta)
  if (candles.slice(-3).every(c => c.close > c.open)) {
    c++; info.push("3 Soldados Brancos");
  }
  // 8. OCO Invertido (Alta, simplificado)
  if (anteAnterior.low > anterior.low && ultimo.low > anterior.low && anterior.low < anteAnterior.low && anterior.low < ultimo.low) {
    c++; info.push("OCO Invertido");
  }
  // 9. Estrela da Noite (Baixa)
  if (
    anteAnterior.close > anteAnterior.open &&
    anterior.open === anterior.close &&
    ultimo.close < ultimo.open &&
    ultimo.close < anteAnterior.open
  ) {
    c++; info.push("Estrela da Noite");
  }
  // 10. Engolfo de Baixa
  if (ultimo.close < ultimo.open && anterior.close > anterior.open && ultimo.open > anterior.close && ultimo.close < anterior.open) {
    c++; info.push("Engolfo de Baixa");
  }
  // 11. Marubozu de Baixa
  if (ultimo.close < ultimo.open && (ultimo.open === ultimo.high) && (ultimo.close === ultimo.low)) {
    c++; info.push("Marubozu de Baixa");
  }
  // 12. Pavio Superior Longo (Baixa)
  if ((ultimo.high - Math.max(ultimo.open, ultimo.close)) > (ultimo.high - ultimo.low) * 0.7) {
    c++; info.push("Pavio Superior Longo");
  }
  // 13. Martelo Invertido de Baixa
  if (ultimo.close < ultimo.open && (ultimo.high - Math.max(ultimo.open, ultimo.close)) > (ultimo.high - ultimo.low) * 0.6) {
    c++; info.push("Martelo Invertido de Baixa");
  }
  // 14. 3 Corvos Negros (Baixa)
  if (candles.slice(-3).every(c => c.close < c.open)) {
    c++; info.push("3 Corvos Negros");
  }
  // 15. OCO (Baixa, simplificado)
  if (anteAnterior.high < anterior.high && ultimo.high < anterior.high && anterior.high > anteAnterior.high && anterior.high > ultimo.high) {
    c++; info.push("OCO");
  }
  return { total: c, info };
}


// === GERADOR DE SINAL ===

let ultimoSinalTimestamp = 0;

function buscarSinalForcado() {

const agora = Date.now();

if (agora - ultimoSinalTimestamp < 14601000) return; // Garante mínimo 1 a cada 15min

for (const tf of timeframes) {

for (const ativo of ativos) {

  buscarCandlesEAnalisar(ativo, tf, true);

}

}

ultimoSinalTimestamp = agora;

}

function buscarCandlesEAnalisar(ativo, tf, forcarSinal = false) {

const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

ws.onopen = () => {

ws.send(JSON.stringify({

  ticks_history: ativo,

  style: "candles",

  end: "latest",

  count: 20,

  granularity: tf.granularity

}));

};

ws.onmessage = (msg) => {

const data = JSON.parse(msg.data);

if (data.candles && data.candles.length > 10) {

  const res = analisarConfluencias(data.candles);

  if (res.total >= MIN_CONFLUENCIAS || forcarSinal) {

    const forca = res.total >= 3 ? "forte" : (res.total === 2 ? "medio" : "fraco");

    const direcao = Math.random() > 0.5 ? "CALL" : "PUT"; // Troque para lógica real

    const hora = horaBrasiliaStr();

    const sinal = {

      ativo: ativo.replace("frx", ""),

      timeframe: tf.nome,

      direcao,

      forca,

      confluencias: res.info.join(", "),

      hora,

      expiracao: tf.expiracao,

      resultado: null

    };

    mostrarSinal(sinal);

    salvarNoHistorico(sinal);

    enviarParaTelegram(

      `🟢 NOVO SINAL\nAtivo: ${sinal.ativo}\nDireção: ${direcao}\nForça: ${forca.toUpperCase()}\nConfluências: ${sinal.confluencias}\nEntrada: Próxima vela (Expiração: ${tf.expiracao}min)\n🕒 Gerado às: ${hora} (Brasília)`

    );

    verificarResultadoSinal(sinal, tf, ativo);

  }

  ws.close();

}

};

}

function mostrarSinal(sinal) {

const container = document.getElementById("sinal-container");

const div = document.createElement("div");

div.className = sinal ${sinal.forca};

div.innerHTML = `

<strong>${sinal.ativo}</strong> - ${sinal.direcao}<br/>

Força: ${sinal.forca.toUpperCase()}<br/>

Gerado às: ${sinal.hora}<br/>

<small>Expiração: ${sinal.expiracao}min | Confluências: ${sinal.confluencias || ""}</small>

<br/><button onclick="navigator.clipboard.writeText('${sinal.ativo} ${sinal.direcao}')">Copiar</button>

`;

container.prepend(div);

try { new Audio("assets/alerta.mp3").play(); } catch {}

}

function verificarResultadoSinal(sinal, tf, ativo) {

setTimeout(() => {

const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

ws.onopen = () => {

  ws.send(JSON.stringify({

    ticks_history: ativo,

    style: "candles",

    end: "latest",

    count: 2,

    granularity: tf.granularity

  }));

};

ws.onmessage = (msg) => {

  const data = JSON.parse(msg.data);

  if (data.candles && data.candles.length === 2) {

    const [entrada, fechamento] = data.candles;

    let win = false;

    if (sinal.direcao === "CALL" && fechamento.close > entrada.close) win = true;

    if (sinal.direcao === "PUT" && fechamento.close < entrada.close) win = true;

    sinal.resultado = win ? "WIN" : "LOSS";

    enviarParaTelegram(

      `📊 RESULTADO DO SINAL\nAtivo: ${sinal.ativo}\nDireção: ${sinal.direcao}\nResultado: ${win ? "✅ WIN" : "❌ LOSS"}\nExpiração: ${tf.expiracao}min\n🕒 Resultado às: ${horaBrasiliaStr()} (Brasília)`

    );

    salvarNoHistorico(sinal);

    renderizarHistorico();

  }

  ws.close();

};

}, tf.expiracao * 60 * 1000);

}

// === LOOP PRINCIPAL ===

function loop() {

for (const tf of timeframes) {

for (const ativo of ativos) {

  buscarCandlesEAnalisar(ativo, tf);

}

}

buscarSinalForcado();

}

renderizarHistorico();

setInterval(loop, 60 * 1000); // roda a cada 1 minuto

