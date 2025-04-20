'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Todo, TodoRoom } from '../types/todo';
import { 
  getRoom, 
  addTodo as fbAddTodo, 
  updateTodo as fbUpdateTodo, 
  deleteTodo as fbDeleteTodo 
} from '../services/firebase';

interface TodoContextProps {
  roomId: string | null;
  loading: boolean;
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  error: string | null;
}

const TodoContext = createContext<TodoContextProps>({
  roomId: null,
  loading: true,
  todos: [],
  addTodo: async () => {},
  updateTodo: async () => {},
  deleteTodo: async () => {},
  error: null
});

export const useTodos = () => useContext(TodoContext);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const roomId = pathname ? pathname.substring(1) : null;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch room data
  useEffect(() => {
    const fetchData = async () => {
      if (!roomId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const roomData = await getRoom(roomId);
        
        if (!roomData) {
          // If room doesn't exist, redirect to homepage
          router.push('/');
          setError('Room not found');
          return;
        }
        
        setTodos(roomData.todos || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching room data:', err);
        setError('Failed to load room data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [roomId, router]);
  
  // Add todo
  const addTodo = async (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    if (!roomId) return;
    
    try {
      const todoId = await fbAddTodo(roomId, todoData);
      
      // Update local state to avoid refetching
      const newTodo: Todo = {
        ...todoData,
        id: todoId,
        createdAt: new Date()
      };
      
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo');
    }
  };
  
  // Update todo
  const updateTodo = async (updatedTodo: Todo) => {
    if (!roomId) return;
    
    try {
      await fbUpdateTodo(roomId, updatedTodo);
      
      // Update local state
      setTodos(prev => 
        prev.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
      );
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo');
    }
  };
  
  // Delete todo
  const deleteTodo = async (todoId: string) => {
    if (!roomId) return;
    
    try {
      await fbDeleteTodo(roomId, todoId);
      
      // Update local state
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo');
    }
  };
  
  return (
    <TodoContext.Provider
      value={{
        roomId,
        loading,
        todos,
        addTodo,
        updateTodo,
        deleteTodo,
        error
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}; 