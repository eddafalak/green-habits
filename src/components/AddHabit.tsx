import { useState, type FormEvent } from "react";
import { categories, type Category } from "../state/habits";
import { useHabitsDispatch } from "../state/HabitsContext";

/** Create: a form that dispatches an "added" action. */
export function AddHabit() {
  const dispatch = useHabitsDispatch();
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>("Energy");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: "added", id: crypto.randomUUID(), text, category, createdAt: Date.now() });
    setText("");
  }

  return (
    <form className="add" onSubmit={handleSubmit}>
      <label htmlFor="new-habit" className="sr-only">
        New habit
      </label>
      <input
        id="new-habit"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a green habit, e.g. “Air-dry the laundry”"
        maxLength={120}
      />
      <label htmlFor="new-category" className="sr-only">
        Category
      </label>
      <select id="new-category" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <button type="submit" disabled={!text.trim()}>
        Add
      </button>
    </form>
  );
}
