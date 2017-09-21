module.exports = function(sequelize, DataTypes) {
    var definition = {
        id: { type: DataTypes.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true},
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            unique: true
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    };
    return sequelize.define('group', definition, {
        classMethods: {
            getDefinition: function() {
                return definition;
            },
            associate: function(models) {
                models.Group.belongsToMany(models.Type, { through: 'Group_access_Types', onDelete: 'cascade', hooks: true });
                models.Group.belongsToMany(models.Permission, { through: 'Group_Permissions', onDelete: 'cascade', hooks: true });
            }
        }
    });
};
