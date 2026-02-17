"use client";

import { useState, useCallback } from "react";
import { useTodos } from "@/hooks/useTodos";
import { AddTodoForm } from "@/components/AddTodoForm";
import { FilterBar } from "@/components/FilterBar";
import { TodoList } from "@/components/TodoList";
import { NLInput } from "@/components/NLInput";
import { Toast } from "@/components/Toast";

export default function Home() {
  const {
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
  } = useTodos();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleNLResult = useCallback(
    (result: { success: boolean; message: string }) => {
      setToast({
        message: result.message,
        type: result.success ? "success" : "error",
      });
    },
    []
  );

  const handleNLError = useCallback((message: string) => {
    setToast({ message, type: "error" });
  }, []);

  if (!isLoaded) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Todo Manager
        </h1>
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        Todo Manager
      </h1>
      <div className="space-y-4">
        <NLInput
          todos={todos}
          filters={filters}
          addTodo={addTodo}
          updateTodo={updateTodo}
          deleteTodos={deleteTodos}
          setFilters={setFilters}
          onResult={handleNLResult}
          onError={handleNLError}
        />
        <AddTodoForm onAdd={addTodo} />
        <FilterBar
          filters={filters}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          totalCount={todos.length}
          filteredCount={filteredTodos.length}
        />
        <TodoList
          todos={filteredTodos}
          totalCount={todos.length}
          onToggle={toggleStatus}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </main>
  );
}
