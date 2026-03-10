Handlers.calendarHandler = function(payload) {
  Logger.log("--- Starting Calendar Handler ---");
  const entity = Adapters.toEntity(payload);

  try {
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    const startTime = new Date(entity.startDate);
    const endTime = new Date(entity.endDate);
    const event = calendar.createEvent(entity.title, startTime, endTime, {
      location: entity.location || "",
      description: buildCalendarDescription(entity) 
    });

    const eventId = event.getId();
    payload._generatedCalId = eventId;

    var cleanId = eventId.split('@')[0];
    var encoded = Utilities.base64Encode(cleanId + " " + CALENDAR_ID).replace(/=/g, "");
    payload.calUrl = "https://www.google.com/calendar/event?eid=" + encoded;

    Logger.log("✅ GCal Created dengan Data Rill");
  } catch (error) {
    Logger.log("❌ GCal Error: " + error.message);
  }
};