const database = require('../../votekick/utils/database')

module.exports = {
    name: 'ready',
    once: true,
    async execute() {
        await database.sync();

        console.log('[DISCORD.JS] Ready!');
    }
}