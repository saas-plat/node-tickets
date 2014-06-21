module.exports = function(sequelize, DataTypes) {
    var definition = {
        id: { type: DataTypes.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true},
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true
        },
        icon: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        desc: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        desc_caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Description'
        },
        tags: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        tags_caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Tags'
        },
        tags_default: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Customer,Stakeholder,Internal,External'
        },
        stage_caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Status'
        },
        resolution_caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Resolution'
        },
        priority: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        priority_caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Priority'
        },
        module: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        module_caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Module'
        },
        start: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        start_caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Start'
        },
        end: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        end_caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'End'
        },
        due: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        due_caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Due'
        },
        expire: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        expire_caption: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Expire'
        }
    };
    return sequelize.define('Type', definition, {
        classMethods: {
            getDefinition: function() {
                return definition;
            },
            associate: function(models) {
                models.Type.hasMany(models.Group, { through: 'Group_access_Types', onDelete: 'cascade', hooks: true });
            }
        }
    });
};