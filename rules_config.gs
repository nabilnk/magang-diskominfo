const RULES = [
  // Fitur 1: Isi Nama Hari Otomatis (README Agenda Logic poin 1)
  {
    id: "sheet-auto-fill-day",
    when: "payload.source === 'sheet' && payload.col === 2 && payload.value", 
    execute: ["uiHelperHandler"] // Handler baru untuk urusan tampilan sheet
  },
  // Fitur 2: Sinkronisasi Manual dari Sheet via Checkbox (README Agenda Logic poin 3)
  {
    id: "sheet-agenda-create",
    when: "payload.source === 'sheet' && payload.col === 15 && payload.value === 'TRUE'",
    execute: ["driveHandler", "calendarHandler", "sheetHandler", "notifHub"]
  },
  // Fitur 3: Trigger PDF Parsing (README Agenda Logic poin 2)
  {
    id: "sheet-pdf-parse",
    // PDF Trigger sekarang ada di Baris 4, Kolom 7
    when: "payload.source === 'sheet' && payload.row === 4 && payload.col === 7 && payload.value === 'TRUE'",
    execute: ["pdfHandler"]
  },
  // Fitur 4: Sync dari Notion (README taskSync poin 1-6)
  {
    id: "notion-task-sync",
    when: "payload.source === 'notion' && payload.sync === 'Yes'",
    execute: ["calendarHandler", "driveHandler", "notionHandler", "sheetHandler", "notifHub"]
  }
];

const NOTIF_RULES = [
  {
    id: "sync-notif",
    when: "payload.calUrl || payload.driveUrl",
    template: "fancyTableTemplate", // Menggunakan tampilan mewah Anda
    channels: ["email"]
  }
];