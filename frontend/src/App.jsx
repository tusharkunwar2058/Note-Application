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
// import Footer from './components/Footer'
import NoteForm from './components/NoteForm'
import styled from 'styled-components'

export const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

export const Input = styled.input`
  margin: 0.25em;
  width: 300px;  
`

const Page = styled.div`
  padding: 1em;
  background: rgb(51, 51, 59);
  color: white;
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

const App = () => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const addNote = noteObject => {
    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
    })
  }

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter(n => n.id !== id))
    })
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
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
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

  return (
    
      <Page>
      <Navigation>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/create">new note</Link>
      </Navigation>

      <Routes>
        <Route path="/notes/:id" element={
          <Note
            note={note}
            toggleImportance={toggleImportanceOf}
            deleteNote={deleteNote}
          />

        } />

        <Route path="/notes" element={
          <NoteList notes={notes} />
        } />
        <Route path="/create" element={
          <NoteForm createNote={addNote} />
        } />
        <Route path="/" element={<Home />} />
      </Routes>

      <Footer>
         Note app, Department of Computer Science, University of Konoha 2034
      </Footer>
    </Page>
    
  )
}

export default App