import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

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
    // <div>
    //   <h2>Create a new note</h2>
    //   <form onSubmit={addNote}>
    //     <input value={newNotes} onChange={event => setNewNotes(event.target.value)} />

    //     <button type="submit">save</button>
    //   </form>
    // </div>

    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>

        <TextField
          label="note content"
          value={newNotes}
          onChange={event => setNewNotes(event.target.value)}
          variant="outlined"
          sx={{
            backgroundColor: "white",
            borderRadius: "7px",
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#11a7e2"   // outline color
              }
            },
            "& label.Mui-focused": {
              color: "#2390e9"          // label color
            }
          }}
        />

        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10, backgroundColor: "green" }}>
            save
          </Button>
        </div>
      </form>
    </div>

  )
}

export default NoteForm