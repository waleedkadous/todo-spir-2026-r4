import { describe, it, expect, beforeEach } from "vitest";
import { loadTodos, saveTodos, clearTodos } from "@/lib/storage";
import { Todo } from "@/types/todo";

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  title: "Test todo",
  description: "",
  priority: "medium",
  dueDate: null,
  status: "pending",
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadTodos", () => {
    it("returns empty array when no data in localStorage", () => {
      expect(loadTodos()).toEqual([]);
    });

    it("returns empty array when localStorage has invalid JSON", () => {
      localStorage.setItem("todo-manager-todos", "not-json");
      expect(loadTodos()).toEqual([]);
    });

    it("returns empty array when localStorage has non-array JSON", () => {
      localStorage.setItem("todo-manager-todos", '{"foo": "bar"}');
      expect(loadTodos()).toEqual([]);
    });

    it("returns todos from localStorage", () => {
      const todos = [makeTodo({ title: "First" }), makeTodo({ title: "Second" })];
      localStorage.setItem("todo-manager-todos", JSON.stringify(todos));
      const loaded = loadTodos();
      expect(loaded).toHaveLength(2);
      expect(loaded[0].title).toBe("First");
      expect(loaded[1].title).toBe("Second");
    });
  });

  describe("saveTodos", () => {
    it("saves todos to localStorage", () => {
      const todos = [makeTodo({ title: "Saved" })];
      saveTodos(todos);
      const raw = localStorage.getItem("todo-manager-todos");
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].title).toBe("Saved");
    });

    it("saves empty array", () => {
      saveTodos([]);
      const raw = localStorage.getItem("todo-manager-todos");
      expect(raw).toBe("[]");
    });
  });

  describe("clearTodos", () => {
    it("removes todos from localStorage", () => {
      saveTodos([makeTodo()]);
      expect(localStorage.getItem("todo-manager-todos")).not.toBeNull();
      clearTodos();
      expect(localStorage.getItem("todo-manager-todos")).toBeNull();
    });
  });
});
