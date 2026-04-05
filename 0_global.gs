var Handlers = Handlers || {};
var Adapters = Adapters || {};
var MessageBuilder = MessageBuilder || {};

var scriptProperties = PropertiesService.getScriptProperties();
var CALENDAR_ID = scriptProperties.getProperty('CALENDAR_ID');
var SPREADSHEET_ID = scriptProperties.getProperty('SPREADSHEET_ID');
var PARENT_FOLDER_ID = scriptProperties.getProperty('PARENT_ID_FOLDER');
var NOTION_TOKEN = scriptProperties.getProperty('NOTION_TOKEN');
var DATABASE_ID = scriptProperties.getProperty('DATABASE_ID');
var WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];