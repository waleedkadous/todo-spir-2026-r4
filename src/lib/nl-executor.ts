import {
  Todo,
  NLAction,
  NLAddAction,
  NLUpdateAction,
  NLDeleteAction,
  NLFilterAction,
  AddTodoInput,
  UpdateTodoInput,
  FilterState,
} from "@/types/todo";

export interface NLExecutionResult {
  success: boolean;
  message: string;
  todosAdded?: Todo[];
  todosUpdated?: string[];
  todosDeleted?: string[];
  filtersApplied?: Partial<FilterState>;
}

export function executeNLAction(
  action: NLAction,
  todos: Todo[],
  callbacks: {
    addTodo: (input: AddTodoInput) => Todo;
    updateTodo: (id: string, updates: UpdateTodoInput) => void;
    deleteTodos: (ids: string[]) => void;
    setFilters: (filters: FilterState) => void;
    currentFilters: FilterState;
  }
): NLExecutionResult {
  switch (action.action) {
    case "add":
      return executeAdd(action, callbacks.addTodo);
    case "update":
      return executeUpdate(action, todos, callbacks.updateTodo);
    case "delete":
      return executeDelete(action, todos, callbacks.deleteTodos);
    case "filter":
      return executeFilter(action, callbacks.setFilters, callbacks.currentFilters);
    case "error":
      return { success: false, message: action.message };
  }
}

function executeAdd(
  action: NLAddAction,
  addTodo: (input: AddTodoInput) => Todo
): NLExecutionResult {
  if (!action.title) {
    return { success: false, message: "Cannot add a todo without a title." };
  }

  const todo = addTodo({
    title: action.title,
    description: action.description,
    priority: action.priority,
    dueDate: action.dueDate,
  });

  return {
    success: true,
    message: `Added "${todo.title}"`,
    todosAdded: [todo],
  };
}

function executeUpdate(
  action: NLUpdateAction,
  todos: Todo[],
  updateTodo: (id: string, updates: UpdateTodoInput) => void
): NLExecutionResult {
  if (!action.todoIds || action.todoIds.length === 0) {
    return { success: false, message: "No todos specified for update." };
  }

  if (!action.updates || typeof action.updates !== "object") {
    return { success: false, message: "No update fields specified." };
  }

  const validIds = action.todoIds.filter((id) =>
    todos.some((t) => t.id === id)
  );

  if (validIds.length === 0) {
    return { success: false, message: "None of the specified todos were found." };
  }

  for (const id of validIds) {
    updateTodo(id, action.updates);
  }

  return {
    success: true,
    message: `Updated ${validIds.length} todo${validIds.length > 1 ? "s" : ""}`,
    todosUpdated: validIds,
  };
}

function executeDelete(
  action: NLDeleteAction,
  todos: Todo[],
  deleteTodos: (ids: string[]) => void
): NLExecutionResult {
  if (!action.todoIds || action.todoIds.length === 0) {
    return { success: false, message: "No todos specified for deletion." };
  }

  const validIds = action.todoIds.filter((id) =>
    todos.some((t) => t.id === id)
  );

  if (validIds.length === 0) {
    return { success: false, message: "None of the specified todos were found." };
  }

  deleteTodos(validIds);

  return {
    success: true,
    message: `Deleted ${validIds.length} todo${validIds.length > 1 ? "s" : ""}`,
    todosDeleted: validIds,
  };
}

const VALID_STATUSES = ["all", "pending", "completed"];
const VALID_PRIORITIES = ["all", "low", "medium", "high"];

function executeFilter(
  action: NLFilterAction,
  setFilters: (filters: FilterState) => void,
  currentFilters: FilterState
): NLExecutionResult {
  const status = VALID_STATUSES.includes(action.status ?? "")
    ? action.status!
    : currentFilters.status;
  const priority = VALID_PRIORITIES.includes(action.priority ?? "")
    ? action.priority!
    : currentFilters.priority;

  const newFilters: FilterState = {
    status: status as FilterState["status"],
    priority: priority as FilterState["priority"],
  };

  setFilters(newFilters);

  const parts: string[] = [];
  if (newFilters.status !== "all") parts.push(`status: ${newFilters.status}`);
  if (newFilters.priority !== "all") parts.push(`priority: ${newFilters.priority}`);

  return {
    success: true,
    message:
      parts.length > 0
        ? `Filtering by ${parts.join(", ")}`
        : "Showing all todos",
    filtersApplied: newFilters,
  };
}
