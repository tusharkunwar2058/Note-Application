const notesRouter = require('express').Router()
const Note = require('../models/note')
const { error } = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
require('dotenv').config()

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { name: 1, username: 1 })
  if (notes) {
    response.json(notes)
  } else {
    response.status(404).end()
  }
})

notesRouter.get('/:id', async (request, response, next) => {

  // Note.findById(request.params.id)
  //   .then(note => {
  //     if (note) {
  //       response.json(note)
  //     } else {
  //       response.status(404).end()
  //     }
  //   })
  //   .catch(error => next(error))

  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }

})

const getTokenFrom = request => {

  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({error: "invalid token"})
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" })
  }

  if (!body.content || typeof body.content !== 'string') {
    return response.status(400).json({ error: 'content missing or invalid' })
  }

  const note = new Note(
    {
      content: body.content,
      important: body.important || false,
      user: user._id
    }
  )

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)

})

notesRouter.delete('/:id', async (request, response, next) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', async (request, response, next) => {

  try {
    const { content, important } = request.body

    const note = await Note.findById(request.params.id)
    if (!note) {
      return response.status(404).end()
    }

    note.content = content
    note.important = important

    const updatedNote = await note.save()
    response.json(updatedNote)

  } catch (error) {
    next(error)
  }

})

module.exports = notesRouter