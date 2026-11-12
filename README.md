# Green Habits

A small to-do list for eco-friendly habits, made to practise **state management in React**. You can
add habits, tick them off, edit, delete and filter them, and a progress bar at the top keeps count.
All the state lives in one place, managed with **React Context** and a **reducer** (`useReducer`).
It's part of the EcoBytes series, with the same colours as the
[EcoBytes website](https://ecobytes-three.vercel.app).

- **Live:** https://green-habits.vercel.app
- **Code:** https://github.com/eddafalak/green-habits

## Features (CRUD)

| | What you can do | Action dispatched |
| --- | --- | --- |
| **Create** | Add a habit with a category (Energy, Waste, Transport, Food) | `added` |
| **Read** | See all habits, or filter by To do / Done | `filter_changed` |
| **Update** | Tick a habit off (or untick it); edit its text and category | `toggled`, `edited` |
| **Delete** | Delete a habit; clear all done habits; reset to the examples | `deleted`, `cleared_done`, `reset` |

Habits are saved in the browser (`localStorage`), so they're still there after a reload.

## The problem it solves

With `useState`, state belongs to one component. To use it somewhere else you pass it down as
props or lift it up to a shared parent. In a big component tree that gets messy, because the state
has to travel through components that don't need it ("prop drilling").

In this app, the **progress bar in `Header`** has to update when you tick a box in **`HabitItem`**,
which sits on a completely different branch of the tree:

```
HabitsProvider        ← holds the state (useReducer) and shares it (Context)
├── Header            ← reads: progress           ┐
└── main                                          │ no props between these:
    ├── AddHabit      ← dispatches: added          │ both talk to the Context
    ├── Filters       ← reads filter, dispatches   │
    ├── HabitList     ← reads: visible habits      │
    │   └── HabitItem ← dispatches: toggled ───────┘
    └── Footer        ← dispatches: cleared_done, reset
```

No state is passed as props. Every component gets what it needs from the Context, so ticking a
habit in `HabitItem` updates `Header`, `Filters` (the counts) and `Footer` ("Clear done (2)") at
the same time.

## How it works

### 1. The reducer: `src/state/habits.ts`

The state is one object, `{ habits, filter }`. The **reducer** is a pure function that takes the
current state and an **action** and returns the new state. It never changes the old state; it
returns a new object.

```ts
export function habitsReducer(state: HabitsState, action: HabitsAction): HabitsState {
  switch (action.type) {
    case "toggled":
      return {
        ...state,
        habits: state.habits.map((h) => (h.id === action.id ? { ...h, done: !h.done } : h)),
      };
    // added, edited, deleted, cleared_done, filter_changed, reset …
  }
}
```

Actions are typed with TypeScript (`HabitsAction`), so you can't dispatch an action that doesn't
exist or forget the data it needs. The file also has **selectors**, small functions that compute
values from the state, like `progress()` and `visibleHabits()`.

### 2. The Context: `src/state/HabitsContext.ts` and `HabitsProvider.tsx`

`HabitsProvider` creates the state with `useReducer` and shares it through **two contexts**: one
for the state and one for `dispatch`. Splitting them means components that only change things,
like the Add form, don't re-render whenever the list changes. It also saves the state to
`localStorage` whenever it changes.

```tsx
const [state, dispatch] = useReducer(habitsReducer, undefined, loadState);

return (
  <HabitsStateContext value={state}>
    <HabitsDispatchContext value={dispatch}>{children}</HabitsDispatchContext>
  </HabitsStateContext>
);
```

Two custom hooks make it easy to use: `useHabits()` to read the state and `useHabitsDispatch()`
to send actions.

### 3. Dispatching actions and using the state in the UI

```tsx
// HabitItem.tsx: dispatch an action
const dispatch = useHabitsDispatch();
<input type="checkbox" checked={habit.done} onChange={() => dispatch({ type: "toggled", id: habit.id })} />

// Header.tsx: use the state in the UI
const { done, total, percent } = progress(useHabits());
<span>{done} of {total} done</span>
```

## Project structure

```
src/
├── state/
│   ├── habits.ts           Types, actions, reducer, selectors, starting habits
│   ├── habits.test.ts      Tests for the reducer and selectors (Vitest)
│   ├── HabitsContext.ts    The two contexts + useHabits / useHabitsDispatch hooks
│   └── HabitsProvider.tsx  useReducer, Context provider, saving to localStorage
├── components/
│   ├── Header.tsx          Title and progress bar
│   ├── AddHabit.tsx        Form to add a habit
│   ├── Filters.tsx         All / To do / Done
│   ├── HabitList.tsx       The list (or an empty message)
│   ├── HabitItem.tsx       One habit: tick, edit, delete
│   └── Footer.tsx          Clear done, reset
├── App.tsx                 Puts it together inside <HabitsProvider>
└── index.css               Styles
```

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm test` | Run the reducer tests |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Check the code |

## Built with

React 19, TypeScript, Vite and Vitest. There's no state management library: React Context and
`useReducer` are built into React. Redux works the same way (a store, actions, a reducer and
dispatch), so this is a good stepping stone.

## Accessibility

- Every input has a label.
- Buttons say what they do ("Delete 'Compost food scraps'").
- The filter buttons use `aria-pressed`, and the progress bar is a `progressbar` with its value.
- You can use the whole app with the keyboard, and the focus outline is always visible.
