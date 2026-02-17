"use client";

import { useState } from "react";
import { Todo, Priority, UpdateTodoInput } from "@/types/todo";

const priorityColors: Record<Priority, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoInput) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? "");

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      dueDate: editDueDate || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate ?? "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 bg-white shadow-sm" data-testid="todo-item-edit">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            aria-label="Edit title"
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Description (optional)"
            aria-label="Edit description"
          />
          <div className="flex gap-3">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="border rounded px-3 py-2 text-sm"
              aria-label="Edit priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
              aria-label="Edit due date"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg p-4 bg-white shadow-sm ${
        todo.status === "completed" ? "opacity-60" : ""
      }`}
      data-testid="todo-item"
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.status === "completed"}
          onChange={() => onToggle(todo.id)}
          className="mt-1 h-4 w-4 rounded"
          aria-label={`Mark "${todo.title}" as ${
            todo.status === "completed" ? "pending" : "completed"
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-medium ${
                todo.status === "completed" ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {todo.title}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                priorityColors[todo.priority]
              }`}
              data-testid="priority-badge"
            >
              {todo.priority}
            </span>
          </div>
          {todo.description && (
            <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
          )}
          {todo.dueDate && (
            <p className="text-xs text-gray-400 mt-1" data-testid="due-date">
              Due: {todo.dueDate}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-gray-400 hover:text-blue-600 text-sm"
            aria-label={`Edit "${todo.title}"`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-2 py-1 text-gray-400 hover:text-red-600 text-sm"
            aria-label={`Delete "${todo.title}"`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
