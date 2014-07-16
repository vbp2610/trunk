var protocol = require('./protocol');
var fc={};
var commandHandler = function(frontend_client){
	fc = this._frontendClient = frontend_client;
	addCommandShorthands();
};
function addCommand(domainName, command) {
	fc[domainName]['commands'] = fc[domainName]['commands'] || {};
    fc[domainName]['commands'][command.name] = function (params, callback) {
        fc.send(domainName + '.' + command.name, params, callback);
    };
}

function addEvent(domainName, event) {
	fc[domainName]['events'] = fc[domainName]['events'] || {};
  	fc[domainName]['events'][event.name] = function (handler) {
        fc.on(domainName + '.' + event.name, handler);
    };
}

function addType(domainName, type) {
	fc[domainName]['types'] = fc[domainName]['types'] || {};
    fc[domainName]['types'][type.id] = type;
}
function addCommandShorthands() {


    for (var domainIdx in protocol.domains) {
        var domain = protocol.domains[domainIdx];
        var domainName = domain.domain;
        fc[domainName] = {};
        // add commands
        var commands = domain.commands;
        if (commands) {
            for (var commandIdx in commands) {
                var command = commands[commandIdx];
                addCommand(domainName, command);
            }
        }
        // add events
        var events = domain.events;
        if (events) {
            for (var eventIdx in events) {
                var event = events[eventIdx];
                addEvent(domainName, event);
            }
        }
        // add types
        var types = domain.types;
        if (types) {
            for (var typeIdx in types) {
                var type = types[typeIdx];
                addType(domainName, type);
            }
        }
    }
}

module.exports = commandHandler;