import type { TaskFilter } from "@/types/api";

const FILTERS: Array<{ label: string; value: TaskFilter }> = [
  { label: "All",         value: "all" },
  { label: "To Do",       value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done",        value: "done" },
];

type StatusFilterProps = {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
};

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <section aria-label="Filter tasks by status" className="card" style={{ padding: "0.85rem 1rem" }}>
      <div className="filter-tabs">
        {FILTERS.map((filter) => {
          const isActive = filter.value === value;

          return (
            <button
              key={filter.value}
              type="button"
              className={`filter-tab${isActive ? " active" : ""}`}
              onClick={() => onChange(filter.value)}
              aria-pressed={isActive}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
