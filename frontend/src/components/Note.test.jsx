import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'
import Note from './Note'
import NoteForm from './NoteForm'

// test('renders content', () => {
//   const note = {
//     content: 'Does not work anymore :(',
//     important: true
//   }

//   render(<Note notes={note} />)

// //   screen.debug()

//   const element = screen.getByText('Does not work anymore :(', {exact: false})
// //   screen.debug(element)

//   expect(element).toBeDefined()
// })

// test('does not render this', () => {
//   const note = {
//     content: 'This is a reminder',
//     important: true
//   }

//   render(<Note notes={note} />)

//   const element = screen.queryByText('do not want this thing to be rendered')
//   expect(element).toBeNull()
// })

// test('clicking the button calls event handler once', async () => {
//   const note = {
//     content: 'Component testing is done with react-testing-library',
//     important: true
//   }
  
//   const mockHandler = vi.fn()

//   render(
//     <Note notes={note} toggleImportant={mockHandler} />
//   )

//   const user = userEvent.setup()
//   const button = screen.getByText('make not important')
//   await user.click(button)

//   expect(mockHandler.mock.calls).toHaveLength(1)
// })

// describe('<Togglable />', () => {
//   beforeEach(() => {
//     render(
//       <Togglable buttonLabel="show...">
//         <div>togglable content</div>
//       </Togglable>
//     )
//   })

//   test('renders its children', () => {
//     screen.getByText('togglable content')
//   })

//   test('at start the children are not displayed', () => {
//     const element = screen.getByText('togglable content')
//     expect(element).not.toBeVisible()
//   })

//   test('after clicking the button, children are displayed', async () => {
//     const user = userEvent.setup()
//     const button = screen.getByText('show...')
//     await user.click(button)

//     const element = screen.getByText('togglable content')
//     expect(element).toBeVisible()
//   })

//   test('toggled content can be closed', async () => {
//     const user = userEvent.setup()
//     const button = screen.getByText('show...')
//     await user.click(button)

//     const closeButton = screen.getByText('cancel')
//     await user.click(closeButton)

//     const element = screen.getByText('togglable content')
//     expect(element).not.toBeVisible()
//   })
// })

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})

