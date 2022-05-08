const database = require('../utils/database')

module.exports = {
    name: 'ready',
    once: true,
    async execute() {
        await database.sync();

        console.log('[DISCORD.JS] Ready!');
    }
}