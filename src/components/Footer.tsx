import { progress } from "../state/habits";
import { useHabits, useHabitsDispatch } from "../state/HabitsContext";

/** Bulk actions, far away from the list in the component tree but working on the same state. */
export function Footer() {
  const { done } = progress(useHabits());
  const dispatch = useHabitsDispatch();

  return (
    <footer className="footer">
      <button type="button" className="ghost" disabled={done === 0} onClick={() => dispatch({ type: "cleared_done" })}>
        Clear done ({done})
      </button>
      <button type="button" className="ghost" onClick={() => dispatch({ type: "reset" })}>
        Reset to examples
      </button>
    </footer>
  );
}
