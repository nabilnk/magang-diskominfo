// taskSync.gs - COMPLETE HELPER LIBRARY

// --- BAGIAN 1: API WRAPPERS (Jantung Koneksi Notion) ---

function getNotionHeaders() {
  return {
    "Authorization": "Bearer " + NOTION_TOKEN, // Diambil dari 0_global.gs
    "Accept": "application/json",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };
}

/**
 * Fungsi Wrapper untuk memanggil API Notion dengan Error Handling
 */
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
    Logger.error(`❌ Notion API Error [${method}]: ` + responseText);
    return null;
  }
}

// --- BAGIAN 2: LOGIKA UPDATE (Dipanggil oleh notionHandler) ---

function updatedtoNotion(dataNotion, urlCal) {
  const payload_page = {
    "properties": {
      "URL GCalendar": { "url": urlCal }
      // Tambahkan update status jika perlu
    }
  };
  
  const urlPage = `https://api.notion.com/v1/pages/${dataNotion.pageId}`;
  return notionApiRequest(urlPage, payload_page, 'patch');
}

// --- BAGIAN 3: LOGIKA TAG & RELASI (PENTING!) ---

/**
 * Mengubah ID Tag (Relation) menjadi Nama Asli
 * Dipanggil di dalam adapters.gs
 */
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
  return cacheTagMap(); // Rebuild jika cache kosong
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

// --- BAGIAN 4: FORMATTING HELPERS ---

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

// Tambahkan fungsi warna untuk Email
function getStatusColor(statusName) {
  switch (statusName) {
    case 'Done': return { bg: '#e6fffa', text: '#38b2ac' };
    case 'In Progress': return { bg: '#fffaf0', text: '#dd6b20' };
    default: return { bg: '#e9d8fd', text: '#805ad5' };
  }
}