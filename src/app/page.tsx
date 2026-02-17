"use client";

import { useTodos } from "@/hooks/useTodos";
import { AddTodoForm } from "@/components/AddTodoForm";
import { FilterBar } from "@/components/FilterBar";
import { TodoList } from "@/components/TodoList";

export default function Home() {
  const {
    todos,
    filteredTodos,
    filters,
    isLoaded,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleStatus,
    setStatusFilter,
    setPriorityFilter,
  } = useTodos();

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
          onToggle={toggleStatus}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      </div>
    </main>
  );
}
