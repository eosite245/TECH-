// GIMBI SINAIS PRO v19 - Resultado Telegram Inteligente
// Funcionalidade principal:
// 1. Envia sinal com entrada na próxima vela
// 2. Aguarda a próxima vela abrir e fechar
// 3. Compara o preço de entrada com o fechamento
// 4. Envia resultado para Telegram: WIN ou LOSS

// Exemplo de mensagens:
// 📩 Sinal:
// 🟢 NOVO SINAL - EUR/USD - CALL - Entrada: 110 - Hora: 14:20
//
// 📊 Resultado (após confirmação):
// 📊 RESULTADO DO SINAL - EUR/USD - CALL - ✅ WIN - Hora: 14:22

// ⚠️ Aguardar a vela de entrada fechar corretamente antes de enviar resultado
// ⚙️ Lógica de verificação baseada na comparação de preço de entrada vs fechamento

// Manter histórico local, som de alerta, botão copiar e envio somente se força === 'forte'

