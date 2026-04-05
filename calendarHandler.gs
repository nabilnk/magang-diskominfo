// calendarHandler.gs
Handlers.calendarHandler = function(payload) {
  Logger.log("--- Memproses Calendar ---");
  try {
    const config = Adapters.notification(payload); // Gunakan adapter utama
    const calendar = CalendarApp.getCalendarById('primary'); 

    // 1. BUAT EVENT
    const event = calendar.createEvent(config.title, new Date(config.startDate), new Date(config.endDate), {
      location: config.location,
      description: buildCalendarDescription(config),
      sendInvites: false
    });

    event.setColor('1'); // Biru

    // 2. SIMPAN HASIL KE REF
    const eid = event.getId().split('@')[0];
    payload.ref.calendar_id = eid;
    payload.ref.calendar_url = "https://www.google.com/calendar/event?eid=" + 
        Utilities.base64Encode(eid + " " + Session.getEffectiveUser().getEmail()).replace(/=/g, "");
    
    Logger.log("✅ GCal Created: " + payload.ref.calendar_url);
  } catch (e) { Logger.log("❌ Calendar Error: " + e.message); }
};