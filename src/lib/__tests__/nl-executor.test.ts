import { describe, it, expect, vi } from "vitest";
import { executeNLAction, NLExecutionResult } from "@/lib/nl-executor";
import {
  Todo,
  NLAction,
  AddTodoInput,
  UpdateTodoInput,
  FilterState,
} from "@/types/todo";

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "todo-1",
  title: "Test todo",
  description: "",
  priority: "medium",
  dueDate: null,
  status: "pending",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

function makeCallbacks() {
  const addTodo = vi.fn((input: AddTodoInput) =>
    makeTodo({ id: "new-1", title: input.title, priority: input.priority ?? "medium" })
  );
  const updateTodo = vi.fn();
  const deleteTodos = vi.fn();
  const setFilters = vi.fn();
  const currentFilters: FilterState = { status: "all", priority: "all" };

  return { addTodo, updateTodo, deleteTodos, setFilters, currentFilters };
}

describe("nl-executor", () => {
  describe("add action", () => {
    it("adds a todo with correct fields", () => {
      const callbacks = makeCallbacks();
      const action: NLAction = {
        action: "add",
        title: "Buy groceries",
        priority: "high",
        dueDate: "2026-03-01",
      };

      const result = executeNLAction(action, [], callbacks);

      expect(result.success).toBe(true);
      expect(result.message).toContain("Buy groceries");
      expect(callbacks.addTodo).toHaveBeenCalledWith({
        title: "Buy groceries",
        description: undefined,
        priority: "high",
        dueDate: "2026-03-01",
      });
    });

    it("returns error when title is empty", () => {
      const callbacks = makeCallbacks();
      const action: NLAction = { action: "add", title: "" };

      const result = executeNLAction(action, [], callbacks);

      expect(result.success).toBe(false);
      expect(callbacks.addTodo).not.toHaveBeenCalled();
    });
  });

  describe("update action", () => {
    it("updates specified todos", () => {
      const callbacks = makeCallbacks();
      const todos = [makeTodo({ id: "todo-1" }), makeTodo({ id: "todo-2" })];
      const action: NLAction = {
        action: "update",
        todoIds: ["todo-1"],
        updates: { status: "completed" },
      };

      const result = executeNLAction(action, todos, callbacks);

      expect(result.success).toBe(true);
      expect(callbacks.updateTodo).toHaveBeenCalledWith("todo-1", {
        status: "completed",
      });
      expect(result.todosUpdated).toEqual(["todo-1"]);
    });

    it("returns error when no todo IDs provided", () => {
      const callbacks = makeCallbacks();
      const action: NLAction = {
        action: "update",
        todoIds: [],
        updates: { status: "completed" },
      };

      const result = executeNLAction(action, [], callbacks);

      expect(result.success).toBe(false);
    });

    it("skips invalid todo IDs", () => {
      const callbacks = makeCallbacks();
      const todos = [makeTodo({ id: "todo-1" })];
      const action: NLAction = {
        action: "update",
        todoIds: ["todo-1", "nonexistent"],
        updates: { status: "completed" },
      };

      const result = executeNLAction(action, todos, callbacks);

      expect(result.success).toBe(true);
      expect(callbacks.updateTodo).toHaveBeenCalledTimes(1);
      expect(result.todosUpdated).toEqual(["todo-1"]);
    });
  });

  describe("delete action", () => {
    it("deletes specified todos", () => {
      const callbacks = makeCallbacks();
      const todos = [
        makeTodo({ id: "todo-1" }),
        makeTodo({ id: "todo-2" }),
      ];
      const action: NLAction = {
        action: "delete",
        todoIds: ["todo-1", "todo-2"],
      };

      const result = executeNLAction(action, todos, callbacks);

      expect(result.success).toBe(true);
      expect(callbacks.deleteTodos).toHaveBeenCalledWith(["todo-1", "todo-2"]);
      expect(result.todosDeleted).toEqual(["todo-1", "todo-2"]);
    });

    it("returns error when no todo IDs provided", () => {
      const callbacks = makeCallbacks();
      const action: NLAction = { action: "delete", todoIds: [] };

      const result = executeNLAction(action, [], callbacks);

      expect(result.success).toBe(false);
    });

    it("returns error when all IDs are invalid", () => {
      const callbacks = makeCallbacks();
      const action: NLAction = {
        action: "delete",
        todoIds: ["nonexistent"],
      };

      const result = executeNLAction(action, [], callbacks);

      expect(result.success).toBe(false);
    });
  });

  describe("filter action", () => {
    it("applies status filter", () => {
      const callbacks = makeCallbacks();
      const action: NLAction = {
        action: "filter",
        status: "completed",
        priority: "all",
      };

      const result = executeNLAction(action, [], callbacks);

      expect(result.success).toBe(true);
      expect(callbacks.setFilters).toHaveBeenCalledWith({
        status: "completed",
        priority: "all",
      });
      expect(result.message).toContain("status: completed");
    });

    it("applies priority filter", () => {
      const callbacks = makeCallbacks();
      const action: NLAction = {
        action: "filter",
        priority: "high",
      };

      const result = executeNLAction(action, [], callbacks);

      expect(result.success).toBe(true);
      expect(callbacks.setFilters).toHaveBeenCalledWith({
        status: "all",
        priority: "high",
      });
    });

    it("resets to all when no filters specified", () => {
      const callbacks = makeCallbacks();
      const action: NLAction = {
        action: "filter",
        status: "all",
        priority: "all",
      };

      const result = executeNLAction(action, [], callbacks);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Showing all todos");
    });
  });

  describe("error action", () => {
    it("returns error message from Gemini", () => {
      const callbacks = makeCallbacks();
      const action: NLAction = {
        action: "error",
        message: "I couldn't understand your request.",
      };

      const result = executeNLAction(action, [], callbacks);

      expect(result.success).toBe(false);
      expect(result.message).toBe("I couldn't understand your request.");
    });
  });
});
