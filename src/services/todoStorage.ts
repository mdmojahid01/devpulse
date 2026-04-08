export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  date: string; // YYYY-MM-DD format
};

const STORAGE_KEY = "devpulse_todos";

type ChromeStorageArea = {
  get: (
    keys: string | string[],
    callback: (items: Record<string, unknown>) => void,
  ) => void;
  set: (items: Record<string, unknown>, callback?: () => void) => void;
  remove: (keys: string | string[], callback?: () => void) => void;
};

type ChromeLike = {
  runtime?: { id?: string };
  storage?: { local?: ChromeStorageArea };
};

function getChromeStorageArea(): ChromeStorageArea | null {
  const chromeApi = (globalThis as typeof globalThis & { chrome?: ChromeLike })
    .chrome;

  if (!chromeApi?.runtime?.id || !chromeApi.storage?.local) {
    return null;
  }

  return chromeApi.storage.local;
}

export const todoStorage = {
  async getTodos(): Promise<Todo[]> {
    const chromeStorage = getChromeStorageArea();

    if (chromeStorage) {
      return new Promise(resolve => {
        chromeStorage.get(STORAGE_KEY, items => {
          const todos = items[STORAGE_KEY] as Todo[] | undefined;
          resolve(todos || []);
        });
      });
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveTodos(todos: Todo[]): Promise<void> {
    const chromeStorage = getChromeStorageArea();

    if (chromeStorage) {
      return new Promise(resolve => {
        chromeStorage.set({ [STORAGE_KEY]: todos }, () => resolve());
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },

  async addTodo(
    title: string,
    description?: string,
    date?: string,
  ): Promise<Todo> {
    const todos = await todoStorage.getTodos();
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      date: date || new Date().toISOString().split("T")[0],
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
    const filtered = todos.filter(t => t.id !== id);
    await todoStorage.saveTodos(filtered);
  },

  async toggleTodo(id: string): Promise<void> {
    const todos = await todoStorage.getTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      await todoStorage.saveTodos(todos);
    }
  },
};
