import { useState, useMemo, useEffect } from "react";
import { useTodos } from "@/hooks/useTodos";
import { Checkbox, Kbd } from "@heroui/react";
import {
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiCircle,
  FiClock,
} from "react-icons/fi";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import { formatDate } from "@/lib/dateFormat";
import type { Todo } from "@/services/todoStorage";

export default function TodoList() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [expandedPrevious, setExpandedPrevious] = useState(false);

  const isMac = globalThis?.navigator?.userAgent.includes("Mac") ?? false;

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const yesterday = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  }, []);

  // Keyboard shortcut: Cmd+K (Mac) or Ctrl+K (Windows/Linux)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowInput(prev => !prev);
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, []);

  const todayTodos = todos.filter(t => t.date === today && !t.completed);
  const todayCompleted = todos.filter(t => t.date === today && t.completed);
  const previousTodos = todos.filter(t => t.date < today && !t.completed);

  // Group previous todos by date
  const groupedPreviousTodos = useMemo(() => {
    const groups: Record<string, Todo[]> = {};
    previousTodos.forEach(todo => {
      if (!groups[todo.date]) {
        groups[todo.date] = [];
      }
      groups[todo.date].push(todo);
    });
    // Sort dates in descending order (most recent first)
    return Object.entries(groups).sort(([dateA], [dateB]) =>
      dateB.localeCompare(dateA),
    );
  }, [previousTodos]);

  const analytics = useMemo(() => {
    const totalPending = todos.filter(t => !t.completed).length;
    const todayPending = todayTodos.length;
    const totalCompleted = todos.filter(t => t.completed).length;
    return { totalPending, todayPending, totalCompleted };
  }, [todos, todayTodos]);

  const handleAdd = async () => {
    if (newTitle.trim()) {
      await addTodo(newTitle.trim(), newDescription.trim() || undefined);
      setNewTitle("");
      setNewDescription("");
      // Keep the form open for adding another task
      // User can press Esc to close
    }
  };

  const handleCancel = () => {
    setShowInput(false);
    setNewTitle("");
    setNewDescription("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AppCard className="p-4">
          <AppCard.Content className="flex items-center gap-3">
            <FiCircle className="text-accent text-2xl" />
            <div>
              <p className="text-muted text-sm">Total Pending</p>
              <p className="text-center text-2xl font-bold">
                {analytics.totalPending}
              </p>
            </div>
          </AppCard.Content>
        </AppCard>

        <AppCard className="p-4">
          <AppCard.Content className="flex items-center gap-3">
            <FiClock className="text-warning text-2xl" />
            <div>
              <p className="text-muted text-sm">Today Pending</p>
              <p className="text-center text-2xl font-bold">
                {analytics.todayPending}
              </p>
            </div>
          </AppCard.Content>
        </AppCard>

        <AppCard className="p-4">
          <AppCard.Content className="flex items-center gap-3">
            <FiCheckCircle className="text-success text-2xl" />
            <div>
              <p className="text-muted text-sm">Total Completed</p>
              <p className="text-center text-2xl font-bold">
                {analytics.totalCompleted}
              </p>
            </div>
          </AppCard.Content>
        </AppCard>
      </div>

      {/* Tasks List */}
      <AppCard className="h-full p-6">
        <AppCard.Header className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">Manage Your Daily Tasks</h2>
          <div className="flex items-center gap-1">
            <Kbd>
              <Kbd.Abbr keyValue={isMac ? "command" : "ctrl"} />
            </Kbd>
            <Kbd>
              <Kbd.Content>K</Kbd.Content>
            </Kbd>
          </div>
        </AppCard.Header>

        <AppCard.Content className="space-y-4">
          {loading ? (
            <div className="text-muted flex items-center justify-center py-8 text-sm">
              Loading tasks...
            </div>
          ) : error ? (
            <div className="text-danger flex items-center justify-center py-8 text-sm">
              {error}
            </div>
          ) : (
            <>
              {/* Today's Tasks */}
              <div className="space-y-2">
                <h3 className="text-muted text-xs font-medium uppercase">
                  Today
                </h3>

                {todayTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}

                {/* Add New Task */}
                {showInput ? (
                  <div className="border-divider space-y-2 rounded-lg border p-3">
                    <AppInput
                      placeholder="Task title"
                      ariaLabel="Task title"
                      value={newTitle}
                      onChange={setNewTitle}
                      autoFocus
                      fullWidth
                      onKeyDown={handleKeyDown}
                    />
                    <AppInput
                      placeholder="Description (optional)"
                      ariaLabel="Task description"
                      value={newDescription}
                      onChange={setNewDescription}
                      fullWidth
                      onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <AppButton
                          size="sm"
                          variant="primary"
                          onPress={handleAdd}
                        >
                          Add
                        </AppButton>
                        <AppButton
                          size="sm"
                          variant="ghost"
                          onPress={handleCancel}
                        >
                          Cancel
                        </AppButton>
                      </div>
                      <div className="text-muted flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1">
                          <Kbd variant="light">
                            <Kbd.Abbr keyValue="escape" />
                          </Kbd>
                          <span>Cancel</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Kbd variant="light">
                            <Kbd.Abbr keyValue={isMac ? "command" : "ctrl"} />
                            <Kbd.Abbr keyValue="enter" />
                          </Kbd>
                          <span>Add</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowInput(true)}
                    className="text-accent hover:text-accent/80 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors"
                  >
                    <FiPlus className="size-4" />
                    <span>Add task</span>
                  </button>
                )}

                {/* Completed Today */}
                {todayCompleted.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-muted text-xs font-medium">
                      Completed
                    </h4>
                    {todayCompleted.map(todo => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Previous Pending Tasks */}
              {previousTodos.length > 0 && (
                <div className="border-divider border-t pt-4">
                  <button
                    onClick={() => setExpandedPrevious(!expandedPrevious)}
                    className="text-muted hover:text-foreground flex w-full items-center justify-between text-xs font-medium uppercase transition-colors"
                  >
                    <span>Previous ({previousTodos.length})</span>
                    {expandedPrevious ? (
                      <FiChevronUp className="size-4" />
                    ) : (
                      <FiChevronDown className="size-4" />
                    )}
                  </button>

                  {expandedPrevious && (
                    <div className="mt-2 max-h-64 space-y-4 overflow-y-auto">
                      {groupedPreviousTodos.map(([date, dateTodos]) => {
                        const isYesterday = date === yesterday;

                        return (
                          <div key={date} className="space-y-2">
                            <h4 className="text-muted text-xs font-medium">
                              {isYesterday ? "Yesterday" : formatDate(date)}
                            </h4>
                            {dateTodos.map(todo => (
                              <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                              />
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </AppCard.Content>
      </AppCard>
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  showDate?: boolean;
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
  showDate,
}: Readonly<TodoItemProps>) {
  return (
    <div className="group hover:bg-surface flex items-start gap-3 rounded-lg px-2 py-2 transition-colors">
      <div className="flex items-center">
        <Checkbox
          isSelected={todo.completed}
          onChange={() => onToggle(todo.id)}
          variant="secondary"
        >
          <Checkbox.Control className="size-5">
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${todo.completed ? "text-muted line-through" : "text-foreground"}`}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-muted mt-0.5 text-xs">{todo.description}</p>
        )}
        {showDate && (
          <p className="text-muted mt-0.5 text-xs">{formatDate(todo.date)}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-muted hover:text-danger flex-shrink-0 opacity-0 transition-all group-hover:opacity-100"
        title="Delete task"
      >
        <FiTrash2 className="size-4" />
      </button>
    </div>
  );
}
