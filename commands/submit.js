const { SlashCommandBuilder } = require('@discordjs/builders');
const InteractionUtil = require('../utils/Interactions');
const database = require('../utils/database');
const embed = require('../utils/Embed')
const v4 = require('uuid').v4;


module.exports = {
    async execute(interaction, context) {
        const { user } = interaction;
        const { subcommand, options } = context;
        const question = options.getString('question'), uuid = v4();
        const timestamp = Math.floor(Date.now()/1000);


        InteractionUtil.ephemeralReply(interaction, `Submitting...`).then(async () => {
            user.createDM().then(async c => {
                c.send({ embeds: [embed.embedStatus(uuid, subcommand, question, user.id, 'No', 'N/A', timestamp)] }).then(async () => {
                    await database.createDatabaseEntry(uuid, subcommand, question, user.id, timestamp);
                    await InteractionUtil.editReply(interaction, 'I have sent the submission information into your DMs!', true);
                }).catch(() => InteractionUtil.editReply(interaction, 'I was not able to send you a DM about the submission, therefore, the submission was aborted!', true));
            })
        })
    },
    data: new SlashCommandBuilder()
        .setName('submit')
        .setDescription('Submits a question to be answered')
        .addSubcommand(subcommand =>
            subcommand.setName('text')
                .setDescription('The submission is a text')
                .addStringOption(option =>
                    option.setName('question')
                        .setDescription('The text of the question')
                        .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand.setName('image')
                .setDescription('The submission is an image')
                .addStringOption(option =>
                    option.setName('question')
                        .setDescription('The LINK to the image of the question')
                        .setRequired(true))),
}

