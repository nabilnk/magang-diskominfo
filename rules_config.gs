const RULES = [
  {
    id: "notion-task-sync",
    description: "Sinkronisasi tugas dari Notion ke Calendar, Drive, dan Sheet",
    when: "payload.label === 'notion.sync'",
    execute: ["calendarHandler", "driveHandler", "notionHandler", "sheetHandler", "notifHub"]
  },
  {
    id: "sheet-agenda-create",
    description: "Sinkronisasi dari Sheet ke GWS & Notion",
    when: "payload.label === 'sheet.editagenda'",
    execute: ["driveHandler", "calendarHandler", "notionHandler", "sheetHandler", "notifHub"]
  },
  {
    id: "SHEET_PDF_PARSE",
    description: "Parse PDF dari Sheet dan simpan ke Drive",
    when: "payload.label === 'sheet.pdfparse'",
    execute: ["pdfHandler"]
  }
];

const NOTIF_RULES = [
  {
    id: "notif-integrated",
    // Notif jalan jika di payload.ref sudah ada URL hasil proses
    when: "payload.ref.calendar_url || payload.ref.drive_url",
    template: "fancyTableTemplate", 
    channels: ["email"]
  }
];