const Command = require('../../Base/Command');

module.exports = class extends Command {
    constructor() {
        super({
            name: 'lang',
            description: "Set or see the bot's language",
            aliases: ["dil"]
        });
    }

    async run(ctx) {
        let langs;
        if(!ctx.args[0]) return ctx.send(ctx.lang.LANG);

        if(!ctx.message.member.permissions.has("MANAGE_SERVER")) return ctx.send(ctx.lang.PERMS.MANAGE_SERVER)

        if(ctx.args[0].toLowerCase() == "english" || ctx.args[0].toLowerCase() == "en") langs = "en"
        if(ctx.args[0].toLowerCase() == "türkçe" || ctx.args[0].toLowerCase() == "tr" || ctx.args[0].toLowerCase() == "turkish") langs = "tr"


        
        ctx.db.set(`lang_${ctx.message.guild.id}`, langs)

        if (langs == "en") {
            ctx.send(ctx.lang.SETLANG_SUCCESS[1])
        }

        if (langs == "tr") {
            ctx.send(ctx.lang.SETLANG_SUCCESS[0])
        }
        
        
        
    }
};
