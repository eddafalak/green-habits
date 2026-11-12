import { createContext, use, type Dispatch } from "react";
import type { HabitsAction, HabitsState } from "./habits";

// Two contexts: one for the state, one for dispatch. Components that only change things (like the
// "Add" form) use just the dispatch context, so they don't re-render whenever the list changes.
export const HabitsStateContext = createContext<HabitsState | null>(null);
export const HabitsDispatchContext = createContext<Dispatch<HabitsAction> | null>(null);

/** The current state, from any component inside <HabitsProvider>. */
export function useHabits() {
  const state = use(HabitsStateContext);
  if (!state) throw new Error("useHabits must be used inside <HabitsProvider>");
  return state;
}

/** The dispatch function, to send actions to the reducer. */
export function useHabitsDispatch() {
  const dispatch = use(HabitsDispatchContext);
  if (!dispatch) throw new Error("useHabitsDispatch must be used inside <HabitsProvider>");
  return dispatch;
}
