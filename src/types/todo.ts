export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "completed";

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  status: Status;
  createdAt: string;
}

export interface AddTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
  status?: Status;
}

export interface FilterState {
  status: Status | "all";
  priority: Priority | "all";
}

// NL Action types returned by Gemini
export interface NLAddAction {
  action: "add";
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
}

export interface NLUpdateAction {
  action: "update";
  todoIds: string[];
  updates: UpdateTodoInput;
}

export interface NLDeleteAction {
  action: "delete";
  todoIds: string[];
}

export interface NLFilterAction {
  action: "filter";
  status?: Status | "all";
  priority?: Priority | "all";
  searchText?: string;
}

export interface NLErrorAction {
  action: "error";
  message: string;
}

export type NLAction =
  | NLAddAction
  | NLUpdateAction
  | NLDeleteAction
  | NLFilterAction
  | NLErrorAction;
