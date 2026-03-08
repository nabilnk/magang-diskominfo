// @ts-nocheck
// agenda.gs - REVISED AS HELPER

// --- KOMENTARI BAGIAN INI AGAR TIDAK BENTROK ---
// const scriptProperties = PropertiesService.getScriptProperties();
// const calendarId = scriptProperties.getProperty('CALENDAR_ID');
// const parentfolderId = scriptProperties.getProperty('PARENT_ID_FOLDER');
// const ws = SpreadsheetApp.getActiveSheet(); 
// ----------------------------------------------

// Fungsi pembantu untuk UI agar tidak error saat testing backend
const getUiSafe = () => {
  try { return SpreadsheetApp.getUi(); } catch (e) { return null; }
};

// Constants (Tetap biarkan karena ini spesifik untuk logika agenda)
// const WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAME_ARRAY = ['michaelanandya','arifkurnia','rahmatadi','anggitobustan','ridhorisadianto','chandradwi','danannurdiansyah','linamunfaroh'];
const DOMAIN = "@semarangkota.go.id";
const FALLBACK_EMAIL = "sandiman_diskominfo" + DOMAIN;

const COLS = {
  DATE_START: 2, TIME_START: 3, DATE_END: 4, TIME_END: 5,
  SOURCE: 6, LABEL: 7, DUTY_DESC: 8, TITLE: 9, DESC: 9,
  LOCATION: 10, ORGANIZER: 11, GUESTS: 12, LINK_DESC: 13,
  FILE: 14, CHECKBOX: 15, CAL_URL: 16, EVENT_ID: 17
};

// Fungsi Helper yang akan dipanggil oleh Handler baru
function getCalendarSafe() {
  return CalendarApp.getCalendarById(CALENDAR_ID); // Ambil CALENDAR_ID dari global.gs
}

function getParentFolderSafe() {
  return DriveApp.getFolderById(PARENT_FOLDER_ID); // Ambil dari global.gs
}

/** 
 * KOMENTARI installableOnEdit LAMA
 * Karena sekarang pintu masuknya lewat webhook.gs
 */
/*
function installableOnEdit(e) {
  // ... (Logika lama di sini tidak dihapus, hanya dinonaktifkan)
}
*/

// --- LOGIKA HELPER YANG TETAP DIPAKAI HANDLER BARU ---

function generateEmails(input) {
  let emailAddresses = [];
  if (!input || input.trim() === "") return '';
  let cleanedInput = input.replace(/\s+/g, ' ').toLowerCase().trim();
  if (cleanedInput.includes('all')) {
    emailAddresses.push(FALLBACK_EMAIL);
    cleanedInput = cleanedInput.replace(/\ball\b/g, '').trim();
  }
  if (!cleanedInput) return emailAddresses.join(',');
  const parts = cleanedInput.includes(',') ? cleanedInput.split(',').map(s => s.trim()) : cleanedInput.split(' ');
  if (!input.includes(',')) {
    for (let i = 0; i < parts.length - 1; i += 2) {
      const fullName = (parts[i] + parts[i + 1]).toLowerCase();
      if (NAME_ARRAY.includes(fullName)) { emailAddresses.push(fullName + DOMAIN); }
    }
  } else {
    for (const part of parts) {
      const fullName = part.replace(/\s+/g, '');
      if (NAME_ARRAY.includes(fullName)) { emailAddresses.push(fullName + DOMAIN); }
    }
  }
  return emailAddresses.join(',');
}

function getTimestamp(date, time, isBlank) {
  const formattedDate = Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), "MM/dd/yyyy");
  const adjustTime = new Date(time.getTime() - 25 * 60 * 1000);
  if (isBlank === 1) {
    const oneHourLater = new Date(adjustTime);
    oneHourLater.setHours(oneHourLater.getHours() + 1);
    const timeStr = Utilities.formatDate(oneHourLater, Session.getScriptTimeZone(), "HH:mm");
    return new Date(formattedDate + " " + timeStr + " GMT+07:00");
  }
  const timeStr = Utilities.formatDate(adjustTime, Session.getScriptTimeZone(), "HH:mm");
  return new Date(formattedDate + " " + timeStr + " GMT+07:00");
}

function generateOutputString(title, source, desc, guests, organizer, duty_desc, link_desc, file, label) {
  const line = "──────────────────────────";
  let uppercaseTitle = title.toString().toUpperCase();
  return `🗓️ <b>${uppercaseTitle}</b>\n${line}\n\n<b>DETAILS</b>\n🏢 Penyelenggara : ${organizer}\n🏷️ Label : ${label}\n🌍 Sumber : ${source}\n\n<b>DESCRIPTION</b>\n${desc}\n\n<b>ASSIGNMENT</b>\n💼 Jenis Tugas : ${duty_desc}\n👥 Disposisi : ${guests}\n\n<b>RESOURCES</b>\n🔗 Link/url : ${link_desc}\n📁 Dokumen pendukung : ${file}\n\n${line}\n<i>Auto-notification by system 🤖</i>`;
}