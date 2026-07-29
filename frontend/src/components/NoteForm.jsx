import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNotes, setNewNotes] = useState('')

  const addNote = (event) => {
    event.preventDefault()

    createNote({
      content: newNotes,
      important: true
    })

    setNewNotes('')
  }

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <input value={newNotes} onChange= {event => setNewNotes(event.target.value)}/>

        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm