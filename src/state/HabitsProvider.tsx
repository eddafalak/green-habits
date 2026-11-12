import { useEffect, useReducer, type ReactNode } from "react";
import { habitsReducer, initialState, type HabitsState } from "./habits";
import { HabitsDispatchContext, HabitsStateContext } from "./HabitsContext";

const storageKey = "green-habits";

/** Reads saved habits from the browser, or uses the starting habits. */
function loadState(): HabitsState {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? (JSON.parse(saved) as HabitsState) : initialState;
  } catch {
    return initialState;
  }
}

/** Wraps the app and makes the habits available to every component below it. */
export function HabitsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(habitsReducer, undefined, loadState);

  // Save to the browser whenever the state changes, so habits survive a page reload.
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (e.g. private browsing); the app still works without it.
    }
  }, [state]);

  return (
    <HabitsStateContext value={state}>
      <HabitsDispatchContext value={dispatch}>{children}</HabitsDispatchContext>
    </HabitsStateContext>
  );
}
