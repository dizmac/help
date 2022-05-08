module.exports = {
    async ephemeralReply(interaction, content, ...Embeds) {
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: content, ephemeral: true, embeds: Embeds });
        // await interaction.deferReply({ ephemeral: false });
        // await interaction.editReply({ content: content, ephemeral: false, embeds: Embeds });
    },
    async editReply(interaction, content, ephemeral, ...Embeds) {
        await interaction.editReply({ content: content, ephemeral: ephemeral, embeds: Embeds });
        // await interaction.editReply({ content: content, ephemeral: false, embeds: Embeds });
    }
}