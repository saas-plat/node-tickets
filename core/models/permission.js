module.exports = function(sequelize, DataTypes) {
    var definition = {
        id: { type: DataTypes.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true},
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        uri: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        action: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    };
    return sequelize.define('permission', definition, {
        classMethods: {
            getDefinition: function() {
                return definition;
            },
            associate: function(models) {
                models.Permission.belongsToMany(models.Group, { through: 'Group_Permissions', onDelete: 'cascade', hooks: true });
            }
        }
    });
};
