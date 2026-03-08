var Handlers = Handlers || {};
var Adapters = Adapters || {};
var MessageBuilder = MessageBuilder || {};
var Channels = Channels || {};

var scriptProperties = PropertiesService.getScriptProperties();


var CALENDAR_ID = scriptProperties.getProperty('CALENDAR_ID');
var SPREADSHEET_ID = scriptProperties.getProperty('SPREADSHEET_ID');
var NOTION_TOKEN = (scriptProperties.getProperty('NOTION_TOKEN') || "").trim();
var DATABASE_ID = (scriptProperties.getProperty('DATABASE_ID') || "").trim();
var PARENT_FOLDER_ID = scriptProperties.getProperty('PARENT_ID_FOLDER');

var WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];