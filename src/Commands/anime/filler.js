const Command = require('../../Base/Command');
const axios = require('axios')
const cheerio = require('cheerio')
const Discord = require('discord.js')

module.exports = class extends Command {
    constructor() {
        super({
            name: 'filler',
            description: "Sends an anime's filler episodes",
            aliases: ["fillers", "fillerlar"]
        });
    }

    async run(ctx) {
        try {
            let bob = ctx.args.slice(0).join(' ')
        bob = bob.replace(/\s+/g, '-').toLowerCase();
        bob = encodeURI(bob)
          const episodes = await getAnimeFiller(bob);
        let str =  ctx.args.slice(0).join(' ')
       let wan = str.split(' ')
          .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
          .join(' ')
        
        let fillerlar =[]
        let karisik = []
        
        for(var i = 0 ; i < episodes.length ; i++){
                  
         fillerlar.push(episodes[i].filler)
                  
        }
        
        for(var i = 0 ; i < episodes.length ; i++){
                  
         karisik.push(episodes[i].mixed)
                  
        }

        
        
        const embed = new Discord.MessageEmbed()
        .setTitle(wan + " Filler")
        .setColor(12345)
        .setFooter(ctx.message.author.username)
        .setDescription(`**Filler:**\n\`\`\`${fillerlar.join(" ").trim()}\`\`\``)
        .setTimestamp()
        
        ctx.message.channel.send({embeds: [embed]})
          async function getAnimeFiller(anime) {
            const pageUrl = 'https://www.animefillerlist.com/shows/' + anime
          const { data } = await axios.get(pageUrl);
          const $ = cheerio.load(data);
          const canonManga = $('.manga_canon');
          const filler = $('.filler');
          const mixedFillerCanon = $('.mixed_canon\\/filler');
          const canonAnime = $('.anime_canon');
          const AnimeEps = [];
          
          // const Filler = [];
          // const Canon = [];
          // const Mixed = [];
          // const AnimeCanon = [];
      
          canonManga.find('.Episodes a').each((i , element) =>{
              const $element = $(element);
              const  canon = {};
              canon.canon = $element.text();
              AnimeEps.push(canon);
          });
          
          filler.find('.Episodes a').each((i , element) =>{
              const $element = $(element);
              const filler = {};
              filler.filler = $element.text();
              AnimeEps.push(filler);
          });
          mixedFillerCanon.find('.Episodes a').each((i , element) =>{
              const $element = $(element);
              const mixed = {};
              mixed.mixed = $element.text();
              AnimeEps.push(mixed);
          });
          canonAnime.find('.Episodes a').each((i , element) =>{
              const $element = $(element);
              const animeCanon = {};
              animeCanon.animeCanon = $element.text();
              AnimeEps.push(animeCanon);
          });
          return AnimeEps;
      }
        } catch (err) {
            ctx.send(ctx.lang.FILLERERR)
        }
        
          
        
    }
};
