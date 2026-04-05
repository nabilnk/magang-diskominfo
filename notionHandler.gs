// notionHandler.gs
Handlers.notionHandler = function(payload) {
  Logger.log("--- Menjalankan Robot Notion (Full Sync A-T) ---");
  try {
    const calUrl = payload.ref.calendar_url || "";
    const entity = Adapters.notification(payload);

    if (payload.label === 'notion.sync') {
      updatedtoNotion({ pageId: entity.pageId || payload.data.id }, calUrl);
    } 
    else if (payload.label === 'sheet.editagenda') {
      
    const newPageData = {
        "parent": { "database_id": DATABASE_ID },
        "properties": {
          "Name": { "title": [{ "text": { "content": entity.title } }] },
          "Scheduled Date": { "date": { "start": new Date(entity.startDate).toISOString(), "end": new Date(entity.endDate).toISOString() } },
          "SyncGWS": { "select": { "name": "Yes" } },
          "URL GCalendar": { "url": calUrl },
          "Status": { "select": { "name": entity.status } },
          "Priority": { "select": { "name": entity.priority } },
          "Location": { "rich_text": [{ "text": { "content": entity.location } }] },
          "PIC": { "rich_text": [{ "text": { "content": entity.person } }] },
          "Penyelenggara": { "rich_text": [{ "text": { "content": entity.organizer } }] },
          "Jenis Tugas": { "select": { "name": entity.taskType } },
          "Source": { "rich_text": [{ "text": { "content": entity.source } }] },
          
          // TAMBAHKAN INI: Kirim email dari Sheet ke kolom baru di Notion
          "Email Penerima": { "email": entity.picEmailsString } 
        }
      };

      const response = notionApiRequest("https://api.notion.com/v1/pages", newPageData, 'POST');
      
      if (response && response.url) {
        payload.ref.notion_url = response.url;
        Logger.log("✅ Notion Created Success: " + response.url);
      } else {
        Logger.log("❌ Notion Failed: Cek Log API.");
      }
    }
  } catch (e) {
    Logger.log("❌ Notion Handler Error: " + e.message);
  }
};