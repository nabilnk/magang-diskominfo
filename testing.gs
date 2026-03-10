
function testNotionFlow() {
  const pageId = "317e5720418a803ca29ed01588e76f37"; // ID Halaman Asli Notion
  
  Logger.log("📡 Mengambil data rill dari Notion API...");
  
  const options = {
    method: "get",
    headers: { 
      "Authorization": "Bearer " + NOTION_TOKEN, 
      "Notion-Version": "2022-06-28" 
    }
  };
  
  const response = UrlFetchApp.fetch(`https://api.notion.com/v1/pages/${pageId}`, options);
  const realData = JSON.parse(response.getContentText());
  const payload = {
    source: 'notion',
    sync: realData.properties['SyncGWS']?.select?.name || 'Yes',
    raw: { data: realData }
  };

  Logger.log("🚀 Memicu Router dengan Data Rill...");
  Router.dispatch(payload);
}