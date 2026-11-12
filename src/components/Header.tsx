import { progress } from "../state/habits";
import { useHabits } from "../state/HabitsContext";

/**
 * The progress bar at the top. It gets no props: it reads the state from Context, so ticking a
 * habit far down in <HabitItem> updates it straight away.
 */
export function Header() {
  const { done, total, percent } = progress(useHabits());

  return (
    <header className="header">
      <p className="kicker">EcoBytes</p>
      <h1>Green Habits</h1>
      <p className="lead">Small everyday changes that add up. Tick them off as you go.</p>
      <div className="progress" aria-label={`${done} of ${total} habits done`}>
        <div className="progress-text">
          <span>
            <strong>{done}</strong> of {total} done
          </span>
          <span>{percent}%</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </header>
  );
}
