"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Todo,
  AddTodoInput,
  UpdateTodoInput,
  FilterState,
  Priority,
  Status,
} from "@/types/todo";
import { loadTodos, saveTodos } from "@/lib/storage";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    priority: "all",
  });

  // Load from localStorage on mount (avoids hydration mismatch)
  useEffect(() => {
    setTodos(loadTodos());
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever todos change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveTodos(todos);
    }
  }, [todos, isLoaded]);

  const addTodo = useCallback((input: AddTodoInput) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? "",
      priority: input.priority ?? "medium",
      dueDate: input.dueDate ?? null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    return newTodo;
  }, []);

  const updateTodo = useCallback((id: string, updates: UpdateTodoInput) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const deleteTodos = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setTodos((prev) => prev.filter((todo) => !idSet.has(todo.id)));
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: todo.status === "pending" ? "completed" : "pending",
            }
          : todo
      )
    );
  }, []);

  const setStatusFilter = useCallback((status: Status | "all") => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setPriorityFilter = useCallback((priority: Priority | "all") => {
    setFilters((prev) => ({ ...prev, priority }));
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filters.status !== "all" && todo.status !== filters.status)
        return false;
      if (filters.priority !== "all" && todo.priority !== filters.priority)
        return false;
      return true;
    });
  }, [todos, filters]);

  return {
    todos,
    filteredTodos,
    filters,
    isLoaded,
    addTodo,
    updateTodo,
    deleteTodo,
    deleteTodos,
    toggleStatus,
    setStatusFilter,
    setPriorityFilter,
    setFilters,
  };
}
