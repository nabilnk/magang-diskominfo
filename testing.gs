// testing.gs

function testRestApiSync() {
  const pageId = "335e5720418a80b3b111da09e83ace47";
  
  // 1. Ambil data mentah (Simulasi data yang masuk ke pintu)
  const options = { method: "get", headers: { "Authorization": "Bearer " + NOTION_TOKEN, "Notion-Version": "2022-06-28" } };
  const response = UrlFetchApp.fetch(`https://api.notion.com/v1/pages/${pageId}`, options);
  const incomingData = JSON.parse(response.getContentText());

  // 2. Bungkus dengan Label (Penentuan label sebelum masuk ke router)
  const requestPayload = {
    label: "notion.sync", // INI LABELNYA
    data: incomingData,
    ref: {}
  };

  Logger.log(`🚀 Incoming Request with Label: ${requestPayload.label}`);
  
  // 3. Router hanya bertugas mengevaluasi label tersebut
  Router.dispatch(requestPayload);
  
  Logger.log("🏁 Result Ref: " + JSON.stringify(requestPayload.ref));
}
