# site-monitor
A simple site pinger written in node.js.

## Scope
This app is made to run simple HTTP requests for a given uri and check the response code specified by the user. Eventually, the monitors will run in multiple public clouds simultaneously.

## Components
### Web UI
A simple user interface for managing organizations and their checks.

### Admin UI
A simple admin interface for managing system components.

### HTTP API
JSON REST API for interacting with application data.

### Config/DB
Where all application information and data is stored.

### monitors
Processes that run checks at scheduled intervals.
