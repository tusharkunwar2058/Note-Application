import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../App'

const NoteForm = ({ createNote }) => {
  const [newNotes, setNewNotes] = useState('')
  const navigate = useNavigate()

  const addNote = (event) => {
    event.preventDefault()

    createNote({
      content: newNotes,
      important: true
    })
    navigate('/notes')

    setNewNotes('')
  }

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <Input value={newNotes}
          onChange={event => setNewNotes(event.target.value)}
          placeholder='write note content here' />

        <Button type="submit">save</Button>
      </form>
    </div>
  )
}

export default NoteForm