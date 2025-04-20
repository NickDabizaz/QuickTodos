import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp, 
  arrayUnion, 
  arrayRemove
} from 'firebase/firestore';
import { Todo, TodoRoom } from '../types/todo';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

const COMPONENT_NAME = 'FirebaseService';

// Collection reference
const roomsCollection = collection(db, 'rooms');

// Create a new room
export const createRoom = async (roomId: string): Promise<void> => {
  try {
    logger.info(COMPONENT_NAME, `Creating new room with ID: ${roomId}`);
    const roomRef = doc(roomsCollection, roomId);
    const roomSnapshot = await getDoc(roomRef);
    
    if (!roomSnapshot.exists()) {
      logger.debug(COMPONENT_NAME, `Room doesn't exist, creating new one`);
      await setDoc(roomRef, {
        id: roomId,
        todos: [],
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      logger.info(COMPONENT_NAME, `Room created successfully: ${roomId}`);
    } else {
      logger.info(COMPONENT_NAME, `Room already exists: ${roomId}`);
    }
  } catch (error) {
    logger.error(COMPONENT_NAME, `Error creating room: ${roomId}`, String(error));
    throw error;
  }
};

// Get a room by ID
export const getRoom = async (roomId: string): Promise<TodoRoom | null> => {
  try {
    logger.info(COMPONENT_NAME, `Getting room with ID: ${roomId}`);
    const roomRef = doc(roomsCollection, roomId);
    const roomSnapshot = await getDoc(roomRef);
    
    if (!roomSnapshot.exists()) {
      logger.warn(COMPONENT_NAME, `Room not found: ${roomId}`);
      return null;
    }
    
    const roomData = roomSnapshot.data();
    logger.debug(COMPONENT_NAME, `Room data retrieved successfully`, roomData);
    
    // Convert Firestore timestamps to JS Date objects
    return {
      id: roomData.id,
      todos: roomData.todos.map((todo: any) => ({
        ...todo,
        createdAt: todo.createdAt instanceof Timestamp 
          ? todo.createdAt.toDate() 
          : new Date(todo.createdAt)
      })),
      createdAt: roomData.createdAt instanceof Timestamp 
        ? roomData.createdAt.toDate() 
        : new Date(roomData.createdAt),
      lastUpdated: roomData.lastUpdated instanceof Timestamp 
        ? roomData.lastUpdated.toDate() 
        : new Date(roomData.lastUpdated)
    };
  } catch (error) {
    logger.error(COMPONENT_NAME, `Error getting room: ${roomId}`, String(error));
    throw error;
  }
};

// Add a todo to a room
export const addTodo = async (roomId: string, todo: Omit<Todo, 'id' | 'createdAt'>): Promise<string> => {
  try {
    logger.info(COMPONENT_NAME, `Adding todo to room: ${roomId}`, todo);
    const roomRef = doc(roomsCollection, roomId);
    const todoId = uuidv4();
    
    const newTodo = {
      ...todo,
      id: todoId,
      createdAt: new Date()
    };
    
    await updateDoc(roomRef, {
      todos: arrayUnion(newTodo),
      lastUpdated: serverTimestamp()
    });
    
    logger.info(COMPONENT_NAME, `Todo added successfully to room: ${roomId}, with ID: ${todoId}`);
    return todoId;
  } catch (error) {
    logger.error(COMPONENT_NAME, `Error adding todo to room: ${roomId}`, String(error));
    throw error;
  }
};

// Update a todo
export const updateTodo = async (roomId: string, updatedTodo: Todo): Promise<void> => {
  try {
    logger.info(COMPONENT_NAME, `Updating todo in room: ${roomId}`, updatedTodo);
    const roomRef = doc(roomsCollection, roomId);
    const roomSnapshot = await getDoc(roomRef);
    
    if (!roomSnapshot.exists()) {
      logger.warn(COMPONENT_NAME, `Room not found for updating todo: ${roomId}`);
      return;
    }
    
    const roomData = roomSnapshot.data();
    const todos = roomData.todos;
    
    // Find and remove the old todo
    const oldTodoIndex = todos.findIndex((todo: Todo) => todo.id === updatedTodo.id);
    if (oldTodoIndex === -1) {
      logger.warn(COMPONENT_NAME, `Todo not found for update: ${updatedTodo.id} in room: ${roomId}`);
      return;
    }
    
    const oldTodo = todos[oldTodoIndex];
    
    // Remove old todo and add updated one
    await updateDoc(roomRef, {
      todos: arrayRemove(oldTodo)
    });
    
    await updateDoc(roomRef, {
      todos: arrayUnion(updatedTodo),
      lastUpdated: serverTimestamp()
    });
    
    logger.info(COMPONENT_NAME, `Todo updated successfully: ${updatedTodo.id} in room: ${roomId}`);
  } catch (error) {
    logger.error(COMPONENT_NAME, `Error updating todo: ${updatedTodo.id} in room: ${roomId}`, String(error));
    throw error;
  }
};

// Delete a todo
export const deleteTodo = async (roomId: string, todoId: string): Promise<void> => {
  try {
    logger.info(COMPONENT_NAME, `Deleting todo: ${todoId} from room: ${roomId}`);
    const roomRef = doc(roomsCollection, roomId);
    const roomSnapshot = await getDoc(roomRef);
    
    if (!roomSnapshot.exists()) {
      logger.warn(COMPONENT_NAME, `Room not found for deleting todo: ${roomId}`);
      return;
    }
    
    const roomData = roomSnapshot.data();
    const todoToDelete = roomData.todos.find((todo: Todo) => todo.id === todoId);
    
    if (todoToDelete) {
      await updateDoc(roomRef, {
        todos: arrayRemove(todoToDelete),
        lastUpdated: serverTimestamp()
      });
      logger.info(COMPONENT_NAME, `Todo deleted successfully: ${todoId} from room: ${roomId}`);
    } else {
      logger.warn(COMPONENT_NAME, `Todo not found for deletion: ${todoId} in room: ${roomId}`);
    }
  } catch (error) {
    logger.error(COMPONENT_NAME, `Error deleting todo: ${todoId} from room: ${roomId}`, String(error));
    throw error;
  }
}; 