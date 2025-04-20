// import logger from '../utils/logger';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  priority: 'Urgent' | 'Normal' | 'Low Priority';
  position: number;
}

/**
 * Generate a storage key based on the listId
 */
const getStorageKey = (listId: string, type: 'todos' | 'categories'): string => {
  const keySuffix = listId || 'default';
  return `${type}-${keySuffix}`;
};

/**
 * Load todos from localStorage for a specific list
 */
export const loadTodos = (listId: string): Todo[] => {
  if (typeof window === 'undefined') {
    // logger.warn('Attempted to load todos in a non-browser environment');
    return [];
  }

  const storageKey = getStorageKey(listId, 'todos');
  // logger.debug(`Loading todos from localStorage with key: ${storageKey}`);

  try {
    const savedData = localStorage.getItem(storageKey);
    
    if (!savedData) {
      // logger.info(`No todos found for list: ${listId}`);
      return [];
    }

    const parsedData = JSON.parse(savedData) as Array<Partial<Todo>>;
    
    // Ensure data integrity by migrating/fixing any missing properties
    const migratedTodos = parsedData.map((todo, index) => {
      const migratedTodo: Todo = {
        id: todo.id ?? Date.now() + index,
        text: todo.text ?? 'Untitled Task',
        completed: todo.completed ?? false,
        category: todo.category ?? 'Not Categorized',
        priority: (todo.priority as Todo['priority']) ?? 'Normal',
        position: todo.position ?? index
      };
      return migratedTodo;
    });

    // logger.info(`Successfully loaded ${migratedTodos.length} todos for list: ${listId}`);
    return migratedTodos;
  } catch (error) {
    // logger.error(`Failed to parse todos from localStorage for list: ${listId}`, String(error));
    // Fallback: Log error to console if logger is removed
    console.error(`Failed to parse todos from localStorage for list: ${listId}`, String(error));
    return [];
  }
};

/**
 * Save todos to localStorage for a specific list
 */
export const saveTodos = (listId: string, todos: Todo[]): boolean => {
  if (typeof window === 'undefined') {
    // logger.warn('Attempted to save todos in a non-browser environment');
    return false;
  }

  const storageKey = getStorageKey(listId, 'todos');
  // logger.debug(`Saving ${todos.length} todos to localStorage with key: ${storageKey}`);

  try {
    localStorage.setItem(storageKey, JSON.stringify(todos));
    // logger.info(`Successfully saved ${todos.length} todos for list: ${listId}`);
    return true;
  } catch (error) {
    // logger.error(`Failed to save todos to localStorage for list: ${listId}`, String(error));
    // Fallback: Log error to console if logger is removed
    console.error(`Failed to save todos to localStorage for list: ${listId}`, String(error));
    return false;
  }
};

/**
 * Load categories from localStorage for a specific list
 */
export const loadCategories = (listId: string): string[] => {
  if (typeof window === 'undefined') {
    // logger.warn('Attempted to load categories in a non-browser environment');
    return ['Not Categorized', 'Coding', 'Design', 'Research', 'Marketing'];
  }

  const storageKey = getStorageKey(listId, 'categories');
  // logger.debug(`Loading categories from localStorage with key: ${storageKey}`);

  try {
    const savedData = localStorage.getItem(storageKey);
    
    if (!savedData) {
      // logger.info(`No categories found for list: ${listId}, using defaults`);
      return ['Not Categorized', 'Coding', 'Design', 'Research', 'Marketing'];
    }

    const parsedData = JSON.parse(savedData);
    
    if (!Array.isArray(parsedData)) {
      // logger.warn(`Invalid categories data for list: ${listId}, using defaults`);
      return ['Not Categorized', 'Coding', 'Design', 'Research', 'Marketing'];
    }

    // logger.info(`Successfully loaded ${parsedData.length} categories for list: ${listId}`);
    return parsedData;
  } catch (error) {
    // logger.error(`Failed to parse categories from localStorage for list: ${listId}`, String(error));
    // Fallback: Log error to console if logger is removed
    console.error(`Failed to parse categories from localStorage for list: ${listId}`, String(error));
    return ['Not Categorized', 'Coding', 'Design', 'Research', 'Marketing'];
  }
};

/**
 * Save categories to localStorage for a specific list
 */
export const saveCategories = (listId: string, categories: string[]): boolean => {
  if (typeof window === 'undefined') {
    // logger.warn('Attempted to save categories in a non-browser environment');
    return false;
  }

  const storageKey = getStorageKey(listId, 'categories');
  // logger.debug(`Saving ${categories.length} categories to localStorage with key: ${storageKey}`);

  try {
    localStorage.setItem(storageKey, JSON.stringify(categories));
    // logger.info(`Successfully saved ${categories.length} categories for list: ${listId}`);
    return true;
  } catch (error) {
    // logger.error(`Failed to save categories to localStorage for list: ${listId}`, String(error));
    // Fallback: Log error to console if logger is removed
    console.error(`Failed to save categories to localStorage for list: ${listId}`, String(error));
    return false;
  }
};

const StorageService = {
  loadTodos,
  saveTodos,
  loadCategories,
  saveCategories
};

export default StorageService; 