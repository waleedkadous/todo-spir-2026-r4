"use client";

import { useState, useRef, useCallback } from "react";
import {
  Todo,
  NLAction,
  AddTodoInput,
  UpdateTodoInput,
  FilterState,
} from "@/types/todo";
import { executeNLAction, NLExecutionResult } from "@/lib/nl-executor";

interface NLInputProps {
  todos: Todo[];
  filters: FilterState;
  addTodo: (input: AddTodoInput) => Todo;
  updateTodo: (id: string, updates: UpdateTodoInput) => void;
  deleteTodos: (ids: string[]) => void;
  setFilters: (filters: FilterState) => void;
  onResult: (result: NLExecutionResult) => void;
  onError: (message: string) => void;
}

export function NLInput({
  todos,
  filters,
  addTodo,
  updateTodo,
  deleteTodos,
  setFilters,
  onResult,
  onError,
}: NLInputProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const lastSubmitTime = useRef(0);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      // Debounce: prevent double-submit within 300ms
      const now = Date.now();
      if (now - lastSubmitTime.current < 300) return;
      lastSubmitTime.current = now;

      setIsLoading(true);
      setLastResult(null);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: input.trim(),
            todos,
            currentDate: new Date().toISOString().split("T")[0],
          }),
        });

        if (response.status === 503) {
          onError("AI assistant unavailable — configure GEMINI_API_KEY to enable");
          return;
        }

        if (response.status === 504) {
          onError("Request timed out. Please try again.");
          return;
        }

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          onError(data.error ?? "Something went wrong. Please try again.");
          return;
        }

        const data = await response.json();

        if (!data.action) {
          onError("Invalid response from AI assistant.");
          return;
        }

        const action: NLAction = data.action;
        const result = executeNLAction(action, todos, {
          addTodo,
          updateTodo,
          deleteTodos,
          setFilters,
          currentFilters: filters,
        });

        setLastResult(result.message);
        onResult(result);
        setInput("");
      } catch {
        onError("Failed to connect to AI assistant. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, todos, filters, addTodo, updateTodo, deleteTodos, setFilters, onResult, onError]
  );

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Try "Add a high priority todo to buy groceries" or "Show me completed todos"'
          className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
          aria-label="Natural language input"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {isLoading ? "Thinking..." : "Ask AI"}
        </button>
      </form>
      {lastResult && (
        <p className="mt-2 text-sm text-purple-700" data-testid="nl-result">
          {lastResult}
        </p>
      )}
    </div>
  );
}
