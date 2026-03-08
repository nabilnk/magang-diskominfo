// calendarHandler.gs
var Handlers = Handlers || {};

Handlers.calendarHandler = function(payload) {
  Logger.log("--- Starting Calendar Handler ---");
  const entity = Adapters.toEntity(payload);

  try {
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    const startTime = new Date(entity.startDate);
    const endTime = new Date(entity.endDate);

    const event = calendar.createEvent(entity.title, startTime, endTime, {
      location: entity.location || "",
      // GUNAKAN FUNGSI DI taskSync.gs UNTUK ISI KONTEN
      description: buildCalendarDescription(entity) 
    });

    // Link URL Base64
    var eventId = event.getId().split('@')[0];
    var encodedId = Utilities.base64Encode(eventId + " " + CALENDAR_ID).replace(/=/g, "");
    payload.calUrl = "https://www.google.com/calendar/event?eid=" + encodedId;

    Logger.log("✅ GCal Created dengan Isi Konten");
  } catch (error) {
    Logger.log("❌ Error in calendarHandler: " + error.message);
  }
};