const RULES = [
  {
    id: "sheet-auto-fill-day",
    when: "payload.source === 'sheet' && payload.col === 2 && payload.value", 
    execute: ["uiHelperHandler"] 
  },
  {
    id: "sheet-agenda-create",
    when: "payload.source === 'sheet' && payload.col === 15 && payload.value === 'TRUE'",
    execute: ["driveHandler", "calendarHandler", "sheetHandler", "notifHub"]
  },
  {
    id: "sheet-pdf-parse",
    when: "payload.source === 'sheet' && payload.row === 4 && payload.col === 7 && payload.value === 'TRUE'",
    execute: ["pdfHandler"]
  },
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
    template: "fancyTableTemplate", 
    channels: ["email"]
  }
];