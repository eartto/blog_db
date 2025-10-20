const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: QueryInterface }) => {
        await QueryInterface.addColumn('blogs', 'year', {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1991,
                max: new Date().getFullYear()
            }
        })
    }
}