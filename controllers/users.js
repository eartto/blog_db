const router = require('express').Router()
const sequelize = require('sequelize')

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog
        }
    })
    res.json(users)
})

router.get('/:id', async (req, res) => {
    let where = false

    if (req.query.read) {
        where = {
            '$readings.reading_list.read$': req.query.read === "true"
        }
    }

    const user = await User.findByPk(req.params.id, {
        include: [
            {
                model: Blog,
                as: 'readings',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                through: {
                    attributes: ['id', 'read']
                },
                where
            }
        ]
    })
    res.json(user)
})

router.post('/', async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        next(error)
        return res.status(400)
    }
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })
    if (user) {
        user.username = req.body.newUsername
        await user.save()
        res.status(201).json(user.username)
    } else {
        res.status(404).end()
    }
})

module.exports = router