import { AddHabit } from "./components/AddHabit";
import { Filters } from "./components/Filters";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HabitList } from "./components/HabitList";
import { HabitsProvider } from "./state/HabitsProvider";

// Component tree:
//
//   HabitsProvider  (holds the state: useReducer + Context)
//   ├── Header      (reads: progress)
//   └── main
//       ├── AddHabit   (dispatches: added)
//       ├── Filters    (reads filter, dispatches: filter_changed)
//       ├── HabitList  (reads: visible habits)
//       │   └── HabitItem (dispatches: toggled, edited, deleted)
//       └── Footer     (reads progress, dispatches: cleared_done, reset)
//
// No props carry state between them: Header and HabitItem are far apart, but ticking a habit in
// HabitItem updates the Header's progress bar because both use the same Context.
export default function App() {
  return (
    <HabitsProvider>
      <div className="app">
        <Header />
        <main>
          <AddHabit />
          <Filters />
          <HabitList />
          <Footer />
        </main>
      </div>
    </HabitsProvider>
  );
}
