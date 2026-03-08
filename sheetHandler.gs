// sheetHandler.gs
Handlers.sheetHandler = function(payload) {
  Logger.log("--- Starting Sheet Handler (Precision Mode) ---");
  
  try {
    const entity = Adapters.toEntity(payload);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Sheet1");
    
    let targetRow;
    if (payload.source === 'sheet') {
      // Jika dari Sheet, update baris yang sedang diedit
      targetRow = payload.row;
    } else {
      // Jika dari Notion, cari baris kosong paling bawah
      targetRow = sheet.getLastRow() + 1;
    }

    const start = splitDateAndTime(entity.startDate);
    const end = splitDateAndTime(entity.endDate);

    // Menyiapkan satu baris data lengkap (17 Kolom: A sampai Q)
    // Kosongkan kolom yang tidak ada datanya dengan ""
    const rowContent = [
      WEEKDAYS[new Date(entity.startDate).getDay()], // A: Hari
      start.date,       // B: Tanggal Mulai
      start.hour,       // C: Jam Mulai
      end.date,         // D: Tanggal Selesai
      end.hour,         // E: Jam Selesai
      "NOTION",         // F: Sumber
      "",               // G: PDF Trigger
      "Tugas",          // H: Jenis Tugas
      entity.title,     // I: Judul Tugas
      entity.location,  // J: Lokasi
      "-",              // K: Penyelenggara
      entity.person,    // L: Disposisi (PIC)
      entity.url,       // M: Link Pendukung
      payload.driveUrl, // N: File Drive (Hasil estafet)
      true,             // O: Checkbox Sync (Set TRUE)
      payload.calUrl,   // P: URL GCalendar (Hasil estafet)
      ""                // Q: Event ID
    ];

    // Masukkan data ke baris tujuan secara sekaligus
// --- STYLING BARIS BARU ---
    const targetRange = sheet.getRange(targetRow, 1, 1, 17);
    targetRange.setVerticalAlignment("middle");
    targetRange.setFontSize(10);
    
    // Warna selang-seling
    if (targetRow % 2 === 0) {
      targetRange.setBackground("#f8f9fa");
    } else {
      targetRange.setBackground("#ffffff");
    }
    
    // Garis bawah tipis
    targetRange.setBorder(null, null, true, null, null, null, "#eeeeee", SpreadsheetApp.BorderStyle.SOLID);
    
    Logger.log(`✅ Data berhasil masuk ke Baris ${targetRow} kolom A-Q`);

  } catch (error) {
    Logger.log("❌ Error in sheetHandler: " + error.message);
  }
};