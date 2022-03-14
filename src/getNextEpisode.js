var endeavor = require("endeavor");
var countdown = require("./countdown.js");
var moment = require("moment");
const Discord = require('discord.js')

function getNextEpisode(anime, ctx, dm = false) {
  const query = `query ($id: Int, $page: Int, $perPage: Int, $search: String, $type: MediaType) {
    Page (page: $page, perPage: $perPage) {
      media (id: $id, search: $search, type: $type) {
        id
        idMal
        title {
          romaji,
          english,
          native
        }
        type
        status
        updatedAt
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        episodes
        nextAiringEpisode {
          episode
          airingAt
          timeUntilAiring
        }
      }
    }
  }`;
  const variables = {
    search: anime,
    page: 1,
    perPage: 100,
    type: "ANIME"
  };
  const callAnilist = async () => {
    const result = await endeavor.queryAnilist({ query, variables });

    var ongoingEntries = [];
    var unknownUnreleasedEntries = [];
    var unreleasedEntries = [];
    var completedEntries = [];
    result.data.Page.media.forEach(element => {
      console.log(element);
      var _anime = element.title.romaji.toString();
      if (element.title.english !== null) {
        _anime = element.title.english.toString();
      }
      var _time = "Unknown";
      var _episode = -1;
      var _updatedAt = moment.unix(element.updatedAt);
      if (element.status === "FINISHED") {
        try {
          var _endDate = moment(
            `${element.endDate.year}-${element.endDate.month}-${
              element.endDate.day
            }`
          ).format("YYYY MMM D");
          var _startDate = moment(
            `${element.startDate.year}-${element.startDate.month}-${
              element.startDate.day
            }`
          ).format("YYYY MMM D");
        } catch (error) {
          console.log("...");
        }
      }
      if (element.nextAiringEpisode !== null) {
        _time = element.nextAiringEpisode.timeUntilAiring;
        _episode = element.nextAiringEpisode.episode;
      }
      if (
        element.status === "RELEASING" &&
        element.nextAiringEpisode !== null
      ) {
        ongoingEntries.push({
          MalId: element.idMal,
          AnimeName: _anime,
          AnimeCountdown: countdown(_time),
          CurrentEpisode: _episode,
          EndDate: null,
          StartDate: _startDate,
          UpdatedAt: moment(_updatedAt).fromNow()
        });
      } else if (
        element.status === "NOT_YET_RELEASED" &&
        element.nextAiringEpisode !== null
      ) {
        unreleasedEntries.push({
          MalId: element.idMal,
          AnimeName: _anime,
          AnimeCountdown: countdown(_time),
          CurrentEpisode: _episode,
          EndDate: null,
          StartDate: null,
          UpdatedAt: moment(_updatedAt).fromNow()
        });
      } else if (
        element.status === "NOT_YET_RELEASED" &&
        element.nextAiringEpisode === null
      ) {
        unknownUnreleasedEntries.push({
          MalId: element.idMal,
          AnimeName: _anime,
          AnimeCountdown: null,
          CurrentEpisode: null,
          EndDate: null,
          StartDate: null,
          UpdatedAt: moment(_updatedAt).fromNow()
        });
      } else if (
        element.status === "FINISHED" &&
        (element.episodes !== null || element !== element.nextAiringEpisode)
      ) {
        completedEntries.push({
          MalId: element.idMal,
          AnimeName: _anime,
          AnimeCountdown: countdown(_time),
          CurrentEpisode: _episode,
          EndDate: _endDate,
          StartDate: _startDate,
          UpdatedAt: moment(_updatedAt).fromNow()
        });
      }
    });

    function sendMessage(embedMessage) {
      dm ? ctx.message.author.send({embeds: [embedMessage]}) : ctx.message.channel.send({embeds: [embedMessage]});
    }

    if (ongoingEntries.length > 0) {
      for (let i = 0; i < ongoingEntries.length; i++) {
        const element = ongoingEntries[i];
        

        var responseMessage = new Discord.MessageEmbed()
        .setColor(16408534)
        .setTitle(`***${element.AnimeName}***`)
        .setURL(`https://myanimelist.net/anime/${element.MalId}/`)
        .addField(`*Episode ${element.CurrentEpisode}*`, `Will air in approximately **${
          element.AnimeCountdown
        }**\n Last update: *${element.UpdatedAt}*`)
        sendMessage(responseMessage);
      }
    } else if (unreleasedEntries.length > 0) {
      for (let i = 0; i < unreleasedEntries.length; i++) {
        const element = unreleasedEntries[i];
       
        var responseMessage = new Discord.MessageEmbed()
        .setColor(8646732)
        .setURL(`https://myanimelist.net/anime/${element.MalId}/`)
        .addField(`*Not Yet Aired*`, `Will start airing in approximately **${
          element.AnimeCountdown
        }**\n Last update: *${element.UpdatedAt}*`)
        .setTitle(`***${element.AnimeName}***`)
        sendMessage(responseMessage);
      }
    } else if (unknownUnreleasedEntries.length > 0) {
      for (let i = 0; i < unknownUnreleasedEntries.length; i++) {
        const element = unknownUnreleasedEntries[i];
        

        var responseMessage = new Discord.MessageEmbed()
        .setColor(8646732)
        .setURL(`https://myanimelist.net/anime/${element.MalId}/`)
        .addField(`*Not Yet Aired*`, `The release date is **currently unknown.**\n Last update: *${
          element.UpdatedAt
        }*`)
        .setTitle(`***${element.AnimeName}***`)
        
        sendMessage(responseMessage);
      }
    } else if (completedEntries.length > 0) {
      if (completedEntries.length === 1) {
        var element = completedEntries[0];
        var responseMessage = {
          embed: {
            color: 11652146,
            title: `***${element.AnimeName}***   `,
            url: `https://myanimelist.net/anime/${element.MalId}/`,
            fields: [
              {
                name: `*Already Completed!*`,
                value: `Aired: **${element.StartDate}**  to  **${
                  element.EndDate
                }**`
              }
            ]
          }
        };
        var responseMessage = new Discord.MessageEmbed()
        .setColor(11652146)
        .setURL(`https://myanimelist.net/anime/${element.MalId}/`)
        .addField(`*Already Completed*`, `Aired: **${element.StartDate}**  to  **${
          element.EndDate
        }**`)
        .setTitle(`***${element.AnimeName}***`)
        sendMessage(responseMessage);
      } else {
        var responseMessage = {
          embed: {
            color: 11652146,
            title: `Result for keyword ***${anime}***   .`,
            fields: [
              {
                name: `*${completedEntries.length} Anime*`,
                value: `All of them is already completed.`
              }
            ]
          }
        };
        var responseMessage = new Discord.MessageEmbed()
        .setColor(11652146)
        .addField(`*${completedEntries.length} Anime*`,`All of them is already completed.`)
        .setTitle(`Result for keyword ***${anime}***   .`)
        sendMessage(responseMessage);
      }
    } else {
      var responseMessage = `Go me nasai! I didn't find "***${anime}***". Try checking your spelling or enter a different keyword.`;
      sendMessage(responseMessage);
    }
  };

  callAnilist();
}

module.exports = getNextEpisode;
