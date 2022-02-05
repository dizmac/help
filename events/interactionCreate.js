module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {
        const { client } = interaction;

        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            const options = interaction.options;
            const context = {
                subcommand: options.getSubcommand(),
                options: options
            };

            try {
                command.execute(interaction, context);
            } catch (e) {
                console.log(e);
            }
        }
    }
}