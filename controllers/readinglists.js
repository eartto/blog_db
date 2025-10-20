const router = require('express').Router()

const { ReadingList, User, Session } = require('../models')
const tokenExtractor = require('../util/tokenExtractor')

router.post('/', async (req, res, next) => {
    try {
        const blog = await ReadingList.create({ blogId: req.body.blogId, userId: req.body.userId })
        return res.status(200).json(blog)
    } catch (error) {
        next(error)
        return res.status(400)
    }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
    try {
        const rawToken = req.get('authorization').substring(7)
        const session = await Session.findOne({
            where: {
                userToken: rawToken
            }
        })
        const user = await User.findByPk(req.decodedToken.id)
        const readingList = await ReadingList.findByPk(req.params.id)
        if (user.id === readingList.userId && session && user.disabled === false) {
            readingList.read = req.body.read
            readingList.save()
        }
        else {
            return res.status(401).end()
        }
        return res.status(200).json(readingList)
    } catch (error) {
        next(error)
        return res.status(400)
    }
})


module.exports = router