import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterBar } from "./FilterBar";

const defaultProps = {
  filters: { status: "all" as const, priority: "all" as const },
  onStatusChange: vi.fn(),
  onPriorityChange: vi.fn(),
  totalCount: 5,
  filteredCount: 5,
};

describe("FilterBar", () => {
  it("renders status and priority dropdowns", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByLabelText("Filter by status")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by priority")).toBeInTheDocument();
  });

  it("shows total count when no filter applied", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByTestId("filter-count")).toHaveTextContent("5 todos");
  });

  it("shows filtered count when filter reduces results", () => {
    render(<FilterBar {...defaultProps} filteredCount={2} />);
    expect(screen.getByTestId("filter-count")).toHaveTextContent("2 of 5");
  });

  it("shows singular 'todo' for count of 1", () => {
    render(<FilterBar {...defaultProps} totalCount={1} filteredCount={1} />);
    expect(screen.getByTestId("filter-count")).toHaveTextContent("1 todo");
  });

  it("calls onStatusChange when status filter changes", () => {
    const onStatusChange = vi.fn();
    render(<FilterBar {...defaultProps} onStatusChange={onStatusChange} />);
    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "pending" },
    });
    expect(onStatusChange).toHaveBeenCalledWith("pending");
  });

  it("calls onPriorityChange when priority filter changes", () => {
    const onPriorityChange = vi.fn();
    render(<FilterBar {...defaultProps} onPriorityChange={onPriorityChange} />);
    fireEvent.change(screen.getByLabelText("Filter by priority"), {
      target: { value: "high" },
    });
    expect(onPriorityChange).toHaveBeenCalledWith("high");
  });

  it("reflects current filter state in dropdowns", () => {
    render(
      <FilterBar
        {...defaultProps}
        filters={{ status: "completed", priority: "high" }}
      />
    );
    expect(screen.getByLabelText("Filter by status")).toHaveValue("completed");
    expect(screen.getByLabelText("Filter by priority")).toHaveValue("high");
  });
});
