import { useState, type FormEvent } from "react";
import { categories, type Category, type Habit } from "../state/habits";
import { useHabitsDispatch } from "../state/HabitsContext";

/** One habit. Update (tick off, edit) and Delete happen here by dispatching actions. */
export function HabitItem({ habit }: { habit: Habit }) {
  const dispatch = useHabitsDispatch();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(habit.text);
  const [category, setCategory] = useState<Category>(habit.category);

  function save(event: FormEvent) {
    event.preventDefault();
    dispatch({ type: "edited", id: habit.id, text, category });
    setEditing(false);
  }

  function startEditing() {
    setText(habit.text);
    setCategory(habit.category);
    setEditing(true);
  }

  if (editing) {
    return (
      <li className="item editing">
        <form onSubmit={save} className="edit-form">
          <label htmlFor={`edit-${habit.id}`} className="sr-only">
            Habit
          </label>
          <input id={`edit-${habit.id}`} value={text} onChange={(e) => setText(e.target.value)} autoFocus maxLength={120} />
          <label htmlFor={`edit-cat-${habit.id}`} className="sr-only">
            Category
          </label>
          <select id={`edit-cat-${habit.id}`} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button type="submit" disabled={!text.trim()}>
            Save
          </button>
          <button type="button" className="ghost" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className={`item ${habit.done ? "done" : ""}`}>
      <label className="check">
        <input type="checkbox" checked={habit.done} onChange={() => dispatch({ type: "toggled", id: habit.id })} />
        <span className="text">{habit.text}</span>
      </label>
      <span className={`tag tag-${habit.category.toLowerCase()}`}>{habit.category}</span>
      <div className="actions">
        <button type="button" className="ghost" onClick={startEditing} aria-label={`Edit “${habit.text}”`}>
          Edit
        </button>
        <button
          type="button"
          className="ghost danger"
          onClick={() => dispatch({ type: "deleted", id: habit.id })}
          aria-label={`Delete “${habit.text}”`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
