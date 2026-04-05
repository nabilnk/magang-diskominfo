// sheetHandler.gs
Handlers.sheetHandler = function(payload) {
  Logger.log("--- Mencatat Hasil Kerja ke Sheet ---");
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Sheet1");
    const targetRow = payload.label === 'sheet.editagenda' ? payload.data.row : sheet.getLastRow() + 1;

    if (payload.label === 'sheet.editagenda') {
      // Update Kolom N(14), O(15), Q(17), R(18)
      if (payload.ref.notion_url) sheet.getRange(targetRow, 14).setValue(payload.ref.notion_url);
      sheet.getRange(targetRow, 15).setValue(payload.ref.drive_url || "-");
      sheet.getRange(targetRow, 17).setValue(payload.ref.calendar_url || "-");
      sheet.getRange(targetRow, 18).setValue(payload.ref.calendar_id || "-");
    } else {
      // Skenario Notion ke Sheet (Baris Baru Lengkap A-T)
      const entity = Adapters.notification(payload);
      const start = splitDateAndTime(entity.startDate);
      const end = splitDateAndTime(entity.endDate);
      const rowContent = [
        WEEKDAYS[new Date(entity.startDate).getDay()], start.date, start.hour, end.date, end.hour,
        entity.source, "", entity.taskType, entity.title, entity.location, entity.organizer,
        entity.person, entity.picEmailArray.join(','), entity.url, payload.ref.drive_url, true, 
        payload.ref.calendar_url, payload.ref.calendar_id, entity.status, entity.priority
      ];
      sheet.getRange(targetRow, 1, 1, 20).setValues([rowContent]);
      sheet.getRange(targetRow, 7).insertCheckboxes();
      sheet.getRange(targetRow, 16).insertCheckboxes().check();
    }
  } catch (e) { Logger.log("❌ Sheet Error: " + e.message); }
};