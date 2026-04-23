import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InstallPrompt } from "@/features/pwa/ui/InstallPrompt";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function makeInstallEvent(outcome: "accepted" | "dismissed" = "accepted"): InstallEvent {
  const e = new Event("beforeinstallprompt") as InstallEvent;
  e.prompt = () => Promise.resolve();
  e.userChoice = Promise.resolve({ outcome });
  return e;
}

describe("InstallPrompt", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders nothing before beforeinstallprompt fires", () => {
    const { container } = render(<InstallPrompt />);

    expect(container.firstChild).toBeNull();
  });

  it("shows install button after beforeinstallprompt", () => {
    render(<InstallPrompt />);

    act(() => {
      window.dispatchEvent(makeInstallEvent());
    });

    expect(screen.getByRole("button", { name: /install/i })).toBeInTheDocument();
  });

  it("hides itself after a successful install", async () => {
    const user = userEvent.setup();
    render(<InstallPrompt />);

    act(() => {
      window.dispatchEvent(makeInstallEvent("accepted"));
    });

    await user.click(screen.getByRole("button", { name: /install/i }));

    // Promise resolution + state update
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByRole("button", { name: /install/i })).not.toBeInTheDocument();
  });

  it("hides when the appinstalled event fires", () => {
    render(<InstallPrompt />);

    act(() => {
      window.dispatchEvent(makeInstallEvent());
    });

    expect(screen.getByRole("button", { name: /install/i })).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event("appinstalled"));
    });

    expect(screen.queryByRole("button", { name: /install/i })).not.toBeInTheDocument();
  });
});
