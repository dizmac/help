const { SlashCommandBuilder } = require('@discordjs/builders');
const math = require('mathjs');
const InteractionUtil = require('../utils/Interactions');
const embed = require('../utils/Embed');

module.exports = {
    async execute(interaction, context) {
        const { subcommand, options } = context;
        const expression = options.getString('expression');

        switch (subcommand) {
            case 'evaluate':
                try {
                    const ans = math.compile(expression).evaluate();
                    await InteractionUtil.ephemeralReply(interaction, null, embed.embedMath('Evaluation', `The evaluation of your expression is \`${ans}\``));
                } catch (e) {
                    await InteractionUtil.ephemeralReply(interaction, null, embed.embedMath('Evaluation', 'failure'));
                }
                break;
            case 'simplify':
                try {
                    const ans = math.simplify(expression).toString();
                    await InteractionUtil.ephemeralReply(interaction, null, embed.embedMath('Simplification', `The simplified form of your expression is \`${ans}\``));
                } catch (e) {
                    await InteractionUtil.ephemeralReply(interaction, null, embed.embedMath('Simplification', 'failure'));
                }
                break;
        }
    },
    data: new SlashCommandBuilder()
        .setName('expression')
        .setDescription('Expression utilities')
        .addSubcommand(subcommand =>
            subcommand.setName('evaluate')
                .setDescription('Evaluates an expression')
                .addStringOption(option =>
                    option.setName('expression')
                        .setDescription('The expression to evaluate')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('simplify')
                .setDescription('Simplifies an expression')
                .addStringOption(option =>
                    option.setName('expression')
                        .setDescription('The expression to simplify')
                        .setRequired(true)))
}