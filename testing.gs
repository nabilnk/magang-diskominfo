// testing.gs
function testFullPipeline() {
  const mockPayload = {
    source: 'notion',
    sync: 'Yes',
    raw: {
      data: {
        id: "317e5720418a8015a177efa263df7f02", // ID ASLI ANDA
        url: "https://www.notion.so/test-page",
        properties: {
          "SyncGWS": { "select": { "name": "Yes" } },
          "Name": { "title": [{ "plain_text": "TUGAS REFACTOR SEMPURNA" }] },
          "Scheduled Date": { 
             "date": { "start": "2026-03-07T08:00:00.000Z", "end": "2026-03-07T10:00:00.000Z" } 
          },
          "Status": { "select": { "name": "In Progress" } },
          "Priority": { "select": { "name": "High" } },
          "Source": { "rich_text": [{ "text": { "content": "Diskominfo" } }] },
          "PIC": { "people": [{ "name": "Nabil NK", "person": {"email": "muh.nabilnk@gmail.com"} }] },
          "Periode Pengerjaan (hari)": { "number": 2 }
        }
      }
    }
  };

  Logger.log("🚀 Memulai Integrasi Penuh dengan Data Lengkap...");
  Router.dispatch(mockPayload);
}