const { SlashCommandBuilder } = require('@discordjs/builders');
const InteractionUtil = require('../../votekick/utils/Interactions');
const database = require('../../votekick/utils/database');
const embed = require('../../votekick/utils/Embed');

module.exports = {
    async execute(interaction, context) {
        const { user } = interaction;
        const { subcommand, options } = context;
        const uuid = options.getString('uuid');

        switch (subcommand) {
            case 'uuid':
                database.getDatabaseEntryByUUID(uuid).then(res => {
                    InteractionUtil.ephemeralReply(interaction, `Querying the database...`).then(async () => {
                        user.createDM().then(async c => {
                            c.send({ embeds: [embed.embedStatus(res.id, res.format, res.content, res.submitter, res.reviewed ? 'Yes': 'No', res.response, res.timestamp.toString())] }).then(async () => {
                                await InteractionUtil.editReply(interaction, 'I have sent the query information into your DMs!', true);
                            }).catch(() => InteractionUtil.editReply(interaction, 'I was not able to send you a DM about the query!', true));
                        })
                    })
                }).catch(e => InteractionUtil.ephemeralReply(interaction, e))
                break;
            case 'all':
                database.getDatabaseEntryByUserID(user.id).then(res => {
                    InteractionUtil.ephemeralReply(interaction, `Querying the database...`).then(async () => {

                        if (res.length === 0) return InteractionUtil.editReply(interaction, 'You have no submissions!');

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
        .setName('view')
        .setDescription('Views a submission\'s status')
        .addSubcommand(subcommand =>
            subcommand.setName('uuid')
                .setDescription('Lookup by UUID')
                .addStringOption(option =>
                    option.setName('uuid')
                        .setDescription('The UUID of the submission')
                        .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand.setName('all')
                .setDescription('Views all of your submissions'))
}

