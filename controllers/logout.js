const router = require('express').Router()

const { User, Session } = require('../models')
const tokenExtractor = require('../util/tokenExtractor')


router.delete('/', tokenExtractor, async (req, res) => {
    try {
        const rawToken = req.get('authorization').substring(7)
        const session = await Session.findOne({
            where: {
                userToken: rawToken
            }
        })
        const user = await User.findByPk(req.decodedToken.id)
        await session.destroy()
        console.log(user)
        user.disabled = true
        console.log(user)
        await user.save()
        return res.status(204).end()
    } catch (error) {
        return res.status(400).json({ error })
    }
})

module.exports = router