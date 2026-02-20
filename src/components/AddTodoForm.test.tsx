import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddTodoForm } from "./AddTodoForm";

describe("AddTodoForm", () => {
  it("renders the form with input fields", () => {
    render(<AddTodoForm onAdd={vi.fn()} />);
    expect(screen.getByLabelText("Todo title")).toBeInTheDocument();
    expect(screen.getByLabelText("Todo description")).toBeInTheDocument();
    expect(screen.getByLabelText("Priority")).toBeInTheDocument();
    expect(screen.getByLabelText("Due date")).toBeInTheDocument();
    expect(screen.getByText("Add Todo")).toBeInTheDocument();
  });

  it("calls onAdd with correct data on submit", () => {
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "Buy groceries" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "high" },
    });
    fireEvent.change(screen.getByLabelText("Due date"), {
      target: { value: "2026-03-01" },
    });
    fireEvent.click(screen.getByText("Add Todo"));

    expect(onAdd).toHaveBeenCalledWith({
      title: "Buy groceries",
      description: undefined,
      priority: "high",
      dueDate: "2026-03-01",
    });
  });

  it("does not submit when title is empty", () => {
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);
    fireEvent.click(screen.getByText("Add Todo"));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("clears form after successful submit", () => {
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "Test" },
    });
    fireEvent.click(screen.getByText("Add Todo"));

    expect(screen.getByLabelText("Todo title")).toHaveValue("");
  });

  it("trims whitespace from title", () => {
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "  Buy milk  " },
    });
    fireEvent.click(screen.getByText("Add Todo"));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Buy milk" })
    );
  });

  it("defaults to medium priority", () => {
    render(<AddTodoForm onAdd={vi.fn()} />);
    expect(screen.getByLabelText("Priority")).toHaveValue("medium");
  });

  it("submits with description when provided", () => {
    const onAdd = vi.fn();
    render(<AddTodoForm onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText("Todo title"), {
      target: { value: "Task" },
    });
    fireEvent.change(screen.getByLabelText("Todo description"), {
      target: { value: "Some details" },
    });
    fireEvent.click(screen.getByText("Add Todo"));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ description: "Some details" })
    );
  });
});
