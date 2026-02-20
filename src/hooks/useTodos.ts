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
  const [storageError, setStorageError] = useState<string | null>(null);
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
      const result = saveTodos(todos);
      if (!result.success) {
        setStorageError(result.error ?? "Failed to save todos");
      } else {
        setStorageError(null);
      }
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
    // Strip undefined values to prevent overwriting with undefined
    const cleanUpdates: Partial<Todo> = {};
    if (updates.title !== undefined) cleanUpdates.title = updates.title;
    if (updates.description !== undefined)
      cleanUpdates.description = updates.description;
    if (updates.priority !== undefined) cleanUpdates.priority = updates.priority;
    if (updates.dueDate !== undefined) cleanUpdates.dueDate = updates.dueDate;
    if (updates.status !== undefined) cleanUpdates.status = updates.status;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, ...cleanUpdates } : todo
      )
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
    storageError,
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
