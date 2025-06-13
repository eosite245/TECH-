// GIMBI SINAIS PRO v22 FINAL - Multiativos + Telegram + WIN/LOSS + Classificação de Força

// === CONFIG TELEGRAM ===
const telegramToken = "8172104920:AAFZOufruBO7Nqddwy02eaPSIL_g4IDU5xc";
const telegramChatId = "-4872023189";

function enviarParaTelegram(texto) {
  fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: telegramChatId, text: texto })
  });
}

// === LÓGICA PRINCIPAL ===
// Simulação da lógica GIMBI para demonstração de estrutura
const ativos = ["frxEURUSD", "frxGBPUSD", "frxUSDJPY", "frxAUDUSD", "frxUSDCAD", "frxUSDCHF", "frxEURGBP", "frxEURJPY", "frxGBPJPY"];

function gerarSinalSimulado() {
  const ativo = ativos[Math.floor(Math.random() * ativos.length)];
  const direcao = Math.random() > 0.5 ? "CALL" : "PUT";
  const confluencias = Math.floor(Math.random() * 4) + 1;
  const horario = new Date().toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" });

  let forca = "FRACO";
  if (confluencias === 2) forca = "MÉDIO";
  if (confluencias >= 3) forca = "FORTE";

  const sinal = {
    ativo,
    direcao,
    confluencias,
    forca,
    horario
  };

  exibirNoApp(sinal);

  if (forca === "FORTE") {
    enviarParaTelegram(`🟢 NOVO SINAL
Ativo: ${ativo}
Direção: ${direcao}
Entrada: Próxima vela (Expiração: 5 ou 15 min)
Força: ${forca}
🕒 Gerado às: ${horario} (Horário de Brasília)`);
    setTimeout(() => {
      const win = Math.random() > 0.4;
      const resultado = win ? "✅ WIN" : "❌ LOSS";
      const horarioRes = new Date().toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" });
      enviarParaTelegram(`📊 RESULTADO DO SINAL
Ativo: ${ativo}
Direção: ${direcao}
Resultado: ${resultado}
🕒 Resultado às: ${horarioRes} (Brasília)`);
    }, 60000);
  }
}

function exibirNoApp(sinal) {
  const container = document.getElementById("sinal-container");
  const div = document.createElement("div");
  div.className = `sinal ${sinal.forca.toLowerCase()}`;
  div.innerHTML = `
    <strong>${sinal.ativo}</strong> - ${sinal.direcao}<br/>
    Força: ${sinal.forca}<br/>
    Gerado às: ${sinal.horario}
  `;
  container.prepend(div);
}

// Simulação de geração contínua a cada 2 minutos
setInterval(gerarSinalSimulado, 120000);
