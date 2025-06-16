const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

ws.onopen = () => {
  ws.send(JSON.stringify({
    ticks_history: "frxEURUSD",
    style: "candles",
    end: "latest",
    count: 5,
    granularity: 300
  }));
};

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  if (data.candles) {
    document.getElementById("sinal-container").innerHTML =
      "<pre style='color:lime'>" + JSON.stringify(data.candles, null, 2) + "</pre>";
  } else {
    document.getElementById("sinal-container").innerHTML =
      "<span style='color:red'>WebSocket conectou, mas não retornou candles!</span>";
  }
};
