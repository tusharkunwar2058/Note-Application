import { useState, useEffect, useRef } from 'react'
import Note from './Note'
import Notification from './Notification'
import LoginForm from './LoginForm'
import NoteForm from './NoteForm'
import Togglable from './Togglable'
import loginService from '../services/login'
import noteService from '../services/notes'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const NoteList = ({ notes, notification, setNotification }) => {

  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const noteFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ text: `Welcome ${user.name}`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch {
      setNotification({ text: 'wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )
  // console.log(notes);

  return (
    <div>
      <h2>Notes</h2>

      {/* <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && <p>{user.name} is logged in</p>}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>

        {notesToShow.map(note => (
          <li key={note.id} >
            <Link to={`/notes/${note.id}`} style={{color: "green"}}>{note.content}</Link>
          </li>
        ))}

      </ul> */}

      {!user && loginForm()}
      {user && <p>{user.name} is logged in</p>}

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>content</TableCell>
              <TableCell>user</TableCell>
              <TableCell>important</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {notes.map(note => (
              <TableRow key={note.id}>
                <TableCell>
                  <Link to={`/notes/${note.id}`}>
                    {note.content}
                  </Link>
                </TableCell>

                <TableCell>
                  {note.user?.name || "unknown"}
                </TableCell>

                <TableCell>
                  {note.important ? 'yes' : ''}
                </TableCell>

              </TableRow>

            ))}
          </TableBody>

        </Table>
      </TableContainer>


    </div>
  )
}

export default NoteList