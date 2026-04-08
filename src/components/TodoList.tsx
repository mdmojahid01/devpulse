import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useTodos } from "@/hooks/useTodos";
import { Checkbox, Kbd, Tooltip } from "@heroui/react";
import {
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiCircle,
  FiClock,
  FiCornerDownRight,
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
  const formRef = useRef<HTMLDivElement>(null);

  const isMac = useMemo(
    () => globalThis?.navigator?.userAgent.includes("Mac") ?? false,
    [],
  );

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const yesterday = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  }, []);

  // Keyboard shortcut: Cmd+K (Mac) or Ctrl+K (Windows/Linux)
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setShowInput(prev => !prev);
    }
  }, []);

  useEffect(() => {
    globalThis.addEventListener("keydown", handleGlobalKeyDown);
    return () => globalThis.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Scroll form into view when it appears
  useEffect(() => {
    if (showInput && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [showInput]);

  const todayTodos = todos.filter(
    t => t.date === today && !t.completed && !t.parentId,
  );
  const todayCompleted = todos.filter(
    t => t.date === today && t.completed && !t.parentId,
  );
  const previousTodos = todos.filter(
    t => t.date < today && !t.completed && !t.parentId,
  );

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

  const handleAdd = useCallback(async () => {
    if (newTitle.trim()) {
      await addTodo(newTitle.trim(), newDescription.trim() || undefined);
      setNewTitle("");
      setNewDescription("");
    }
  }, [newTitle, newDescription, addTodo]);

  const handleCancel = useCallback(() => {
    setShowInput(false);
    setNewTitle("");
    setNewDescription("");
  }, []);

  const handleClearAll = useCallback(async () => {
    if (
      confirm(
        "Are you sure you want to delete all tasks? This action cannot be undone.",
      )
    ) {
      const allTodoIds = todos.map(t => t.id);
      await Promise.all(allTodoIds.map(id => deleteTodo(id)));
    }
  }, [todos, deleteTodo]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleAdd();
      }
    },
    [handleCancel, handleAdd],
  );

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
      <AppCard className="p-6">
        <AppCard.Header className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">Manage Your Daily Tasks</h2>
          <div className="flex items-center gap-2">
            {todos.length > 0 && (
              <Tooltip>
                <Tooltip.Trigger>
                  <AppButton
                    size="sm"
                    variant="danger"
                    onPress={handleClearAll}
                    prefix={<FiTrash2 className="size-4" />}
                  >
                    Clear All
                  </AppButton>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p className="text-xs">Delete all tasks</p>
                </Tooltip.Content>
              </Tooltip>
            )}
            <AppButton
              size="sm"
              variant="primary"
              onPress={() => setShowInput(true)}
              prefix={<FiPlus className="size-4" />}
              suffix={
                <div className="flex items-center gap-1">
                  <Kbd>
                    <Kbd.Abbr keyValue={isMac ? "command" : "ctrl"} />
                  </Kbd>
                  <Kbd>
                    <Kbd.Content>K</Kbd.Content>
                  </Kbd>
                </div>
              }
            >
              Add Task
            </AppButton>
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
                    todos={todos}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onAddSubtask={addTodo}
                  />
                ))}

                {/* Add New Task */}
                {showInput && (
                  <div
                    ref={formRef}
                    className="border-divider space-y-2 rounded-lg border p-3"
                  >
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
                          prefix={
                            <div className="flex items-center gap-0.5">
                              <Kbd>
                                <Kbd.Abbr
                                  keyValue={isMac ? "command" : "ctrl"}
                                />
                              </Kbd>
                              <Kbd>
                                <Kbd.Abbr keyValue="enter" />
                              </Kbd>
                            </div>
                          }
                        >
                          Add
                        </AppButton>
                        <AppButton
                          size="sm"
                          variant="ghost"
                          onPress={handleCancel}
                          prefix={
                            <Kbd>
                              <Kbd.Abbr keyValue="escape" />
                            </Kbd>
                          }
                        >
                          Cancel
                        </AppButton>
                      </div>
                    </div>
                  </div>
                )}

                {!showInput && todayTodos.length === 0 && (
                  <div className="text-muted flex items-center justify-center py-4 text-sm">
                    No tasks for today. Click "Add Task" to get started!
                  </div>
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
                        todos={todos}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onAddSubtask={addTodo}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Previous Pending Tasks */}
              {previousTodos.length > 0 && (
                <div className="border-divider border-t pt-4">
                  <AppButton
                    variant="ghost"
                    onPress={() => setExpandedPrevious(!expandedPrevious)}
                    suffix={
                      expandedPrevious ? (
                        <FiChevronUp className="size-4" />
                      ) : (
                        <FiChevronDown className="size-4" />
                      )
                    }
                    className="text-muted hover:text-foreground w-full justify-between text-xs font-medium uppercase"
                  >
                    Previous ({previousTodos.length})
                  </AppButton>

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
                                todos={todos}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                                onAddSubtask={addTodo}
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
  todos: Todo[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddSubtask: (
    title: string,
    description?: string,
    date?: string,
    parentId?: string,
  ) => Promise<void>;
  showDate?: boolean;
}

function TodoItem({
  todo,
  todos,
  onToggle,
  onDelete,
  onAddSubtask,
  showDate,
}: Readonly<TodoItemProps>) {
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [expandedSubtasks, setExpandedSubtasks] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const subtasks = useMemo(
    () => todos.filter(t => t.parentId === todo.id),
    [todos, todo.id],
  );
  const hasSubtasks = subtasks.length > 0;

  const handleAddSubtask = useCallback(async () => {
    if (subtaskTitle.trim()) {
      await onAddSubtask(subtaskTitle.trim(), undefined, todo.date, todo.id);
      setSubtaskTitle("");
    }
  }, [subtaskTitle, onAddSubtask, todo.date, todo.id]);

  const handleCancelSubtask = useCallback(() => {
    setShowSubtaskInput(false);
    setSubtaskTitle("");
  }, []);

  const handleSubtaskKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handleAddSubtask();
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleCancelSubtask();
      }
    },
    [handleAddSubtask, handleCancelSubtask],
  );

  return (
    <div className="space-y-1">
      <div
        className="group hover:bg-surface-hover flex w-full items-center gap-2 rounded-lg px-3 transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center">
          <Checkbox
            isSelected={todo.completed}
            onChange={() => onToggle(todo.id)}
            variant={isHovered ? "primary" : "secondary"}
          >
            <Checkbox.Control className="size-4">
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
            <p className="text-muted text-xs">{todo.description}</p>
          )}
          {showDate && (
            <p className="text-muted text-xs">{formatDate(todo.date)}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasSubtasks && (
            <Tooltip>
              <Tooltip.Trigger>
                <AppButton
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  onPress={() => setExpandedSubtasks(!expandedSubtasks)}
                  className="text-muted hover:text-foreground shrink-0"
                  prefix={
                    expandedSubtasks ? (
                      <FiChevronUp className="size-4" />
                    ) : (
                      <FiChevronDown className="size-4" />
                    )
                  }
                />
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p className="text-xs">
                  {expandedSubtasks ? "Collapse subtasks" : "Expand subtasks"}
                </p>
              </Tooltip.Content>
            </Tooltip>
          )}
          <Tooltip>
            <Tooltip.Trigger>
              <AppButton
                variant="ghost"
                size="sm"
                isIconOnly
                onPress={() => setShowSubtaskInput(!showSubtaskInput)}
                className="text-muted hover:text-accent shrink-0 opacity-0 transition-all group-hover:opacity-100"
                prefix={<FiCornerDownRight className="size-4" />}
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p className="text-xs">Add subtask</p>
            </Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Tooltip.Trigger>
              <AppButton
                variant="ghost"
                size="sm"
                isIconOnly
                onPress={() => onDelete(todo.id)}
                className="text-muted hover:text-danger shrink-0 opacity-0 transition-all group-hover:opacity-100"
                prefix={<FiTrash2 className="size-4" />}
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p className="text-xs">Delete task</p>
            </Tooltip.Content>
          </Tooltip>
        </div>
      </div>

      {/* Subtask Input */}
      {showSubtaskInput && (
        <div className="ml-6 flex items-center gap-2 py-1">
          <AppInput
            placeholder="Subtask title"
            ariaLabel="Subtask title"
            value={subtaskTitle}
            onChange={setSubtaskTitle}
            autoFocus
            fullWidth
            onKeyDown={handleSubtaskKeyDown}
          />
          <AppButton size="sm" variant="primary" onPress={handleAddSubtask}>
            Add
          </AppButton>
          <AppButton size="sm" variant="ghost" onPress={handleCancelSubtask}>
            Cancel
          </AppButton>
        </div>
      )}

      {/* Subtasks */}
      {hasSubtasks && expandedSubtasks && (
        <div className="ml-6 space-y-0.5">
          {subtasks.map(subtask => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SubtaskItemProps {
  subtask: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function SubtaskItem({
  subtask,
  onToggle,
  onDelete,
}: Readonly<SubtaskItemProps>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group hover:bg-surface-hover flex w-full items-center gap-2 rounded-lg px-3 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <Checkbox
          isSelected={subtask.completed}
          onChange={() => onToggle(subtask.id)}
          variant={isHovered ? "primary" : "secondary"}
        >
          <Checkbox.Control className="size-3.5">
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-xs ${subtask.completed ? "text-muted line-through" : "text-foreground"}`}
        >
          {subtask.title}
        </p>
      </div>
      <Tooltip>
        <Tooltip.Trigger>
          <AppButton
            variant="ghost"
            size="sm"
            isIconOnly
            onPress={() => onDelete(subtask.id)}
            className="text-muted hover:text-danger shrink-0 opacity-0 transition-all group-hover:opacity-100"
            prefix={<FiTrash2 className="size-3" />}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p className="text-xs">Delete subtask</p>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
