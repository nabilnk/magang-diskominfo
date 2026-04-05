// pdfHandler.gs
Handlers.pdfHandler = function(payload) {
  Logger.log("--- Menjalankan Robot PDF Parsing ---");
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast("🤖 Memulai ekstraksi data dari PDF...", "Processing", 5);

    if (typeof pdfToAgenda === 'function') {
      pdfToAgenda(); // Panggil fungsi di agenda.gs (KEEP)
      Logger.log("✅ PDF Parsing Selesai.");
      SpreadsheetApp.getActiveSpreadsheet().toast("Baris agenda baru dari PDF telah ditambahkan!", "Selesai", 5);
    } else {
      throw new Error("Fungsi 'pdfToAgenda' tidak ditemukan.");
    }

    // Matikan kembali checkbox G4
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1").getRange(4, 7).uncheck();

  } catch (e) {
    Logger.log("❌ PDF Error: " + e.message);
    SpreadsheetApp.getUi().alert("Gagal: " + e.message);
  }
};