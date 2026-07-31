const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const assert = require('node:assert')
const {describe, test, beforeEach, after} = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = ({
            username: 'ashKetchum10',
            name: 'Ash Ketchum',
            password: 'lets go pikachu',
        })

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length+1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken',
    async ()=> {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'superuser',
            password: 'salainen'
        }

        const result = await api
                        .post('/api/users')
                        .send(newUser)
                        .expect(400)
                        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('login succeeds with a default root user when no user exists', async () => {
        await User.deleteMany({})

        const result = await api
            .post('/api/login')
            .send({ username: 'root', password: 'secret' })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.username, 'root')
    })
})

after(async () => {
    await mongoose.connection.close()
})