// adapters.gs
var Adapters = Adapters || {};

/**
 * 1. ADAPTER NOTIFICATION (MASTER ADAPTER)
 * Menarik seluruh data rill dari Notion atau Sheet untuk Email, Drive, & Log.
 * Mendukung Multi-PIC dan Perhitungan Durasi Otomatis.
 */
Adapters.notification = function(payload) {
  const myEmail = Session.getEffectiveUser().getEmail();
  const dataRaw = payload.data || (payload.raw ? payload.raw.data : null);

  if (payload.label === 'notion.sync' && dataRaw) {
    // --- SKENARIO DARI NOTION ---
    const p = dataRaw.properties;
    
    // 1. Ambil Nama dari PIC (Rich Text)
    const personName = p['PIC']?.rich_text[0]?.plain_text || "-";

    // 2. Ambil Email dari kolom baru 'Email Penerima'
    const emailRill = p['Email Penerima']?.email || p['Email Penerima']?.rich_text[0]?.plain_text || "";
    const emailList = emailRill ? emailRill.split(",").map(e => e.trim()) : [myEmail];

    return {
      pageId: dataRaw.id,
      title: p['Name']?.title[0]?.plain_text || "-",
      startDate: p['Scheduled Date']?.date?.start,
      endDate: p['Scheduled Date']?.date?.end || p['Scheduled Date']?.date?.start,
      url: dataRaw.url,
      person: personName, // Muncul di tabel Disposisi
      picEmailArray: emailList, // Digunakan NotifHub untuk kirim email
      picEmailsString: emailList.join(','), // Digunakan Calendar
      status: p['Status']?.select?.name || "To Do",
      priority: p['Priority']?.select?.name || "Medium",
      source: p['Source']?.rich_text[0]?.plain_text || "-",
      location: p['Location']?.rich_text[0]?.plain_text || "-",
      organizer: p['Penyelenggara']?.rich_text[0]?.plain_text || "-",
      taskType: p['Jenis Tugas']?.select?.name || "-",
      duration: p['Periode Pengerjaan']?.formula?.number || 1
    };
  } else {
    // --- SKENARIO DARI SHEET (TETAP SAMA SEPERTI PATOKAN ANDA) ---
    const row = payload.data.row;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Sheet1");
    const data = ss.getRange(row, 1, 1, 20).getValues()[0]; 

    const emailPIC = data[12] || ""; // Kolom M (Email)
    let emailList = emailPIC.toString().split(",").map(e => e.trim()).filter(Boolean);

    return {
      title: data[8], startDate: data[1], endDate: data[3] || data[1],
      source: data[5], taskType: data[7], location: data[9], organizer: data[10],
      person: data[11], // Kolom L (Nama)
      picEmailArray: emailList.length > 0 ? emailList : [myEmail],
      picEmailsString: emailList.join(','),
      status: data[18] || "To Do", 
      priority: data[19] || "Medium",
      duration: Math.ceil(Math.abs(new Date(data[3]) - new Date(data[1])) / (1000 * 60 * 60 * 24)) + 1,
      url: data[13] || "#"
    };
  }
};

/**
 * 2. ADAPTER CALENDAR
 * Mengonversi data dari notification menjadi objek Date yang dimengerti GCal.
 */
Adapters.calendar = function(payload) {
  const entity = Adapters.notification(payload);
  return {
    title: entity.title,
    start: new Date(entity.startDate),
    end: new Date(entity.endDate),
    location: entity.location || "-"
  };
};

/**
 * 3. ADAPTER DRIVE & NOTION
 */
Adapters.drive = function(payload) { return Adapters.notification(payload); };

Adapters.notion = function(payload) { 
  const dataRaw = payload.data || (payload.raw ? payload.raw.data : null);
  return { pageId: dataRaw ? dataRaw.id : null }; 
};