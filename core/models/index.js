var fs          = require('fs'),
    CONF      = require('config'),
    Sequelize = require('sequelize'),
    path      = require('path'),
    lodash    = require('lodash'),
    db        = {},
    sequelize = new Sequelize(CONF.db.database, CONF.db.username, CONF.db.password, {
        dialect: CONF.db.driver,
        host: CONF.db.host,
        port: CONF.db.port,
        protocol: 'tcp',
        language: 'en',
//        replication: {
//            read: [
//                { host: '8.8.8.8', username: 'notroot', password: 'fooBlah' },
//                { host: 'localhost', username: 'root', password: null }
//            ],
//            write: { host: 'localhost', username: 'root', password: null }
//        },
        pool: {
            minConnections: CONF.db.initialConnections,
            maxConnections: CONF.db.maxConnections,
            maxIdleTime: CONF.db.maxIdleTime
        },
        define: {
            syncOnAssociation: false,
            charset: CONF.db.charset,
            collate: CONF.db.collate
        }
    });

    fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    });

    Object.keys(db).forEach(function(modelName) {
        if ('associate' in db[modelName]) {
            db[modelName].associate(db)
        }
    });

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);