Handlers.sheetHandler = function(payload) {
  Logger.log("--- Mencatat ke Sheet Master ---");
  try {
    const entity = Adapters.toEntity(payload);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Sheet1");
    const targetRow = payload.source === 'sheet' ? payload.row : sheet.getLastRow() + 1;
    
    const start = splitDateAndTime(entity.startDate);
    const end = splitDateAndTime(entity.endDate);

    const rowContent = [
      WEEKDAYS[new Date(entity.startDate).getDay()], // A
      start.date, start.hour, end.date, end.hour,   // B-E
      entity.sourceContent,                         // F
      "",                                           // G (PDF Trigger)
      entity.taskType,                              // H
      entity.title,                                 // I
      entity.location,                              // J
      entity.organizer,                             // K (Penyelenggara)
      entity.person,                                // L (PIC )
      entity.url,                                   // M
      payload.driveUrl || "-",                      // N
      true,                                         // O
      payload.calUrl || "-",                        // P
      payload._generatedCalId || "-"                // Q (Event ID)
    ];

    sheet.getRange(targetRow, 1, 1, 17).setValues([rowContent]);
    sheet.getRange(targetRow, 15).insertCheckboxes().check(); 
    
    Logger.log(`✅ Data Rill Masuk ke Baris ${targetRow}`);
  } catch (e) { Logger.log("❌ SheetHandler Error: " + e.message); }
};