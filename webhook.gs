function doPost(e) {
  try {
    const raw = JSON.parse(e.postData.contents);
    const notionData = raw.data || raw; 
    
    const payload = { 
      source: 'notion', 
      raw: { data: notionData },
      sync: notionData.properties?.SyncGWS?.select?.name 
    };

    Router.dispatch(payload);
    return ContentService.createTextOutput("SUCCESS").setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log("❌ doPost Error: " + err.message);
    return ContentService.createTextOutput("Error").setStatusCode(400);
  }
}

function installableOnEdit(e) {
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();
  
  // 1. hanya jalan di Sheet1
  if (sheetName !== 'Sheet1') return;

  // 2. DEKLARASI VARIABEL (PENTING: Harus di awal agar tidak error)
  const row = e.range.getRow();
  const col = e.range.getColumn();
  const val = e.value;

  // 3. PENGECEKAN (Abaikan header/banner baris 1-4)
  if (row <= 4) return;

  // 4. PAYLOAD
  const payload = {
    source: 'sheet',
    row: row,
    col: col,
    value: val,
    oldValue: e.oldValue,
    sheetName: sheetName,
    raw: e
  };

  Logger.log(`[TRIGGER] Edit di Baris ${row} Kolom ${col}`);
  
  // 5. KIRIM KE ROUTER
  Router.dispatch(payload);
}