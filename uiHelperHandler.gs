// uiHelperHandler.gs
Handlers.uiHelperHandler = function(payload) {
  if (payload.source !== 'sheet' || payload.col !== 2) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const row = payload.row;
  const dateVal = sheet.getRange(row, 2).getValue();

  if (dateVal instanceof Date) {
    // 1. Isi Nama Hari di Kolom A
    const dayName = WEEKDAYS[dateVal.getDay()];
    sheet.getRange(row, 1).setValue(dayName);

    // 2. Munculkan Checkbox di Kolom O (Kolom 15)
    sheet.getRange(row, 15).insertCheckboxes();
    
    Logger.log("✅ UI Updated: Hari & Checkbox disiapkan.");
  }
};