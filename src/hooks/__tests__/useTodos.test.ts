import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTodos } from "@/hooks/useTodos";

describe("useTodos", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with empty todos", () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it("loads todos from localStorage on mount", () => {
    const existing = [
      {
        id: "test-1",
        title: "Existing todo",
        description: "",
        priority: "medium",
        dueDate: null,
        status: "pending",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    localStorage.setItem("todo-manager-todos", JSON.stringify(existing));

    const { result } = renderHook(() => useTodos());

    // After useEffect runs, todos should be loaded
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe("Existing todo");
  });

  describe("addTodo", () => {
    it("adds a todo with defaults", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo({ title: "New todo" });
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].title).toBe("New todo");
      expect(result.current.todos[0].priority).toBe("medium");
      expect(result.current.todos[0].status).toBe("pending");
      expect(result.current.todos[0].description).toBe("");
      expect(result.current.todos[0].dueDate).toBeNull();
      expect(result.current.todos[0].id).toBeTruthy();
      expect(result.current.todos[0].createdAt).toBeTruthy();
    });

    it("adds a todo with all fields", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo({
          title: "Full todo",
          description: "Details here",
          priority: "high",
          dueDate: "2026-03-01",
        });
      });

      expect(result.current.todos[0].title).toBe("Full todo");
      expect(result.current.todos[0].description).toBe("Details here");
      expect(result.current.todos[0].priority).toBe("high");
      expect(result.current.todos[0].dueDate).toBe("2026-03-01");
    });

    it("generates unique IDs", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo({ title: "First" });
        result.current.addTodo({ title: "Second" });
      });

      const ids = result.current.todos.map((t) => t.id);
      expect(new Set(ids).size).toBe(2);
    });

    it("prepends new todos (newest first)", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo({ title: "First" });
      });
      act(() => {
        result.current.addTodo({ title: "Second" });
      });

      expect(result.current.todos[0].title).toBe("Second");
      expect(result.current.todos[1].title).toBe("First");
    });
  });

  describe("updateTodo", () => {
    it("updates a todo by ID", () => {
      const { result } = renderHook(() => useTodos());

      let id: string;
      act(() => {
        const todo = result.current.addTodo({ title: "Original" });
        id = todo.id;
      });

      act(() => {
        result.current.updateTodo(id!, { title: "Updated" });
      });

      expect(result.current.todos[0].title).toBe("Updated");
    });

    it("updates only specified fields", () => {
      const { result } = renderHook(() => useTodos());

      let id: string;
      act(() => {
        const todo = result.current.addTodo({
          title: "Original",
          priority: "low",
        });
        id = todo.id;
      });

      act(() => {
        result.current.updateTodo(id!, { priority: "high" });
      });

      expect(result.current.todos[0].title).toBe("Original");
      expect(result.current.todos[0].priority).toBe("high");
    });
  });

  describe("deleteTodo", () => {
    it("removes a todo by ID", () => {
      const { result } = renderHook(() => useTodos());

      let id: string;
      act(() => {
        const todo = result.current.addTodo({ title: "To delete" });
        id = todo.id;
      });

      expect(result.current.todos).toHaveLength(1);

      act(() => {
        result.current.deleteTodo(id!);
      });

      expect(result.current.todos).toHaveLength(0);
    });
  });

  describe("deleteTodos", () => {
    it("removes multiple todos by IDs", () => {
      const { result } = renderHook(() => useTodos());

      const ids: string[] = [];
      act(() => {
        ids.push(result.current.addTodo({ title: "A" }).id);
        ids.push(result.current.addTodo({ title: "B" }).id);
        result.current.addTodo({ title: "C" });
      });

      act(() => {
        result.current.deleteTodos([ids[0], ids[1]]);
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].title).toBe("C");
    });
  });

  describe("toggleStatus", () => {
    it("toggles pending to completed", () => {
      const { result } = renderHook(() => useTodos());

      let id: string;
      act(() => {
        const todo = result.current.addTodo({ title: "Toggle me" });
        id = todo.id;
      });

      expect(result.current.todos[0].status).toBe("pending");

      act(() => {
        result.current.toggleStatus(id!);
      });

      expect(result.current.todos[0].status).toBe("completed");
    });

    it("toggles completed back to pending", () => {
      const { result } = renderHook(() => useTodos());

      let id: string;
      act(() => {
        const todo = result.current.addTodo({ title: "Toggle me" });
        id = todo.id;
      });

      act(() => {
        result.current.toggleStatus(id!);
      });
      act(() => {
        result.current.toggleStatus(id!);
      });

      expect(result.current.todos[0].status).toBe("pending");
    });
  });

  describe("filtering", () => {
    it("filters by status", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo({ title: "Pending" });
        const todo = result.current.addTodo({ title: "Done" });
        result.current.toggleStatus(todo.id);
      });

      act(() => {
        result.current.setStatusFilter("pending");
      });

      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].title).toBe("Pending");
    });

    it("filters by priority", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo({ title: "Low", priority: "low" });
        result.current.addTodo({ title: "High", priority: "high" });
      });

      act(() => {
        result.current.setPriorityFilter("high");
      });

      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].title).toBe("High");
    });

    it("combines status and priority filters", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo({ title: "High Pending", priority: "high" });
        const done = result.current.addTodo({
          title: "High Done",
          priority: "high",
        });
        result.current.toggleStatus(done.id);
        result.current.addTodo({ title: "Low Pending", priority: "low" });
      });

      act(() => {
        result.current.setStatusFilter("pending");
        result.current.setPriorityFilter("high");
      });

      expect(result.current.filteredTodos).toHaveLength(1);
      expect(result.current.filteredTodos[0].title).toBe("High Pending");
    });

    it("shows all when filters are 'all'", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo({ title: "A", priority: "low" });
        result.current.addTodo({ title: "B", priority: "high" });
      });

      expect(result.current.filteredTodos).toHaveLength(2);
    });
  });

  describe("localStorage persistence", () => {
    it("persists todos to localStorage after add", () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo({ title: "Persisted" });
      });

      const raw = localStorage.getItem("todo-manager-todos");
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].title).toBe("Persisted");
    });
  });
});
