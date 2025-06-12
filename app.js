
const container = document.getElementById("sinal-container");

function mostrarMensagem(texto) {
  container.innerHTML = `<p style='color: orange;'>${texto}</p>`;
}

function mostrarSinal(sinal) {
  const div = document.createElement("div");
  div.className = `sinal ${sinal.forca}`;
  div.innerHTML = `
    <h3>${sinal.ativo} - ${sinal.direcao}</h3>
    <p>Entrada: ${sinal.entrada} | Força: ${sinal.forca.toUpperCase()}</p>
    <button onclick="navigator.clipboard.writeText('${sinal.ativo} ${sinal.direcao}')">Copiar</button>
  `;
  container.prepend(div);
  new Audio("assets/alerta.mp3").play();
}

function conectarDeriv() {
  const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

  ws.onopen = () => {
    ws.send(JSON.stringify({
      ticks_history: "frxEURUSD",
      style: "candles",
      end: "latest",
      count: 2,
      granularity: 60
    }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.candles) {
      const ultimo = data.candles[data.candles.length - 1];
      const anterior = data.candles[data.candles.length - 2];

      if (!ultimo || !anterior) {
        mostrarMensagem("⛔ Dados insuficientes para análise.");
        return;
      }

      // Exemplo de confluência simples com candle de reversão
      if (anterior.open > anterior.close && ultimo.close > ultimo.open) {
        mostrarSinal({
          ativo: "EUR/USD",
          direcao: "CALL",
          entrada: "Próxima vela",
          forca: "forte"
        });
      } else if (anterior.open < anterior.close && ultimo.close < ultimo.open) {
        mostrarSinal({
          ativo: "EUR/USD",
          direcao: "PUT",
          entrada: "Próxima vela",
          forca: "forte"
        });
      } else {
        mostrarMensagem("⛔ Nenhum sinal no momento — o mercado pode estar em OTC ou sem padrão.");
      }
    } else {
      mostrarMensagem("⛔ Nenhum dado de candle recebido.");
    }
  };

  ws.onerror = () => {
    mostrarMensagem("❌ Erro de conexão com a Deriv API.");
  };
}

mostrarMensagem("Aguardando análise dos candles...");
conectarDeriv();
