'use client'

import React, { useState } from 'react'
import { PlusCircle, X, AlertCircle, Clock, Info } from 'lucide-react'

interface TodoFormProps { 
  addTodo: (text: string, category: string, priority: 'Urgent' | 'Normal' | 'Low Priority') => void 
  categories: string[]
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo, categories }) => {
  const [text, setText] = useState('')
  const [category, setCategory] = useState('Not Categorized')
  const [priority, setPriority] = useState<'Urgent' | 'Normal' | 'Low Priority'>('Normal')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      addTodo(text, category, priority)
      setText('')
      // Keep the last used category and priority for next time
      setIsExpanded(false)
    }
  }

  // Function to get priority icon 
  const getPriorityIcon = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'Urgent':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'Normal':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'Low Priority':
        return <Info className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      {!isExpanded ? (
        <button 
          onClick={() => setIsExpanded(true)} 
          className="w-full py-4 px-6 flex items-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <PlusCircle className="h-5 w-5 text-indigo-500 mr-3" />
          <span className="font-medium">Add New Task</span>
        </button>
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Add New Task</h3>
            <button 
              onClick={() => setIsExpanded(false)} 
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="todoText" className="block text-sm font-medium text-gray-700 mb-1">
                Task Description
              </label>
              <input
                id="todoText"
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="What needs to be done?"
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="todoCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="todoCategory"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="todoPriority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="todoPriority"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 pl-8"
                    value={priority}
                    onChange={e => setPriority(e.target.value as 'Urgent' | 'Normal' | 'Low Priority')}
                  >
                    <option value="Low Priority">Low Priority</option>
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  <div className="absolute left-3 top-2.5">
                    {getPriorityIcon(priority)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default TodoForm 