import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { LazyVisible } from "@/shared/ui/LazyVisible";

type Entry = { isIntersecting: boolean };
type ObserverCb = (entries: Entry[]) => void;
const instances: Array<{ cb: ObserverCb; disconnect: () => void; observe: () => void }> = [];

class MockIO {
  cb: ObserverCb;
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn();
  root = null;
  rootMargin = "";
  thresholds = [];
  constructor(cb: ObserverCb) {
    this.cb = cb;
    instances.push({ cb, observe: this.observe, disconnect: this.disconnect });
  }
}

describe("LazyVisible", () => {
  beforeEach(() => {
    instances.length = 0;
    vi.stubGlobal("IntersectionObserver", MockIO);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders fallback before the element is visible", () => {
    render(
      <LazyVisible fallback={<span>loading</span>}>
        <span>content</span>
      </LazyVisible>,
    );

    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("renders children once the observer reports intersection", () => {
    render(
      <LazyVisible fallback={<span>loading</span>}>
        <span>content</span>
      </LazyVisible>,
    );

    const first = instances[0]!;

    act(() => {
      first.cb([{ isIntersecting: true }]);
    });

    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("does not show children when not intersecting", () => {
    render(
      <LazyVisible>
        <span>content</span>
      </LazyVisible>,
    );

    const first = instances[0]!;
    act(() => {
      first.cb([{ isIntersecting: false }]);
    });

    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(
      <LazyVisible>
        <span>content</span>
      </LazyVisible>,
    );

    const first = instances[0]!;
    unmount();

    expect(first.disconnect).toHaveBeenCalled();
  });
});
