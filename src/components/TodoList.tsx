"use client";

import { Todo, UpdateTodoInput } from "@/types/todo";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  totalCount: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoInput) => void;
}

export function TodoList({ todos, totalCount, onToggle, onDelete, onUpdate }: TodoListProps) {
  if (todos.length === 0) {
    const isFiltered = totalCount > 0;
    return (
      <div className="text-center py-12 text-gray-500" data-testid="empty-state">
        {isFiltered ? (
          <>
            <p className="text-lg">No todos match the current filters</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </>
        ) : (
          <>
            <p className="text-lg">No todos yet</p>
            <p className="text-sm mt-1">Add your first todo above</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
