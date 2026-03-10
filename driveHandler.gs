Handlers.driveHandler = function(payload) {
  Logger.log("--- Membuat Folder & Detail Isi ---");
  const entity = Adapters.toEntity(payload);
  const parent = DriveApp.getFolderById(PARENT_FOLDER_ID);
  const newFolder = parent.createFolder(`[TASK] ${entity.title}`);
  
  
  const newSheetFile = SpreadsheetApp.create(`Detail Kerja - ${entity.title}`);
  const sheet = newSheetFile.getSheets()[0];
  
  
  const detailData = [
    ["PROPERTI", "DETAIL TUGAS"],
    ["Judul", entity.title],
    ["PIC", entity.person],
    ["Status", entity.statusName],
    ["Prioritas", entity.priorityName],
    ["Deadline", entity.startDate],
    ["Sumber", entity.sourceContent]
  ];
  sheet.getRange(1, 1, detailData.length, 2).setValues(detailData);
  sheet.getRange("A1:B1").setBackground("#3b82f6").setFontColor("white").setFontWeight("bold");

  DriveApp.getFileById(newSheetFile.getId()).moveTo(newFolder);
  payload.driveUrl = newFolder.getUrl();
  Logger.log("✅ Folder Drive & Detail Sheet Berhasil Dibuat");
};