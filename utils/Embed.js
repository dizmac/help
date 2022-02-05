const Discord = require('discord.js');
const Constants = require("./Constants");

module.exports = {
    embedStatus(uuid, subcommand, question, user, reviewed, response, timestamp) {
        return new Discord.MessageEmbed()
            .setTitle('Math • Submission Details')
            .setDescription('Here are the details regarding your submission for help! You will need the UUID to view the status of this submission')
            .setColor(Constants.EMBED_COLOR)
            .addField('UUID', uuid, false)
            .addField('Format', subcommand, false)
            .addField('Content', question, false)
            .addField('Submitter', `<@${user}>`, false)
            .addField('Reviewed', reviewed, false)
            .addField('Response', response, false)
            .addField('Created At In UTC Timestamp', timestamp.toString(), false)
    },
    embedMath(mode, result) {

        const embed = new Discord.MessageEmbed().setTitle(`Math • ${mode}`).setTimestamp();

        if (result === 'failure') return embed.setColor('#FF0000').setDescription('The given expression is not valid!');

        return new Discord.MessageEmbed().setTitle(`Math • ${mode}`).setColor(Constants.EMBED_COLOR).setDescription(result).setTimestamp();

    }
}