import { visibleHabits } from "../state/habits";
import { useHabits } from "../state/HabitsContext";
import { HabitItem } from "./HabitItem";

/** Read: the list of habits, after the filter is applied. */
export function HabitList() {
  const state = useHabits();
  const habits = visibleHabits(state);

  if (habits.length === 0) {
    return (
      <p className="empty">
        {state.filter === "done" ? "Nothing ticked off yet." : state.filter === "active" ? "All done. Nice work! 🌱" : "No habits yet. Add your first one above."}
      </p>
    );
  }

  return (
    <ul className="list">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} />
      ))}
    </ul>
  );
}
