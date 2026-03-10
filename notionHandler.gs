var Handlers = Handlers || {};

Handlers.notionHandler = function(payload) {
  Logger.log("--- Starting Notion Handler (Two-Way) ---");
  const entity = Adapters.toEntity(payload);
  const calUrl = payload.calUrl;

  try {
    if (payload.source === 'notion') {
      // SKENARIO 1: Update Link ke baris yang sudah ada
      updatedtoNotion({ pageId: entity.pageId }, calUrl);
      Logger.log("✅ Notion: Baris yang ada berhasil di-update link-nya.");
    } 
    else if (payload.source === 'sheet') {
      // SKENARIO 2: Buat baris BARU di Notion (Karena user input dari Sheet)
      const newPagePayload = {
        "parent": { "database_id": DATABASE_ID },
        "properties": {
          "Name": { "title": [{ "text": { "content": entity.title } }] },
          "Scheduled Date": { "date": { "start": entity.startDate } },
          "SyncGWS": { "select": { "name": "Yes" } },
          "URL GCalendar": { "url": calUrl || "" }
        }
      };
      
      const response = notionApiRequest("https://api.notion.com/v1/pages", newPagePayload, 'POST');
      if (response) {
        Logger.log("✅ Notion: Baris baru berhasil dibuat otomatis dari Sheet.");
      }
    }
  } catch (error) {
    Logger.log("❌ Error in notionHandler: " + error.message);
  }
};