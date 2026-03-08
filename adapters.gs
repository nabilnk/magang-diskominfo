// adapters.gs
var Adapters = Adapters || {};

Adapters.toEntity = function(payload) {
  if (payload.source === 'notion') {
    const p = payload.raw.data.properties;
    
    // Ambil tanggal dengan sangat hati-hati agar tidak jadi 1970
    const startVal = p['Scheduled Date']?.date?.start;
    const endVal = p['Scheduled Date']?.date?.end;

    return {
      pageId: payload.raw.data.id,
      title: p.Name?.title[0]?.plain_text || "Untitled Task",
      startDate: startVal || new Date().toISOString(), // Fallback ke waktu sekarang jika kosong
      endDate: endVal || startVal || new Date().toISOString(),
      url: payload.raw.data.url || "#",
      // Ambil detail untuk isi konten
      statusName: p.Status?.select?.name || "To Do",
      priorityName: p.Priority?.select?.name || "Medium",
      person: p.PIC?.people?.map(per => per.name).join(', ') || "-",
      picEmail: p.PIC?.people?.[0]?.person?.email || "sandiman_diskominfo@semarangkota.go.id",
      sourceContent: p.Source?.rich_text?.[0]?.text?.content || "-",
      workTime: p['Periode Pengerjaan (hari)']?.number || "0",
      tagName: typeof getTagTitlesFromRelation === 'function' ? getTagTitlesFromRelation(p['Master Tags Database']?.relation) : "-"
    };
  } else {
    // Adapter untuk Sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const data = ss.getSheetByName("Sheet1").getRange(payload.row, 1, 1, 17).getValues()[0];
    return {
      title: data[8],
      startDate: data[1],
      endDate: data[3] || data[1],
      person: data[10] || "-",
      picEmail: typeof generateEmails === 'function' ? generateEmails(data[11]) : "sandiman_diskominfo@semarangkota.go.id",
      statusName: data[13] || "To Do",
      priorityName: "Medium",
      sourceContent: data[5] || "-",
      workTime: "-",
      tagName: data[6] || "-",
      url: data[15] || "#"
    };
  }
};