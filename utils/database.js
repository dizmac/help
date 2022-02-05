const Sequelize = require('sequelize');
module.exports = {
    async sync() {
        datastore.sync({ alter: true }).then(() => console.log('[SEQUELIZE] Database synced!'));
    },
    async getUnresolvedDatabaseEntries() {
        let promise = new Promise(resolve => {
            datastore.findAll({where: { reviewed: false }}).then(f => {
                let res = [];
                for (const data of f) {
                    res.push(data.dataValues);
                }
                resolve(res);
            });
        })
        return await promise;
    },
    async deleteDatabaseEntryByUUID(uuid) {
        return datastore.destroy({ where: { id: uuid } })
    },
    async addResponseByUUID(uuid, response) {
        return datastore.update({ reviewed: true, response: response }, { where: { id: uuid } });
    },
    async getDatabaseEntryByUserID(id) {
        let promise = new Promise(resolve => {
            datastore.findAll({where: { submitter: id }}).then(f => {
                let res = [];
                for (const data of f) {
                    res.push(data.dataValues);
                }
                resolve(res);
            });
        })
        return await promise;
    },
    async getDatabaseEntryByUUID(uuid) {
        let promise = new Promise((resolve, reject) => {
            datastore.findOne({where: { id: uuid }}).then(f => {
                try {
                    resolve(f.dataValues);
                } catch {
                    reject('The UUID is invalid!');
                }
            });
        })
        return await promise;
    },
    async createDatabaseEntry(uuid, format, content, submitter, timestamp) {
        let promise = new Promise(resolve => {
            datastore.create({
                id: uuid,
                format: format,
                content: content,
                submitter: submitter,
                reviewed: false,
                timestamp: timestamp
            }).then(m => resolve(m))
        })
        return await promise;
    }
}

const database = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
})

const datastore = database.define('homework_store', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true
    },
    format: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.STRING
    },
    submitter: {
        type: Sequelize.STRING
    },
    reviewed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    response: {
        type: Sequelize.STRING,
        defaultValue: 'N/A'
    },
    timestamp: {
        type: Sequelize.INTEGER
    }
}, { freezeTableName: true, timestamps: false })