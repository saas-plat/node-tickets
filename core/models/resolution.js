module.exports = function(sequelize, DataTypes) {
    var definition = {
        id: { type: DataTypes.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true},
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    };
    return sequelize.define('Resolution', definition, {
        classMethods: {
            getDefinition: function() {
                return definition;
            }
        }
    });
};