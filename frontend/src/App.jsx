import { useState, useEffect } from 'react'
import noteService from './services/notes'
import Note from './components/Note'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useMatch
} from 'react-router-dom'
import NoteList from './components/NoteList'
import Home from './components/Home'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const addNote = noteObject => {
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNotification({ text: `Note '${returnedNote.content}' added!`, type: 'success' })
    })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter(n => n.id !== id))
    })
    setNotification({ text: `Note deleted!`, type: 'success' })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => (note.id !== id ? note : returnedNote)))
      })

      .catch(() => {
        setNotification({ text: `Note '${note.content}' was already removed from server`, type: 'error' })

        setTimeout(() => {
          setNotification(null)
        }, 5000)
        //setNotes(notes.filter(n => n.id !== id))
      })
  }

  const padding = {
    padding: 5,
    color: "gold"
  }

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === match.params.id)
    : null

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>

      {/* <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/create">new note</Link>
      </div> */}
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={style}>
            home
          </Button>

          <Button color="inherit" component={Link} to="/notes" sx={style}>
            notes
          </Button>

          <Button color="inherit" component={Link} to="/create" sx={style}>
            new note
          </Button>

        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route path="/notes/:id" element={
          <Note
            note={note}
            toggleImportance={toggleImportanceOf}
            deleteNote={deleteNote}
          />

        } />

        <Route path="/notes" element={
          <NoteList notes={notes} notification={notification} setNotification={setNotification} />
        } />
        <Route path="/create" element={
          <NoteForm createNote={addNote} />
        } />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </Container>
  )
}

export default App