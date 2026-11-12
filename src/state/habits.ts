// The whole app's state, and the reducer that changes it.
//
// A reducer is a pure function: (current state, action) => new state. Components never change
// state directly; they *dispatch* an action describing what happened ("habit added", "habit
// toggled"…) and the reducer works out the new state. That keeps every change in one place, easy
// to follow and easy to test (see habits.test.ts).

export const categories = ["Energy", "Waste", "Transport", "Food"] as const;
export type Category = (typeof categories)[number];

export type Habit = {
  id: string;
  text: string;
  category: Category;
  done: boolean;
  createdAt: number;
};

export type Filter = "all" | "active" | "done";

export type HabitsState = {
  habits: Habit[];
  filter: Filter;
};

/** Every change the app can make. Each action has a `type` and the data it needs. */
export type HabitsAction =
  | { type: "added"; id: string; text: string; category: Category; createdAt: number }
  | { type: "toggled"; id: string }
  | { type: "edited"; id: string; text: string; category: Category }
  | { type: "deleted"; id: string }
  | { type: "cleared_done" }
  | { type: "filter_changed"; filter: Filter }
  | { type: "reset" };

/** Starting habits, so the list isn't empty the first time you open the app. */
export const initialState: HabitsState = {
  filter: "all",
  habits: [
    { id: "seed-1", text: "Switch off devices at the wall at night", category: "Energy", done: false, createdAt: 1 },
    { id: "seed-2", text: "Take a reusable bottle to school", category: "Waste", done: true, createdAt: 2 },
    { id: "seed-3", text: "Cycle or walk for short trips", category: "Transport", done: false, createdAt: 3 },
    { id: "seed-4", text: "Have one meat-free day a week", category: "Food", done: false, createdAt: 4 },
  ],
};

export function habitsReducer(state: HabitsState, action: HabitsAction): HabitsState {
  switch (action.type) {
    case "added": {
      const text = action.text.trim();
      if (!text) return state;
      const habit: Habit = { id: action.id, text, category: action.category, done: false, createdAt: action.createdAt };
      return { ...state, habits: [habit, ...state.habits] };
    }
    case "toggled":
      return {
        ...state,
        habits: state.habits.map((h) => (h.id === action.id ? { ...h, done: !h.done } : h)),
      };
    case "edited": {
      const text = action.text.trim();
      if (!text) return state;
      return {
        ...state,
        habits: state.habits.map((h) => (h.id === action.id ? { ...h, text, category: action.category } : h)),
      };
    }
    case "deleted":
      return { ...state, habits: state.habits.filter((h) => h.id !== action.id) };
    case "cleared_done":
      return { ...state, habits: state.habits.filter((h) => !h.done) };
    case "filter_changed":
      return { ...state, filter: action.filter };
    case "reset":
      return initialState;
  }
}

// Selectors: small functions that read something from the state.
export const visibleHabits = (state: HabitsState) =>
  state.habits.filter((h) => (state.filter === "all" ? true : state.filter === "done" ? h.done : !h.done));

export const progress = (state: HabitsState) => {
  const total = state.habits.length;
  const done = state.habits.filter((h) => h.done).length;
  return { total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
};
