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

  async clearAllTodos(): Promise<void> {
    await todoStorage.saveTodos([]);
  },

  async exportTodos(): Promise<string> {
    const todos = await todoStorage.getTodos();
    const exportData = {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      todos,
    };
    return JSON.stringify(exportData, null, 2);
  },

  async importTodos(
    jsonString: string,
  ): Promise<{ added: number; skipped: number }> {
    try {
      const importData = JSON.parse(jsonString);

      // Validate structure
      if (
        !importData.version ||
        !importData.todos ||
        !Array.isArray(importData.todos)
      ) {
        throw new Error(
          "Invalid JSON structure. Expected format: { version, exportedAt, todos }",
        );
      }

      // Validate each todo item
      for (const todo of importData.todos) {
        if (
          !todo.id ||
          !todo.title ||
          typeof todo.completed !== "boolean" ||
          !todo.createdAt ||
          !todo.date
        ) {
          throw new Error(
            "Invalid todo structure. Each todo must have: id, title, completed, createdAt, date",
          );
        }
      }

      const existingTodos = await todoStorage.getTodos();
      const existingIds = new Set(existingTodos.map(t => t.id));

      // Filter out duplicates
      const newTodos = importData.todos.filter(
        (todo: Todo) => !existingIds.has(todo.id),
      );

      if (newTodos.length > 0) {
        const mergedTodos = [...existingTodos, ...newTodos];
        await todoStorage.saveTodos(mergedTodos);
      }

      return {
        added: newTodos.length,
        skipped: importData.todos.length - newTodos.length,
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Invalid JSON format. Please check your file.");
      }
      throw error;
    }
  },
};
