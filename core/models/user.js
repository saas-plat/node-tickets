var CONF = require('config');
module.exports = function(sequelize, DataTypes) {
    var definition = {
        id: { type: DataTypes.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            notEmpty: true,
            unique: true,
            validate: {
                contains: CONF.app.auth.domain || '@',
                isEmail: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            notEmpty: true
        },
        salt: {
            type: DataTypes.STRING(255),
            allowNull: false,
            notEmpty: true
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    };
    return sequelize.define('user', definition,{
        classMethods: {
            getDefinition: function() {
                return definition;
            },
            associate: function(models) {
                models.User.belongsTo(models.Group);
                models.User.belongsToMany(models.Record, { through: 'User_assigned_Records', onDelete: 'cascade', hooks: true });
            }
        }
    });
};
