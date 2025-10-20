const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: QueryInterface }) => {
        await QueryInterface.addColumn('users', 'disabled', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        })
        await QueryInterface.createTable('sessions', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_token: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('sessions')
    },
}