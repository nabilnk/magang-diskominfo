// webhook.gs

function doPost(e) {
  try {
    const label = e.parameter.label || "notion.sync"; 
    const rawData = JSON.parse(e.postData.contents);
    Router.dispatch({ label: label, data: rawData.data || rawData, ref: {} });
    return ContentService.createTextOutput("SUCCESS").setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput("Error").setStatusCode(400);
  }
}
// webhook.gs

function installableOnEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== 'Sheet1') return;
  const row = e.range.getRow();
  const col = e.range.getColumn();
  const val = e.value;

  // 1. Pemicu PDF (Header Baris 4, Kolom 7)
  if (row === 4 && col === 7 && val === 'TRUE') {
    Router.dispatch({ label: "sheet.pdfparse", data: { row: row, col: col, value: val }, ref: {} });
    return;
  }
  if (row <= 4) return;

  // 2. AUTOFILL HARI (PERBAIKAN TOTAL)
  if (col === 2 && val) {
    // Ambil objek Date asli dari sel (Bukan dari teks e.value)
    const dateCell = sheet.getRange(row, 2).getValue();
    
    if (dateCell instanceof Date) {
      // Ambil index hari (0=Minggu, 1=Senin, 2=Selasa, dst)
      const dayIndex = dateCell.getDay();
      const listHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const namaHari = listHari[dayIndex];

      // Isi Kolom A
      sheet.getRange(row, 1).setValue(namaHari);
      
      // Munculkan Checkbox di G dan P
      sheet.getRange(row, 7).insertCheckboxes();
      sheet.getRange(row, 16).insertCheckboxes();
      
      Logger.log(`✅ UI Updated: 07/04/2026 terdeteksi sebagai ${namaHari} (Selasa)`);
    }
  }

  // 3. PEMICU SINKRONISASI (P/16)
  if (col === 16 && val === 'TRUE') {
    Router.dispatch({
      label: "sheet.editagenda",
      data: { row: row, col: col, value: val },
      ref: {}
    });
  }
}