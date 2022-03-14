const Command = require('../../Base/Command');
const schedule = require("../../getNextEpisode.js");

module.exports = class extends Command {
    constructor() {
        super({
            name: 'when',
            description: "When did i ask",
            aliases: []
        });
    }

    async run(ctx) {
        if(!ctx.args[0]) return ctx.send("Missing Parameter")
        let loli = ctx.args.join(' ')
        schedule(loli, ctx);

       
    }
};
