# QuickTodos App UI and Functions

## App.tsx
```tsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, useParams, useLocation, useNavigate } from 'react-router-dom'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import LandingPage from './components/LandingPage'
import './index.css'

interface Todo {
  id: number
  text: string
  completed: boolean
}

// Component to handle the actual Todo logic based on path
const TodoPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  // Redirect to landing if listId is missing somehow
  useEffect(() => {
    if (!listId) {
      console.warn("TodoPage accessed without listId, redirecting to landing.")
      navigate('/')
    }
  }, [listId, navigate])

  // Determine the key for localStorage based on the path
  const getStorageKey = () => {
    const keySuffix = listId || 'default'
    return `todos-${keySuffix}`
  }

  const storageKey = getStorageKey()

  // Initialize state from localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (!listId) return []
    const saved = localStorage.getItem(storageKey)
    try {
      return saved ? JSON.parse(saved) : []
    } catch {
      console.error("Failed to parse todos from localStorage")
      return []
    }
  })

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (listId) {
      localStorage.setItem(storageKey, JSON.stringify(todos))
    }
  }, [todos, storageKey, listId])

  const addTodo = (text: string) => {
    if (!text.trim()) return
    const newTodo: Todo = { id: Date.now(), text, completed: false }
    setTodos([...todos, newTodo])
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const toggleComplete = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  if (!listId) return null

  return (
    <div className="container mx-auto px-4 max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Todo List: {listId}
      </h1>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} deleteTodo={deleteTodo} toggleComplete={toggleComplete} />
      <button onClick={() => navigate('/')} className="mt-6 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
        &larr; Back to Home
      </button>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:listId" element={<div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10"><TodoPage /></div>} />
      </Routes>
    </div>
  )
}

export default App
```

## LandingPage.tsx
```tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPlus } from 'lucide-react'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const generateRandomString = (length: number): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let res = ''
    for (let i = 0; i < length; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return res
  }

  const handleCreateList = () => {
    const randomPath = generateRandomString(10)
    navigate(`/${randomPath}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center shadow-lg">
        Welcome to QuickTodos!
      </h1>
      <p className="text-lg md:text-xl mb-8 text-center max-w-2xl">
        Create instant, shareable todo lists without any setup. Click below to generate a unique link.
      </p>
      <button onClick={handleCreateList} className="flex items-center px-8 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-xl font-semibold transition transform hover:scale-105">
        <ListPlus className="mr-2 h-6 w-6" />
        Create a New Todo List
      </button>
      <footer className="absolute bottom-4 text-center text-sm text-gray-200">
        Powered by React & Tailwind CSS. Your lists are stored locally.
      </footer>
    </div>
  )
}

export default LandingPage
```

## TodoForm.tsx
```tsx
import React, { useState } from 'react'

interface TodoFormProps { addTodo: (text: string) => void }

export const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      addTodo(text)
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex">
        <input
          type="text"
          className="shadow border rounded-l py-2 px-4 focus:outline-none focus:shadow-outline dark:border-gray-700"
          placeholder="Add new todo"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline">
          Add
        </button>
      </div>
    </form>
  )
}
```

## TodoList.tsx
```tsx
import React from 'react'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: { id: number; text: string; completed: boolean }[]
  deleteTodo: (id: number) => void
  toggleComplete: (id: number) => void
}

export const TodoList: React.FC<TodoListProps> = ({ todos, deleteTodo, toggleComplete }) => (
  <ul className="mt-4">
    {todos.map(todo => (
      <TodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} toggleComplete={toggleComplete} />
    ))}
  </ul>
)
```

## TodoItem.tsx
```tsx
import React from 'react'
import { CheckCircleIcon, XCircle, Trash2Icon } from 'lucide-react'

interface TodoItemProps {
  todo: { id: number; text: string; completed: boolean }
  deleteTodo: (id: number) => void
  toggleComplete: (id: number) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, deleteTodo, toggleComplete }) => (
  <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center">
      <button onClick={() => toggleComplete(todo.id)} className="mr-2 focus:outline-none">
        {todo.completed ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
      </button>
      <span className={todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}>
        {todo.text}
      </span>
    </div>
    <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700 focus:outline-none">
      <Trash2Icon className="w-4 h-4" />
    </button>
  </li>
)
```
