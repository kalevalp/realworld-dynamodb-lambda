const ingestion = require('watchtower-log-ingestion');
const eventTable = process.env['WATCHTOWER_EVENT_TABLE'];
const properties = require('./watchtower-property');

module.exports.handler = ingestion.createIngestionHandler(eventTable, properties);
