const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User, Session } = require('../models')
const tokenExtractor = require('../util/tokenExtractor')

router.get('/', async (req, res) => {
    try {
        let where = {}

        if (req.query.search) {
            where = {
                [Op.or]: [
                    {
                        title: {
                            [Op.iLike]: `%${req.query.search}%`
                        }
                    },
                    {
                        author: {
                            [Op.iLike]: `%${req.query.search}%`
                        }
                    }
                ]
            }
        }

        const blogs = await Blog.findAll({
            order: [
                ['likes', 'DESC'],
            ],
            include: {
                model: User,
                attributes: ['name']
            },
            where
        })

        res.json(blogs)

    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ]
        })
        if (blog) {
            res.json(blog)
        }
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const rawToken = req.get('authorization').substring(7)
        const user = await User.findByPk(req.decodedToken.id)
        const session = await Session.findOne({
            where: {
                userToken: rawToken
            }
        })
        if (user === null || session === null) {
            return res.status(400).end()
        } else if (user && user.disabled !== true && session) {
            const blog = await Blog.create({ ...req.body, userId: user.id })
            return res.json(blog)
        }
    } catch (error) {
        next(error)
        return res.status(400).end()
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (blog) {
            blog.likes = req.body.likes
            console.log(blog)
            await blog.save()
            res.status(200).json({ "likes": + blog.likes })
        }
        else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})


router.delete('/:id', tokenExtractor, async (req, res) => {
    try {
        const rawToken = req.get('authorization').substring(7)
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.findByPk(req.params.id)
        const session = await Session.findOne({
            where: {
                userToken: rawToken
            }
        })
        if (user === null || session === null || user.disabled === true || blog === null) {
            return res.status(400).end()
        } else if (blog && blog.userId === user.id) {
            await blog.destroy()
            return res.status(204).end()
        }
    } catch (error) {
        return res.status(400).json({ error })
    }
})

module.exports = router