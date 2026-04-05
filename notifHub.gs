Handlers.notifHub = function(payload) {
  Logger.log("--- Starting Notification Hub ---");
  try {
    const entity = Adapters.notification(payload);
    const messageObj = MessageBuilder.fancyTableTemplate(payload);

    entity.picEmailArray.forEach(email => {
      MailApp.sendEmail({ to: email.trim(), subject: messageObj.subject, htmlBody: messageObj.html });
    });
    Logger.log("✅ Email sent to: " + entity.picEmailArray.join(", "));
  } catch (e) { Logger.log("❌ Notif Error: " + e.message); }
};