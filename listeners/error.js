const { Listener } = require('discord-akairo');

class ErrorComamndListener extends Listener {
    constructor() {
        super('error', {
            emitter: 'commandHandler',
            eventName: 'error'
        });
    }

    exec() {
        
    }
}

module.exports = ReadyListener;
