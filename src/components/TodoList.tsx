import React, { useState, useEffect } from 'react';
import { useTodos } from '../contexts/TodoContext';
import TodoItem from './TodoItem';
import { Todo, TodoPriority } from '../types/todo';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Plus, Loader2, AlertTriangle, SortAsc, SortDesc, ArrowDownAZ, ArrowUpAZ, Flame, AlarmClock } from 'lucide-react';
import CategoryControl from './todo/CategoryControl';

const TodoList: React.FC = () => {
  const { todos, loading, error, addTodo, updateTodo } = useTodos();
  const [newTodoText, setNewTodoText] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<TodoPriority>('normal');
  const [selectedCategory, setSelectedCategory] = useState<string>('Not Categorized');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['Not Categorized', 'Coding', 'Design', 'Research', 'Marketing']);
  const [sortBy, setSortBy] = useState<'position' | 'name' | 'priority'>('position');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isSaving, setIsSaving] = useState(false);

  // For drag and drop - konfigurasi ulang untuk respon lebih cepat
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Konfigurasi agar lebih responsif
      activationConstraint: {
        distance: 3, // Hanya perlu 3px pergerakan
        delay: 50,   // Delay lebih cepat (50ms)
        tolerance: 3, // Toleransi kecil
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Extract unique categories from todos
  useEffect(() => {
    const todoCategories = todos.map(todo => todo.category);
    const uniqueCategories = [...new Set(todoCategories)];
    
    // Make sure we always have the default category
    if (!uniqueCategories.includes('Not Categorized')) {
      uniqueCategories.push('Not Categorized');
    }
    
    setCategories(uniqueCategories);
  }, [todos]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodoText.trim()) return;
    
    setIsSaving(true);
    
    await addTodo({
      text: newTodoText.trim(),
      completed: false,
      priority: selectedPriority,
      category: selectedCategory
    });
    
    // Reset form
    setNewTodoText('');
    setIsSaving(false);
  };
  
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodoText(todo.text);
    setSelectedPriority(todo.priority);
    setSelectedCategory(todo.category);
  };
  
  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTodo || !newTodoText.trim()) return;
    
    setIsSaving(true);
    
    await updateTodo({
      ...editingTodo,
      text: newTodoText.trim(),
      priority: selectedPriority,
      category: selectedCategory
    });
    
    // Reset form
    setEditingTodo(null);
    setNewTodoText('');
    setIsSaving(false);
  };
  
  const handleCancelEdit = () => {
    setEditingTodo(null);
    setNewTodoText('');
    setSelectedPriority('normal');
    setSelectedCategory('Not Categorized');
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (category === 'Not Categorized') return;
    
    setCategories(categories.filter(c => c !== category));
    
    // If the deleted category is currently selected for new todo, reset to default
    if (selectedCategory === category) {
      setSelectedCategory('Not Categorized');
    }
    
    // If we're filtering by the deleted category, reset filter
    if (categoryFilter === category) {
      setCategoryFilter(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.id !== over.id) {
      // Convert IDs to strings to ensure consistent type handling
      const activeId = String(active.id);
      const overId = String(over.id);
      
      // Find the indices of the dragged item and the target position
      const activeIndex = sortedTodos.findIndex(todo => String(todo.id) === activeId);
      const overIndex = sortedTodos.findIndex(todo => String(todo.id) === overId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        // Create a new array with the updated positions
        const updatedTodos = [...sortedTodos];
        const [movedItem] = updatedTodos.splice(activeIndex, 1);
        updatedTodos.splice(overIndex, 0, movedItem);
        
        // Update positions for each todo
        updatedTodos.forEach((todo, index) => {
          if (todo.position !== index) {
            updateTodo({
              ...todo,
              position: index
            });
          }
        });
        
        // Force switch to position-based sorting
        setSortBy('position');
        setSortDirection('asc');
      }
    }
  };
  
  const handleSortChange = (newSortType: 'position' | 'name' | 'priority') => {
    if (sortBy === newSortType) {
      // Toggle direction if clicking the same sort type again
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort type with default direction
      setSortBy(newSortType);
      setSortDirection('asc');
    }
  };

  const sortTodos = (todosToSort: Todo[]) => {
    if (sortBy === 'position') {
      // Sort by position if available, otherwise maintain the order they're in
      return [...todosToSort].sort((a, b) => {
        // If both have positions, sort by position
        if (a.position !== undefined && b.position !== undefined) {
          return a.position - b.position;
        }
        // If only one has position, the one with position comes first
        if (a.position !== undefined) return -1;
        if (b.position !== undefined) return 1;
        // If neither has position, maintain original order
        return 0;
      });
    }

    return [...todosToSort].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.text.localeCompare(b.text);
      } else if (sortBy === 'priority') {
        const priorityValues = { high: 3, normal: 2, low: 1 };
        comparison = priorityValues[b.priority] - priorityValues[a.priority];
      }
      
      // Reverse order if descending
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  };

  const filteredTodos = categoryFilter 
    ? todos.filter(todo => todo.category === categoryFilter)
    : todos;

  const sortedTodos = sortTodos(filteredTodos);

  // Get the appropriate sort icon based on current settings
  const getSortIcon = (type: 'position' | 'name' | 'priority') => {
    if (sortBy !== type) {
      // Gray icon for inactive sort types
      if (type === 'position') return <AlarmClock className="h-5 w-5 text-gray-400" />;
      if (type === 'name') return <ArrowDownAZ className="h-5 w-5 text-gray-400" />;
      if (type === 'priority') return <Flame className="h-5 w-5 text-gray-400" />;
    }
    
    // Colored icon for active sort
    if (type === 'position') {
      return <AlarmClock className="h-5 w-5 text-indigo-600" />;
    }
    
    if (type === 'name') {
      return sortDirection === 'asc' 
        ? <ArrowDownAZ className="h-5 w-5 text-indigo-600" />
        : <ArrowUpAZ className="h-5 w-5 text-indigo-600" />;
    }
    
    if (type === 'priority') {
      return sortDirection === 'asc'
        ? <SortAsc className="h-5 w-5 text-indigo-600" />
        : <SortDesc className="h-5 w-5 text-indigo-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center">
        <div className="bg-red-50 text-red-800 p-4 rounded-md flex items-center shadow-md">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editingTodo ? 'Edit Task' : 'Add New Task'}
        </h2>
        
        <form onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="todo-text" className="block text-sm font-medium text-gray-700 mb-1">
              Task Description
            </label>
            <input
              type="text"
              id="todo-text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as TodoPriority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <div 
                    key={category}
                    className={`px-3 py-1.5 rounded-md cursor-pointer text-sm
                      ${selectedCategory === category 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {editingTodo && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md transition
                ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingTodo ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {editingTodo ? 'Update Task' : 'Add Task'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 mr-2">Sort by:</span>
            
            <div className="flex bg-white border border-gray-200 rounded-md shadow-sm">
              <button
                onClick={() => handleSortChange('position')}
                className={`p-2 flex items-center ${sortBy === 'position' ? 'bg-indigo-50 text-indigo-600 border-r border-gray-200' : 'bg-white text-gray-600 border-r border-gray-200'}`}
                title="Sort by manual order (drag & drop)"
              >
                {getSortIcon('position')}
                <span className="ml-1 text-xs hidden sm:inline">Manual</span>
              </button>
              <button
                onClick={() => handleSortChange('name')}
                className={`p-2 flex items-center ${sortBy === 'name' ? 'bg-indigo-50 text-indigo-600 border-r border-gray-200' : 'bg-white text-gray-600 border-r border-gray-200'}`}
                title={`Sort by name (${sortDirection === 'asc' ? 'A to Z' : 'Z to A'})`}
              >
                {getSortIcon('name')}
                <span className="ml-1 text-xs hidden sm:inline">Name</span>
              </button>
              <button
                onClick={() => handleSortChange('priority')}
                className={`p-2 flex items-center ${sortBy === 'priority' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-600'}`}
                title={`Sort by priority (${sortDirection === 'asc' ? 'low to high' : 'high to low'})`}
              >
                {getSortIcon('priority')}
                <span className="ml-1 text-xs hidden sm:inline">Priority</span>
              </button>
            </div>
          </div>
        </div>
        
        <CategoryControl
          categories={categories}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      </div>
      
      {sortedTodos.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center mt-6">
          <p className="text-gray-500">
            {categoryFilter 
              ? `No tasks in the "${categoryFilter}" category yet.` 
              : "No tasks yet. Add your first task above!"}
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext 
              items={sortedTodos.map(todo => `${todo.id}`)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sortedTodos.map((todo) => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onEdit={handleEditTodo} 
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default TodoList;