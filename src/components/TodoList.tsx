import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { Checkbox } from "@heroui/react";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
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

  const today = new Date().toISOString().split("T")[0];

  const todayTodos = todos.filter(t => t.date === today && !t.completed);
  const todayCompleted = todos.filter(t => t.date === today && t.completed);
  const previousTodos = todos.filter(t => t.date < today && !t.completed);

  const handleAdd = async () => {
    if (newTitle.trim()) {
      await addTodo(newTitle.trim(), newDescription.trim() || undefined);
      setNewTitle("");
      setNewDescription("");
      setShowInput(false);
    }
  };

  return (
    <AppCard className="h-full">
      <AppCard.Header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
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
                    value={newTitle}
                    onChange={setNewTitle}
                    autoFocus
                    fullWidth
                    onKeyDown={e => e.key === "Enter" && handleAdd()}
                  />
                  <AppInput
                    placeholder="Description (optional)"
                    value={newDescription}
                    onChange={setNewDescription}
                    fullWidth
                    onKeyDown={e => e.key === "Enter" && handleAdd()}
                  />
                  <div className="flex gap-2">
                    <AppButton size="sm" variant="primary" onPress={handleAdd}>
                      Add
                    </AppButton>
                    <AppButton
                      size="sm"
                      variant="ghost"
                      onPress={() => {
                        setShowInput(false);
                        setNewTitle("");
                        setNewDescription("");
                      }}
                    >
                      Cancel
                    </AppButton>
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
                  <h4 className="text-muted text-xs font-medium">Completed</h4>
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
                  <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                    {previousTodos.map(todo => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        showDate
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </AppCard.Content>
    </AppCard>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  showDate?: boolean;
}

function TodoItem({ todo, onToggle, onDelete, showDate }: TodoItemProps) {
  return (
    <div className="group hover:bg-surface flex items-start gap-3 rounded-lg px-2 py-2 transition-colors">
      <Checkbox
        isSelected={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="mt-0.5"
      />
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
        className="text-muted hover:text-danger opacity-0 transition-all group-hover:opacity-100"
      >
        <FiTrash2 className="size-4" />
      </button>
    </div>
  );
}
