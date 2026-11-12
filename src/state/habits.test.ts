import { describe, expect, it } from "vitest";
import { habitsReducer, initialState, progress, visibleHabits, type HabitsState } from "./habits";

const empty: HabitsState = { habits: [], filter: "all" };

describe("habitsReducer", () => {
  it("adds a habit to the top of the list", () => {
    const state = habitsReducer(empty, { type: "added", id: "a", text: "  Shorter showers ", category: "Energy", createdAt: 1 });
    expect(state.habits).toEqual([{ id: "a", text: "Shorter showers", category: "Energy", done: false, createdAt: 1 }]);
  });

  it("ignores empty habits", () => {
    expect(habitsReducer(empty, { type: "added", id: "a", text: "   ", category: "Food", createdAt: 1 })).toBe(empty);
  });

  it("toggles, edits and deletes a habit", () => {
    let state = habitsReducer(empty, { type: "added", id: "a", text: "Compost", category: "Waste", createdAt: 1 });
    state = habitsReducer(state, { type: "toggled", id: "a" });
    expect(state.habits[0].done).toBe(true);
    state = habitsReducer(state, { type: "edited", id: "a", text: "Compost food scraps", category: "Food" });
    expect(state.habits[0]).toMatchObject({ text: "Compost food scraps", category: "Food", done: true });
    state = habitsReducer(state, { type: "deleted", id: "a" });
    expect(state.habits).toEqual([]);
  });

  it("does not change the old state (it returns a new object)", () => {
    const before = structuredClone(initialState);
    habitsReducer(initialState, { type: "toggled", id: "seed-1" });
    expect(initialState).toEqual(before);
  });

  it("clears done habits and resets", () => {
    const cleared = habitsReducer(initialState, { type: "cleared_done" });
    expect(cleared.habits.every((h) => !h.done)).toBe(true);
    expect(habitsReducer(cleared, { type: "reset" })).toBe(initialState);
  });
});

describe("selectors", () => {
  it("filters the visible habits", () => {
    const done = habitsReducer(initialState, { type: "filter_changed", filter: "done" });
    expect(visibleHabits(done).map((h) => h.id)).toEqual(["seed-2"]);
  });

  it("calculates progress", () => {
    expect(progress(initialState)).toEqual({ total: 4, done: 1, percent: 25 });
    expect(progress(empty).percent).toBe(0);
  });
});
