// driveHandler.gs
var Handlers = Handlers || {};

Handlers.driveHandler = function(payload) {
  Logger.log("--- Starting Drive Handler ---");
  try {
    const entity = Adapters.toEntity(payload);
    const parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
    const newFolder = parentFolder.createFolder(`[TASK] ${entity.title}`);
    
    // 1. Buat Spreadsheet Baru
    const newSheetFile = SpreadsheetApp.create(`Log Kerja - ${entity.title}`);
    const ssId = newSheetFile.getId();
    
    // 2. ISI DATA KE DALAM SHEET TERSEBUT (Agar tidak kosong)
    const sheet = newSheetFile.getSheets()[0];
    sheet.getRange("A1:B1").setValues([["JUDUL TUGAS", "TANGGAL MULAI"]]).setFontWeight("bold");
    sheet.getRange("A2:B2").setValues([[entity.title, entity.startDate]]);
    
    // 3. Pindahkan ke Folder
    DriveApp.getFileById(ssId).moveTo(newFolder);

    payload.driveUrl = newFolder.getUrl();
    Logger.log("✅ Drive Folder & Populated Sheet Created");
  } catch (error) {
    Logger.log("❌ Error in driveHandler: " + error.message);
  }
};