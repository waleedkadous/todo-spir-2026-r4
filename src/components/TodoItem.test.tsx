import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";

const baseTodo: Todo = {
  id: "test-1",
  title: "Test todo",
  description: "",
  priority: "medium",
  dueDate: null,
  status: "pending",
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("TodoItem", () => {
  it("renders todo title", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />
    );
    expect(screen.getByText("Test todo")).toBeInTheDocument();
  });

  it("renders priority badge", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />
    );
    const badge = screen.getByTestId("priority-badge");
    expect(badge).toHaveTextContent("medium");
  });

  it("renders high priority badge with correct styling", () => {
    const highTodo = { ...baseTodo, priority: "high" as const };
    render(
      <TodoItem todo={highTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />
    );
    const badge = screen.getByTestId("priority-badge");
    expect(badge).toHaveTextContent("high");
  });

  it("renders due date when set", () => {
    const todoWithDate = { ...baseTodo, dueDate: "2026-03-01" };
    render(
      <TodoItem
        todo={todoWithDate}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    );
    expect(screen.getByTestId("due-date")).toHaveTextContent("2026-03-01");
  });

  it("does not render due date when null", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />
    );
    expect(screen.queryByTestId("due-date")).not.toBeInTheDocument();
  });

  it("calls onToggle when checkbox clicked", () => {
    const onToggle = vi.fn();
    render(
      <TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} onUpdate={vi.fn()} />
    );
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith("test-1");
  });

  it("calls onDelete when delete button clicked", () => {
    const onDelete = vi.fn();
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} onUpdate={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText('Delete "Test todo"'));
    expect(onDelete).toHaveBeenCalledWith("test-1");
  });

  it("shows completed styling when status is completed", () => {
    const completedTodo = { ...baseTodo, status: "completed" as const };
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("enters edit mode when edit button clicked", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText('Edit "Test todo"'));
    expect(screen.getByTestId("todo-item-edit")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit title")).toHaveValue("Test todo");
  });

  it("saves edits and calls onUpdate", () => {
    const onUpdate = vi.fn();
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={onUpdate} />
    );
    fireEvent.click(screen.getByLabelText('Edit "Test todo"'));
    fireEvent.change(screen.getByLabelText("Edit title"), {
      target: { value: "Updated title" },
    });
    fireEvent.click(screen.getByText("Save"));
    expect(onUpdate).toHaveBeenCalledWith("test-1", {
      title: "Updated title",
      description: "",
      priority: "medium",
      dueDate: null,
    });
  });

  it("cancels edit and reverts to display mode", () => {
    render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText('Edit "Test todo"'));
    fireEvent.change(screen.getByLabelText("Edit title"), {
      target: { value: "Changed" },
    });
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.getByTestId("todo-item")).toBeInTheDocument();
    expect(screen.getByText("Test todo")).toBeInTheDocument();
  });

  it("renders description when present", () => {
    const todoWithDesc = { ...baseTodo, description: "Some details" };
    render(
      <TodoItem
        todo={todoWithDesc}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    );
    expect(screen.getByText("Some details")).toBeInTheDocument();
  });
});
