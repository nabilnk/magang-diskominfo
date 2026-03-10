var Handlers = Handlers || {};

Handlers.pdfHandler = function(payload) {
  Logger.log("--- Starting PDF Parsing ---");
  if (typeof pdfToAgenda === 'function') {
    pdfToAgenda();
    Logger.log("✅ PDF Parsing Finished");
  } else {
    Logger.error("❌ Fungsi pdfToAgenda tidak ditemukan di helper.");
  }
};