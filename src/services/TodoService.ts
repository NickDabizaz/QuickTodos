import { Todo } from './StorageService';

/**
 * Sort todos based on the specified sorting criteria
 */
export const sortTodos = (todos: Todo[], sortType: string): Todo[] => {
  // logger.debug(`Sorting todos by: ${sortType}`);
  
  const sortedTodos = [...todos];
  
  switch (sortType) {
    case 'name':
      // logger.debug('Applying name sort');
      return sortedTodos.sort((a, b) => {
        // Primary sort by name
        const nameResult = a.text.localeCompare(b.text);
        
        // Secondary sort by priority if names are equal
        if (nameResult === 0) {
          const priorityOrder: {[key: string]: number} = { 
            'Urgent': 0, 
            'Normal': 1, 
            'Low Priority': 2 
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        return nameResult;
      });
      
    case 'priority': {
      // logger.debug('Applying priority sort');
      const priorityOrder: {[key: string]: number} = { 
        'Urgent': 0, 
        'Normal': 1, 
        'Low Priority': 2 
      };
      
      return sortedTodos.sort((a, b) => {
        // Primary sort by priority
        const priorityResult = priorityOrder[a.priority] - priorityOrder[b.priority];
        
        // Secondary sort by completion status
        if (priorityResult === 0) {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
        }
        
        // Tertiary sort by name if priority and completion are equal
        if (priorityResult === 0 && a.completed === b.completed) {
          return a.text.localeCompare(b.text);
        }
        
        return priorityResult;
      });
    }
    
    case 'category':
      // logger.debug('Applying category sort');
      return sortedTodos.sort((a, b) => {
        // Primary sort by category
        const categoryResult = a.category.localeCompare(b.category);
        
        // Secondary sort by priority within the same category
        if (categoryResult === 0) {
          const priorityOrder: {[key: string]: number} = { 
            'Urgent': 0, 
            'Normal': 1, 
            'Low Priority': 2 
          };
          const priorityResult = priorityOrder[a.priority] - priorityOrder[b.priority];
          
          // Tertiary sort by name if category and priority are equal
          if (priorityResult === 0) {
            return a.text.localeCompare(b.text);
          }
          
          return priorityResult;
        }
        
        return categoryResult;
      });
      
    case 'completed':
      // logger.debug('Applying completed status sort');
      return sortedTodos.sort((a, b) => {
        // Primary sort by completion status
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        
        // Secondary sort by priority for items with the same completion status
        if (a.completed === b.completed) {
          const priorityOrder: {[key: string]: number} = { 
            'Urgent': 0, 
            'Normal': 1, 
            'Low Priority': 2 
          };
          const priorityResult = priorityOrder[a.priority] - priorityOrder[b.priority];
          
          // Tertiary sort by name if completion and priority are equal
          if (priorityResult === 0) {
            return a.text.localeCompare(b.text);
          }
          
          return priorityResult;
        }
        
        return 0; // This should never execute
      });
      
    case 'position':
    default:
      // logger.debug('Applying position sort (default)');
      return sortedTodos.sort((a, b) => a.position - b.position);
  }
};

/**
 * Filter todos based on category and completion status
 */
export const filterTodos = (
  todos: Todo[], 
  categoryFilter: string | null, 
  completionFilter: 'all' | 'active' | 'completed'
): Todo[] => {
  // logger.debug(
  //   `Filtering todos with categoryFilter: ${categoryFilter || 'none'}, completionFilter: ${completionFilter}`
  // );
  
  return todos.filter(todo => {
    // Apply category filter
    const passesCategory = !categoryFilter || todo.category === categoryFilter;
    
    // Apply completion filter
    const passesCompletion = 
      completionFilter === 'all' ? true :
      completionFilter === 'completed' ? todo.completed :
      !todo.completed;
      
    return passesCategory && passesCompletion;
  });
};

/**
 * Get filtered and sorted todos
 */
export const getFilteredAndSortedTodos = (
  todos: Todo[],
  categoryFilter: string | null,
  completionFilter: 'all' | 'active' | 'completed',
  sortBy: string
): Todo[] => {
  // logger.debug(
  //   `Processing todos with filters and sorting: category=${categoryFilter || 'all'}, completion=${completionFilter}, sortBy=${sortBy}`
  // );
  
  // First filter
  const filtered = filterTodos(todos, categoryFilter, completionFilter);
  
  // Then sort
  const result = sortTodos(filtered, sortBy);
  
  // logger.debug(`Filtered from ${todos.length} to ${filtered.length} todos, then sorted by ${sortBy}`);
  return result;
};

/**
 * Add a new todo
 */
export const addTodo = (
  todos: Todo[],
  text: string,
  category: string,
  priority: 'Urgent' | 'Normal' | 'Low Priority'
): Todo[] => {
  if (!text.trim()) {
    // logger.warn('Attempted to add todo with empty text');
    return todos;
  }
  
  // logger.debug(`Adding new todo with text: ${text}, category: ${category}, priority: ${priority}`);
  
  // Find the highest current position
  const maxPosition = todos.reduce((max, todo) => Math.max(max, todo.position), -1);
  
  const newTodo: Todo = { 
    id: Date.now(), 
    text, 
    completed: false,
    category,
    priority,
    position: maxPosition + 1 // Assign next position
  };
  
  const newTodos = [...todos, newTodo];
  // logger.info(`Added new todo with id: ${newTodo.id}`);
  return newTodos;
};

/**
 * Delete a todo by id
 */
export const deleteTodo = (todos: Todo[], id: number): Todo[] => {
  // logger.debug(`Deleting todo with id: ${id}`);
  const newTodos = todos.filter(t => t.id !== id);
  
  if (newTodos.length === todos.length) {
    // logger.warn(`Todo with id: ${id} not found, nothing deleted`);
  } else {
    // logger.info(`Deleted todo with id: ${id}`);
  }
  
  return newTodos;
};

/**
 * Toggle todo completion status
 */
export const toggleTodoComplete = (todos: Todo[], id: number): Todo[] => {
  // logger.debug(`Toggling completion status for todo with id: ${id}`);
  
  const newTodos = todos.map(todo => {
    if (todo.id === id) {
      const newStatus = !todo.completed;
      // logger.info(`Todo ${id} completion status changed to: ${newStatus}`);
      return { ...todo, completed: newStatus };
    }
    return todo;
  });
  
  return newTodos;
};

/**
 * Updates the positions of todos after a drag-and-drop operation
 * 
 * @param todos The complete list of todos
 * @param todoId The ID of the todo that was dragged
 * @param sourceIndex The index the todo was dragged from
 * @param destIndex The index the todo was dropped at
 * @param displayedTodos The filtered/sorted list of todos being displayed
 * @returns Updated list of todos with new positions
 */
export const updateTodoPositions = (
  todos: Todo[],
  todoId: number,
  sourceIndex: number,
  destIndex: number,
  displayedTodos: Todo[]
): Todo[] => {
  // logger.info(
  //   `Updating todo positions: todoId=${todoId}, sourceIndex=${sourceIndex}, destIndex=${destIndex}`
  // )
  
  // Check if we're dealing with a filtered or sorted view
  const isFiltered = todos.length !== displayedTodos.length
  
  // If no filtering or sorting, we can use a straightforward approach
  if (!isFiltered) {
    // logger.debug('Using direct repositioning (no filters applied)')
    const newTodos = [...todos]
    const [draggedItem] = newTodos.splice(sourceIndex, 1)
    newTodos.splice(destIndex, 0, draggedItem)
    
    // Update all position values
    return newTodos.map((todo, index) => ({
      ...todo,
      position: index
    }))
  }
  
  // For filtered lists, we need to find the actual indices in the main todos array
  // logger.debug('Using complex repositioning (filters applied)')
  
  // Create a map of id to position in the todos array for efficient lookup
  const idToPositionMap = new Map<number, number>()
  todos.forEach((todo, index) => {
    idToPositionMap.set(todo.id, index)
  })
  
  // Get the actual source and destination indices in the todos array
  const actualSourceIndex = idToPositionMap.get(displayedTodos[sourceIndex].id)
  const actualDestIndex = idToPositionMap.get(displayedTodos[destIndex].id)
  
  if (actualSourceIndex === undefined || actualDestIndex === undefined) {
    // logger.error(`Failed to find todo in position map: source=${sourceIndex}, dest=${destIndex}`)
    return todos // Return original array if we can't find the indices
  }
  
  // logger.debug(
  //   `Mapped display indices to actual indices: source=${sourceIndex}->${actualSourceIndex}, dest=${destIndex}->${actualDestIndex}`
  // )
  
  // Create a new array and perform the move
  const newTodos = [...todos]
  const [draggedItem] = newTodos.splice(actualSourceIndex, 1)
  
  // Adjust destination index if it's after the source (since we removed an item)
  const adjustedDestIndex = actualDestIndex > actualSourceIndex 
    ? actualDestIndex - 1 
    : actualDestIndex
  
  newTodos.splice(adjustedDestIndex, 0, draggedItem)
  
  // Update all position values
  return newTodos.map((todo, index) => ({
    ...todo,
    position: index
  }))
};

const TodoService = {
  sortTodos,
  filterTodos,
  getFilteredAndSortedTodos,
  addTodo,
  deleteTodo,
  toggleTodoComplete,
  updateTodoPositions
};

export default TodoService; 