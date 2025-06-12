
const container = document.getElementById("sinal-container");

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
    ws.send(JSON.stringify({ ticks: "R_100" })); // exemplo com ativo fictício
  };
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.tick) {
      const sinal = {
        ativo: "R_100",
        direcao: Math.random() > 0.5 ? "CALL" : "PUT",
        entrada: "Próxima vela",
        forca: ["fraco", "medio", "forte"][Math.floor(Math.random() * 3)]
      };
      mostrarSinal(sinal);
    }
  };
}
conectarDeriv();
