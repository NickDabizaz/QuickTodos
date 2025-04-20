export type TodoPriority = 'low' | 'normal' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: TodoPriority;
  category: string;
  createdAt: Date;
  position?: number; // Optional position for reordering
}

export interface TodoRoom {
  id: string;
  todos: Todo[];
  categories: string[]; // Room-specific categories
  createdAt: Date;
  lastUpdated: Date;
} 