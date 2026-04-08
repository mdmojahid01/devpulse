import { useState, useEffect, useCallback } from "react";
import { todoStorage } from "@/services/todoStorage";
import type { Todo } from "@/services/todoStorage";

type UseTodosReturn = {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (
    title: string,
    description?: string,
    date?: string,
    parentId?: string,
  ) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  refreshTodos: () => Promise<void>;
};

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoStorage.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = useCallback(
    async (
      title: string,
      description?: string,
      date?: string,
      parentId?: string,
    ) => {
      try {
        await todoStorage.addTodo(title, description, date, parentId);
        await loadTodos();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add todo");
      }
    },
    [loadTodos],
  );

  const updateTodo = useCallback(
    async (id: string, updates: Partial<Todo>) => {
      try {
        await todoStorage.updateTodo(id, updates);
        await loadTodos();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update todo");
      }
    },
    [loadTodos],
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        await todoStorage.deleteTodo(id);
        await loadTodos();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete todo");
      }
    },
    [loadTodos],
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      try {
        await todoStorage.toggleTodo(id);
        await loadTodos();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to toggle todo");
      }
    },
    [loadTodos],
  );

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refreshTodos: loadTodos,
  };
}
