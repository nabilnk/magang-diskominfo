Adapters.toEntity = function(payload) {
  const myEmail = Session.getEffectiveUser().getEmail();

  if (payload.source === 'notion') {
    const p = payload.raw.data.properties;
    const tagNameStr = getTagTitlesFromRelation(p['Master Tags Database']?.relation);  
    const duration = p['Periode Pengerjaan']?.number || 0;

    return {
      pageId: payload.raw.data.id,
      title: p['Name']?.title[0]?.plain_text || "-",
      startDate: p['Scheduled Date']?.date?.start || null,
      endDate: p['Scheduled Date']?.date?.end || p['Scheduled Date']?.date?.start,
      url: payload.raw.data.url,
      statusName: p['Status']?.select?.name || "-",
      priorityName: p['Priority']?.select?.name || "-",
      person: p['PIC']?.people?.map(per => per.name).join(', ') || "-",
      picEmail: p['PIC']?.people?.[0]?.person?.email || myEmail,
      sourceContent: p['Source']?.rich_text[0]?.text?.content || "-",
      location: p['Location']?.rich_text[0]?.text?.content || "-",
      organizer: p['Penyelenggara']?.select?.name || p['Penyelenggara']?.rich_text[0]?.text?.content || "-",
      workTime: duration,
      tagName: tagNameStr || "-",
      taskType: p['Jenis Tugas']?.select?.name || p['Jenis Tugas']?.rich_text[0]?.text?.content || "-"
    };
  } else {    
    const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    const data = ss.getRange(payload.row, 1, 1, 17).getValues()[0];
    return {
      title: data[8], startDate: data[1], endDate: data[3] || data[1],
      person: data[11], picEmail: myEmail, organizer: data[10],
      statusName: data[13], priorityName: "Medium", sourceContent: data[5],
      location: data[9], workTime: data[16], tagName: data[6], url: data[15]
    };
  }
};