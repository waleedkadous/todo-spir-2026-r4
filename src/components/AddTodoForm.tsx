"use client";

import { useState } from "react";
import { AddTodoInput, Priority } from "@/types/todo";

interface AddTodoFormProps {
  onAdd: (input: AddTodoInput) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || null,
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Todo title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Todo description"
        />
        <div className="flex gap-3 items-center flex-wrap">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="border rounded px-3 py-2 text-sm"
            aria-label="Priority"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
            aria-label="Due date"
          />
          <button
            type="submit"
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Todo
          </button>
        </div>
      </div>
    </form>
  );
}
