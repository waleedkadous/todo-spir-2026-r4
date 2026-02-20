import { Todo } from "@/types/todo";

const STORAGE_KEY = "todo-manager-todos";

export function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: true };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save todos";
    return { success: false, error: message };
  }
}

export function clearTodos(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
