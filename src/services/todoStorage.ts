import { storage } from "./storage";

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  date: string; // YYYY-MM-DD format
  parentId?: string; // For subtasks
};

const STORAGE_KEY = "devpulse_todos";

export const todoStorage = {
  async getTodos(): Promise<Todo[]> {
    const todos = await storage.get<Todo[]>(STORAGE_KEY);
    return todos || [];
  },

  async saveTodos(todos: Todo[]): Promise<void> {
    await storage.set(STORAGE_KEY, todos);
  },

  async addTodo(
    title: string,
    description?: string,
    date?: string,
    parentId?: string,
  ): Promise<Todo> {
    const todos = await todoStorage.getTodos();
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      date: date || new Date().toISOString().split("T")[0],
      parentId,
    };
    todos.push(newTodo);
    await todoStorage.saveTodos(todos);
    return newTodo;
  },

  async updateTodo(id: string, updates: Partial<Todo>): Promise<void> {
    const todos = await todoStorage.getTodos();
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updates };
      await todoStorage.saveTodos(todos);
    }
  },

  async deleteTodo(id: string): Promise<void> {
    const todos = await todoStorage.getTodos();
    // Delete the todo and all its subtasks
    const filtered = todos.filter(t => t.id !== id && t.parentId !== id);
    await todoStorage.saveTodos(filtered);
  },

  async toggleTodo(id: string): Promise<void> {
    const todos = await todoStorage.getTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      // Also toggle all subtasks
      const subtasks = todos.filter(t => t.parentId === id);
      subtasks.forEach(subtask => {
        subtask.completed = todo.completed;
      });
      await todoStorage.saveTodos(todos);
    }
  },
};
