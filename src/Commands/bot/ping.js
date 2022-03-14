const Command = require('../../Base/Command');

module.exports = class extends Command {
    constructor() {
        super({
            name: 'ping',
            description: "Sends bot's websocket ping",
            aliases: []
        });
    }

    async run(ctx) {
        ctx.send(ctx.lang.PING.replace("<ping>", ctx.bot.ws.ping));
    }
};
