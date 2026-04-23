import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";

function Thrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("boom");
  return <div>healthy</div>;
}

describe("ErrorBoundary", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <Thrower shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("healthy")).toBeInTheDocument();
  });

  it("renders default fallback UI when child throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Thrower shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>custom</div>}>
        <Thrower shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText("custom")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("renders Try again button that can be clicked", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <Thrower shouldThrow />
      </ErrorBoundary>,
    );

    const btn = screen.getByRole("button", { name: /try again/i });

    await act(async () => {
      await user.click(btn);
    });

    // After reset the child throws again, so fallback re-appears.
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows a generic message when error has no message", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    function EmptyThrower(): never {
      const e = new Error();
      e.message = "";
      throw e;
    }

    render(
      <ErrorBoundary>
        <EmptyThrower />
      </ErrorBoundary>,
    );

    expect(screen.getByText("An unexpected error occurred.")).toBeInTheDocument();
  });
});
