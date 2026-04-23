import { describe, it, expect, beforeEach } from "vitest";
import { useHistoryStore } from "@/features/search-weather/model/historyStore";

describe("historyStore", () => {
  beforeEach(() => {
    useHistoryStore.setState({ history: [], removedStack: [] });
  });

  it("adds a city to history", () => {
    useHistoryStore.getState().addCity("London");

    const { history } = useHistoryStore.getState();
    expect(history).toHaveLength(1);
    expect(history[0].city).toBe("London");
  });

  it("moves existing city to top on re-add", () => {
    useHistoryStore.getState().addCity("London");
    useHistoryStore.getState().addCity("Paris");

    useHistoryStore.getState().addCity("London");

    const { history } = useHistoryStore.getState();
    expect(history[0].city).toBe("London");
    expect(history[1].city).toBe("Paris");
    expect(history).toHaveLength(2);
  });

  it("limits history to 10 items", () => {
    for (let i = 0; i < 15; i++) {
      useHistoryStore.getState().addCity(`City${i}`);
    }

    expect(useHistoryStore.getState().history).toHaveLength(10);
  });

  it("removes a city from history", () => {
    useHistoryStore.getState().addCity("London");
    useHistoryStore.getState().addCity("Paris");

    useHistoryStore.getState().removeCity("London");

    const { history } = useHistoryStore.getState();
    expect(history).toHaveLength(1);
    expect(history[0].city).toBe("Paris");
  });

  it("stores removed items for undo", () => {
    useHistoryStore.getState().addCity("London");

    useHistoryStore.getState().removeCity("London");

    expect(useHistoryStore.getState().removedStack[0]?.city).toBe("London");
  });

  it("undoes last remove", () => {
    useHistoryStore.getState().addCity("London");
    useHistoryStore.getState().addCity("Paris");
    useHistoryStore.getState().removeCity("London");

    useHistoryStore.getState().undoRemove();

    const { history } = useHistoryStore.getState();
    expect(history).toHaveLength(2);
    expect(history[0].city).toBe("London");
  });

  it("clears all history", () => {
    useHistoryStore.getState().addCity("London");
    useHistoryStore.getState().addCity("Paris");

    useHistoryStore.getState().clearHistory();

    expect(useHistoryStore.getState().history).toHaveLength(0);
  });

  it("deduplicates case-insensitively", () => {
    useHistoryStore.getState().addCity("London");

    useHistoryStore.getState().addCity("LONDON");

    const { history } = useHistoryStore.getState();
    expect(history).toHaveLength(1);
    expect(history[0].city).toBe("LONDON");
  });
});
