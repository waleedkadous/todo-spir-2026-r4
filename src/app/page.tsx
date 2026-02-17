"use client";

import { useTodos } from "@/hooks/useTodos";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoList } from "@/components/TodoList";

export default function Home() {
  const { filteredTodos, isLoaded, addTodo, updateTodo, deleteTodo, toggleStatus } =
    useTodos();

  if (!isLoaded) {
    return (
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Todo Manager</h1>
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo Manager</h1>
      <div className="space-y-6">
        <AddTodoForm onAdd={addTodo} />
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
