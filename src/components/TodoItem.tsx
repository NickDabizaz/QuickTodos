import React from 'react'
import { Check, Trash2, Edit, GripVertical } from 'lucide-react'
import { Todo } from '../types/todo'
import { useTodos } from '../contexts/TodoContext'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TodoItemProps {
  todo: Todo
  onEdit: (todo: Todo) => void
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const { updateTodo, deleteTodo } = useTodos()

  // Add sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: `${todo.id}`,
    data: {
      todo
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
    position: 'relative' as const
  }

  const handleStatusChange = () => {
    // Optimistic update - langsung update UI dulu
    const newStatus = !todo.completed;
    
    // Kemudian update di backend
    updateTodo({
      ...todo,
      completed: newStatus
    });
  }

  const handleDelete = async () => {
    await deleteTodo(todo.id)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'normal':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Coding': 'bg-blue-100 text-blue-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Research': 'bg-indigo-100 text-indigo-800',
      'Marketing': 'bg-orange-100 text-orange-800'
    }

    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      className={`flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all ${
        todo.completed ? 'bg-gray-50' : ''
      } ${isDragging ? 'ring-2 ring-indigo-500 shadow-lg bg-indigo-50' : ''}`}
    >
      <div className="flex items-center flex-1">
        <button
          onClick={handleStatusChange}
          className={`w-6 h-6 mr-3 rounded-full border flex items-center justify-center ${
            todo.completed 
              ? 'bg-indigo-600 border-indigo-600 text-white' 
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          {todo.completed && <Check className="h-4 w-4" />}
        </button>
        <div className="flex-1">
          <p className={`text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.text}
          </p>
          <div className="flex items-center space-x-2 mt-1.5">
            <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(todo.priority)}`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(todo.category)}`}>
              {todo.category}
            </span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 ml-2">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 text-gray-500 hover:text-indigo-600 transition-colors"
          aria-label="Edit todo"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
          aria-label="Delete todo"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <div
          {...listeners}
          className="p-1.5 text-gray-400 cursor-grab touch-none active:cursor-grabbing hover:bg-gray-100 rounded-md"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default TodoItem