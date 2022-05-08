const { SlashCommandBuilder } = require('@discordjs/builders');
const InteractionUtil = require('../utils/Interactions');
const database = require('../utils/database');
const embed = require('../utils/Embed');

module.exports = {
    async execute(interaction, context) {
        const { user } = interaction
        const { subcommand, options } = context;
        const uuid = options.getString('uuid'), response = options.getString('response');

        switch (subcommand) {
            case 'resolve':
                database.getDatabaseEntryByUUID(uuid)
                    .then(() => database.addResponseByUUID(uuid, response)
                        .then(() => InteractionUtil.ephemeralReply(interaction, `Added the response \`${response}\` to the submission with the UUID \`${uuid}\``)))
                    .catch(e => InteractionUtil.ephemeralReply(interaction, e))
                break;
            case 'delete':
                database.deleteDatabaseEntryByUUID(uuid).then(() => InteractionUtil.ephemeralReply(interaction, `Deleted the submission with the UUID \`${uuid}\`!`));
                break;
            case 'unresolved':
                database.getUnresolvedDatabaseEntries().then(res => {
                    InteractionUtil.ephemeralReply(interaction, `Querying the database...`).then(async () => {

                        if (res.length === 0) return InteractionUtil.editReply(interaction, 'There are no unresolved submissions!');

                        user.createDM().then(async c => {
                            let successful = true;
                            for (let i = 0; i < Math.ceil(res.length/10); i++) {
                                let data = [];

                                for (let j = i * 10; j < (i + 1) * 10; j++) {
                                    try {
                                        let emb = res[j];
                                        data.push(embed.embedStatus(emb.id, emb.format, emb.content, emb.submitter, emb.reviewed ? 'Yes': 'No', emb.response, emb.timestamp));
                                    } catch { break; }
                                }
                                c.send({ embeds: data }).catch(() => { InteractionUtil.editReply(interaction, 'I was not able to send you a DM about the query!', true); successful = false; });
                                if (!successful) break;
                            }
                            if (successful) return InteractionUtil.editReply(interaction, 'I have sent the query information into your DMs!', true);
                        })
                    })
                })
        }
    },
    data: new SlashCommandBuilder()
        .setDefaultPermission(false)
        .setName('review')
        .setDescription('Reviews submissions')
        .addSubcommand(subcommand =>
            subcommand.setName('resolve')
                .setDescription('Resolve submissions')
                .addStringOption(option =>
                    option.setName('uuid')
                        .setDescription('The UUID of the submission')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('response')
                        .setDescription('Response to the submission')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('delete')
                .setDescription('Deletes a submission')
                .addStringOption(option =>
                    option.setName('uuid')
                        .setDescription('The UUID of the submission')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('unresolved')
                .setDescription('All unresolved submissions'))
}