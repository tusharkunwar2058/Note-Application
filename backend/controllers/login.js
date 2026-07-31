const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')
require('dotenv').config()

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    const defaultUsername = process.env.DEFAULT_USERNAME || 'root'
    const defaultPassword = process.env.DEFAULT_PASSWORD || 'secret'

    let user = await User.findOne({ username })

    if (!user && username === defaultUsername && password === defaultPassword) {
        const passwordHash = await bcrypt.hash(password, 10)
        user = await User.create({
            username: defaultUsername,
            name: defaultUsername,
            passwordHash
        })
    }

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({ error: "invalid username or password" })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(
        userForToken,
        config.SECRET,
        { expiresIn: 60 * 60 }
    )

     response
     .status(200)
     .json({ token, username: user.username, name: user.name })

})

module.exports = loginRouter