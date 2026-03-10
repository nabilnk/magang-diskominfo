Handlers.notifHub = function(payload) {
  Logger.log("--- Menjalankan Notifikasi Hub ---");
  try {
    const messageObj = MessageBuilder.fancyTableTemplate(payload);

    if (!messageObj.to || messageObj.to === "") {
       Logger.log("⚠️ Penerima kosong, mencoba kirim ke admin.");
       messageObj.to = Session.getEffectiveUser().getEmail();
    }

    MailApp.sendEmail({
      to: messageObj.to, 
      subject: messageObj.subject,
      htmlBody: messageObj.html
    });

    Logger.log("✅ Email Rill Terkirim Ke: " + messageObj.to);
  } catch (error) {
    Logger.log("❌ Gagal mengirim notifikasi: " + error.message);
  }
};