// driveHandler.gs
var Handlers = Handlers || {};

Handlers.driveHandler = function(payload) {
  Logger.log("--- Starting Drive Handler (Silent Mode) ---");
  try {
    const entity = Adapters.drive(payload);
    const parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
    const newFolder = parentFolder.createFolder(`[TASK] ${entity.title}`);
    const folderId = newFolder.getId();

    // PROSES SILENT SHARING
    if (entity.picEmailArray && entity.picEmailArray.length > 0) {
      entity.picEmailArray.forEach(email => {
        try {
          // Memberikan akses via Drive API v2 tanpa notifikasi email
          Drive.Permissions.insert(
            { 'role': 'writer', 'type': 'user', 'value': email.trim() },
            folderId,
            { 'sendNotificationEmails': false } 
          );
          Logger.log("✅ Akses Drive (Silent) sukses: " + email);
        } catch (err) {
          Logger.log("❌ Gagal silent share ke " + email + ". Alasan: " + err.message);
          // Jika Silent gagal, gunakan cara biasa sebagai cadangan (tapi akan kirim email)
          newFolder.addEditor(email.trim());
        }
      });
    }

    // Buat Sheet Laporan
    const newSheet = SpreadsheetApp.create(`LOG KERJA - ${entity.title}`);
    const reportData = [
      ["✨ DASHBOARD TUGAS RILL", ""],
      ["KEGIATAN", entity.title], ["PIC", entity.person], ["STATUS", entity.status],
      ["PRIORITAS", entity.priority], ["SUMBER", entity.source], ["LINK NOTION", entity.url]
    ];
    newSheet.getSheets()[0].getRange(1, 1, reportData.length, 2).setValues(reportData);
    newSheet.getSheets()[0].getRange("A1:B1").setBackground("#1a2a6c").setFontColor("white");
    
    DriveApp.getFileById(newSheet.getId()).moveTo(newFolder);
    payload.ref.drive_url = newFolder.getUrl();
    Logger.log("✅ Drive Ref Updated.");

  } catch (e) { 
    Logger.log("❌ Drive Error: " + e.message); 
  }
};