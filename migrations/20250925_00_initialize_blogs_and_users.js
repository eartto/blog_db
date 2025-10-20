const sequelize = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('blogs', {
            id: {
                type: sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            author: {
                type: sequelize.DataTypes.TEXT,
            },
            url: {
                type: sequelize.DataTypes.TEXT,
                allowNull: false

            },
            title: {
                type: sequelize.DataTypes.TEXT,
                allowNull: false
            },
            likes: {
                type: sequelize.DataTypes.INTEGER,
                defaultValue: 0
            },
            created_at: {
                type: sequelize.DATE,
                allowNull: false,

            },
            updated_at: {
                allowNull: false,
                type: sequelize.DATE,
            },
        })
        await queryInterface.createTable('users', {
            id: {
                type: sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: { isEmail: true }
            },
            name: {
                type: sequelize.DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: sequelize.DATE,
                allowNull: false,

            },
            updated_at: {
                allowNull: false,
                type: sequelize.DATE,
            },
        })
        await queryInterface.addColumn('blogs', 'user_id', {
            type: sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('blogs')
        await queryInterface.dropTable('users')
    },
}