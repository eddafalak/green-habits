import type { Filter } from "../state/habits";
import { useHabits, useHabitsDispatch } from "../state/HabitsContext";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "To do" },
  { value: "done", label: "Done" },
];

/** Which habits to show. The filter is part of the global state too. */
export function Filters() {
  const { filter, habits } = useHabits();
  const dispatch = useHabitsDispatch();
  const count = (f: Filter) => (f === "all" ? habits.length : habits.filter((h) => (f === "done" ? h.done : !h.done)).length);

  return (
    <div className="filters" role="group" aria-label="Show">
      {filters.map((f) => (
        <button
          key={f.value}
          type="button"
          aria-pressed={filter === f.value}
          onClick={() => dispatch({ type: "filter_changed", filter: f.value })}
        >
          {f.label} <span className="count">{count(f.value)}</span>
        </button>
      ))}
    </div>
  );
}
