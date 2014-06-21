module.exports = function(sequelize, DataTypes) {
    var definition = {
        id: { type: DataTypes.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true},
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
            notEmpty: true
        },
        start: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            validate: {
                isDate: true
            }
        },
        end: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            validate: {
                isAfterStart: function(value) {
                    if((new Date(value)).valueOf() < (new Date(this.start)).valueOf()) {
                        throw new Error('Only future dates are allowed!')
                    }
                }
            }
        },
        due: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            validate: {
                isFuture: function(value) {
                    if((new Date(value)).valueOf() < (new Date()).valueOf()) {
                        throw new Error('Only future dates are allowed!')
                    }
                }
            }
        },
        expire: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            validate: {
                isFuture: function(value) {
                    if((new Date(value)).valueOf() < (new Date()).valueOf()) {
                        throw new Error('Only future dates are allowed!')
                    }
                }
            }
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        desc: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },
        tags: {
            type: DataTypes.STRING,
            get: function() {
                var tags = this.getDataValue('tags');
                return ('string' === typeof tags ? tags.split(',') : tags);
            },
            set: function(v) {
                return this.setDataValue('tags', ('string' === typeof v ? v : v.join()));
            },
            allowNull: true,
            defaultValue: null
        }
    };
    return sequelize.define('Record', definition, {
        classMethods: {
            getDefinition: function() {
                return definition;
            },
            associate: function(models) {
                models.Record.belongsTo(models.Type);
                models.Record.belongsTo(models.User);
                models.Record.belongsTo(models.Resolution);
                models.Record.belongsTo(models.Priority);
                models.Record.belongsTo(models.Module);
                models.Record.belongsTo(models.Stage);
                models.Record.hasMany(models.User, { through: 'User_assigned_Records', onDelete: 'cascade', hooks: true });
            }
        }
    });
};