// notifHub.gs
Handlers.notifHub = function(payload) {
  Logger.log("--- Starting Notification Hub ---");
  try {
    // 1. Ambil template mewah dari Builder
    const messageObj = MessageBuilder.fancyTableTemplate(payload);

    // 2. Eksekusi pengiriman dengan htmlBody (PENTING!)
    MailApp.sendEmail({
      to: messageObj.to,
      subject: messageObj.subject,
      htmlBody: messageObj.html // Ini yang membuat tampilan seperti Gambar 3
    });

    Logger.log("✅ Notif Mewah terkirim ke: " + messageObj.to);
  } catch (error) {
    Logger.log("❌ Error in notifHub: " + error.message);
  }
};