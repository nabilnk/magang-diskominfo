// notionHandler.gs
var Handlers = Handlers || {};

Handlers.notionHandler = function(payload) {
  Logger.log("--- Starting Notion Handler ---");

  // Jika sumber bukan dari Notion, lewati
  if (payload.source !== 'notion') return;

  try {
    const entity = Adapters.toEntity(payload);
    const calUrl = payload.calUrl; 

    if (calUrl) {
      // Panggil helper di taskSync.gs
      updatedtoNotion({ pageId: entity.pageId || payload.raw.data.id }, calUrl);
      Logger.log("✅ Notion Updated with GCal Link");
    }
  } catch (error) {
    Logger.log("❌ Error in notionHandler: " + error.message);
  }
};