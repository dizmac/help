const { SlashCommandBuilder } = require('@discordjs/builders');
const algebra = require('algebra.js');
const InteractionUtil = require('../utils/Interactions');
const embed = require('../utils/Embed');
const { Equation } = require('algebra.js');

module.exports = {
    async execute(interaction, context) {
        const { subcommand, options } = context;
        const equation = options.getString('equation'), target = options.getString('for');

        switch (subcommand) {
            case 'solve':
                try {
                    const sides = equation.replaceAll(' ', '').split('=');

                    if (sides.length !== 2) return await InteractionUtil.ephemeralReply(interaction, null, embed.embedMath('Equations', 'failure'))

                    const ans = new Equation(algebra.parse(sides[0]), algebra.parse(sides[1])).solveFor(target);

                    if (ans.length === 0) {
                        return await InteractionUtil.ephemeralReply(interaction, null, embed.embedMath('Equations', `There are no real solutions for \`${equation}\`!`));
                    }

                    await InteractionUtil.ephemeralReply(interaction, null, embed.embedMath('Equations', `The **REAL** solution(s) for \`${target}\` is \`${ans}\``));
                } catch (e) {
                    await InteractionUtil.ephemeralReply(interaction, null, embed.embedMath('Equations', 'failure'));
                }
                break;


        }
    },
    data: new SlashCommandBuilder()
        .setName('equation')
        .setDescription('Equation utilities')
        .addSubcommand(subcommand =>
            subcommand.setName('solve')
                .setDescription('Solves an equation')
                .addStringOption(option =>
                    option.setName('equation')
                        .setDescription('The equation to solve')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('for')
                        .setDescription('What variable to solve for')
                        .setRequired(true)))

}