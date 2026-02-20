"use client";

import { Priority, Status, FilterState } from "@/types/todo";

interface FilterBarProps {
  filters: FilterState;
  onStatusChange: (status: Status | "all") => void;
  onPriorityChange: (priority: Priority | "all") => void;
  totalCount: number;
  filteredCount: number;
}

export function FilterBar({
  filters,
  onStatusChange,
  onPriorityChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white border rounded-lg px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <label htmlFor="status-filter" className="text-sm text-gray-600">
          Status:
        </label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value as Status | "all")}
          className="border rounded px-2 py-1 text-sm"
          aria-label="Filter by status"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="priority-filter" className="text-sm text-gray-600">
          Priority:
        </label>
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(e) => onPriorityChange(e.target.value as Priority | "all")}
          className="border rounded px-2 py-1 text-sm"
          aria-label="Filter by priority"
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <span className="text-xs text-gray-400 ml-auto" data-testid="filter-count">
        {filteredCount === totalCount
          ? `${totalCount} todo${totalCount !== 1 ? "s" : ""}`
          : `${filteredCount} of ${totalCount}`}
      </span>
    </div>
  );
}
