module.exports = function(sequelize, DataTypes) {
    var definition = {
        id: { type: DataTypes.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true},
        action: {
            type: DataTypes.STRING(45),
            allowNull: false,
            notEmpty: true,
            validate: {
                isAlpha: true
            }
        },
        table: {
            type: DataTypes.STRING(45),
            allowNull: false,
            notEmpty: true,
            validate: {
                isAlpha: true
            }
        },
        table_pk: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        detail: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    };
    return sequelize.define('Audit', definition,{
        classMethods: {
            getDefinition: function() {
                return definition;
            },
            associate: function(models) {
                models.Audit.belongsTo(models.User);
            }
        },
        createdAt: 'action_date',
        updatedAt: false,
        deletedAt: false
    });
};