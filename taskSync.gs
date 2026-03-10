function getNotionHeaders() {
  return {
    "Authorization": "Bearer " + NOTION_TOKEN,
    "Accept": "application/json",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };
}

function notionApiRequest(url, payload_dict, method) {
  let options = {
    method: method,
    headers: getNotionHeaders(),
    muteHttpExceptions: true,
    ...(payload_dict && { payload: JSON.stringify(payload_dict) }),
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseText = response.getContentText();
  
  if (response.getResponseCode() === 200) {
    return JSON.parse(responseText);
  } else {
    Logger.log(`❌ Notion API Error [${method}]: ` + responseText);
    return null;
  }
}

function updatedtoNotion(dataNotion, urlCal) {
  const payload_page = {
    "properties": {
      "URL GCalendar": { "url": urlCal }
    }
  };
  const urlPage = `https://api.notion.com/v1/pages/${dataNotion.pageId}`;
  return notionApiRequest(urlPage, payload_page, 'patch');
}

function getTagTitlesFromRelation(relation) {
  if (!Array.isArray(relation) || relation.length === 0) return '';
  const tagMap = getTagMap();
  if (!tagMap || Object.keys(tagMap).length === 0) return '';
  const titles = [];
  for (let i = 0; i < relation.length; i++) {
    const id = relation[i]?.id;
    if (!id) continue;
    const title = tagMap[id];
    if (title) titles.push(title);
  }
  return titles.join(', ');
}

function getTagMap() {
  const raw = scriptProperties.getProperty('tagMap');
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { }
  }
  return cacheTagMap();
}

function cacheTagMap() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('MasterTags');
  if (!sheet) return {};
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return {};
  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  const map = {};
  for (let i = 0; i < values.length; i++) {
    const id = String(values[i][0]).trim();
    const title = String(values[i][1]).trim();
    if (id && title) map[id] = title;
  }
  scriptProperties.setProperty('tagMap', JSON.stringify(map));
  return map;
}

function fetchMasterTagsToSheet() {
  const masterTagsDatabaseId = scriptProperties.getProperty('MASTER_TAG_DATABASE_ID');
  if (!masterTagsDatabaseId) {
    Logger.log("❌ MASTER_TAG_DATABASE_ID tidak ditemukan!");
    return;
  }
  Logger.log("📡 Mengambil daftar Tag dari Notion...");
  const url = `https://api.notion.com/v1/databases/${masterTagsDatabaseId}/query`;
  const response = notionApiRequest(url, { page_size: 100 }, 'POST');
  if (!response || !response.results) {
    Logger.log("❌ Gagal mengambil data Master Tags.");
    return;
  }
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('MasterTags');
  if (!sheet) { sheet = ss.insertSheet('MasterTags'); }
  sheet.clearContents();
  sheet.appendRow(['ID', 'Nama Tag']);
  response.results.forEach(page => {
    const id = page.id;
    const name = page.properties.Name?.title[0]?.plain_text || "(Untitled)";
    sheet.appendRow([id, name]);
  });
  Logger.log("✅ Sheet 'MasterTags' diperbarui.");
  cacheTagMap();
}

function splitDateAndTime(inputDate) {
  if (!inputDate) return { date: "-", hour: "-" };
  const TZ = Session.getScriptTimeZone();
  const d = new Date(inputDate);
  return {
    date: Utilities.formatDate(d, TZ, 'dd/MM/yyyy'),
    hour: Utilities.formatDate(d, TZ, 'HH:mm')
  };
}

function buildCalendarDescription(entity) {
  const start = splitDateAndTime(entity.startDate);
  const end = splitDateAndTime(entity.endDate);
  const line = '──────────────────────────';
  return [
    `📌 <b><a href="${entity.url}">${entity.title.toUpperCase()}</a></b>`,
    line,
    `📆 <b>Timeline:</b> ${start.date} ${start.hour} → ${end.date} ${end.hour}`,
    `👥 <b>Disposisi:</b> ${entity.person}`,
    `⭐ <b>Prioritas:</b> ${entity.priorityName}`,
    `💼 <b>Jenis Tugas:</b> ${entity.taskType}`,
    `⏳ <b>Durasi:</b> ${entity.workTime} hari`,
    '',
    `🌐 <b>Sumber:</b> ${entity.sourceContent}`,
    `📂 <b>Status:</b> ${entity.statusName}`,
    `🏷️ <b>Tags:</b> ${entity.tagName || '-'}`,
    '',
    line,
    `<i>💡 Klik judul untuk membuka tugas di Notion</i>`
  ].join('\n');
}

function getStatusColor(statusName) {
  switch (statusName) {
    case 'Done': return { bg: '#e6fffa', text: '#38b2ac' };
    case 'In Progress': return { bg: '#fffaf0', text: '#dd6b20' };
    default: return { bg: '#e9d8fd', text: '#805ad5' };
  }
}