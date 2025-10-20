const router = require('express').Router()
const sequelize = require('sequelize')

const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        order: [['likes', 'DESC'],],
        group: ["author"],
        attributes: ["author", [sequelize.fn('COUNT', sequelize.col('author')), 'articles'], [sequelize.fn('SUM', sequelize.col('likes')), 'likes']]
    })
    res.json(authors)
})

module.exports = router