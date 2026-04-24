import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScrollArrow } from "./ScrollArrow";

describe("ScrollArrow", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a left arrow with the given label and calls onClick", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <ScrollArrow direction="left" visible onClick={onClick} aria-label="Scroll history left" />,
    );

    const btn = screen.getByRole("button", { name: "Scroll history left" });
    expect(btn).toHaveTextContent("‹");
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a right arrow with the correct glyph", () => {
    render(
      <ScrollArrow
        direction="right"
        visible
        onClick={() => {}}
        aria-label="Scroll history right"
      />,
    );

    expect(screen.getByRole("button", { name: "Scroll history right" })).toHaveTextContent("›");
  });

  it("is focusable and exposed to assistive tech when visible", () => {
    render(<ScrollArrow direction="left" visible onClick={() => {}} aria-label="Scroll left" />);

    const btn = screen.getByRole("button", { name: "Scroll left" });
    expect(btn).not.toHaveAttribute("aria-hidden");
    expect(btn).toHaveAttribute("tabindex", "0");
  });

  it("is hidden from assistive tech and removed from tab order when not visible", () => {
    render(
      <ScrollArrow
        direction="right"
        visible={false}
        onClick={() => {}}
        aria-label="Scroll right"
      />,
    );

    // `aria-hidden` removes it from the a11y tree, so query by hidden: true.
    // When aria-hidden is true, the accessible name is empty.
    const btn = screen.getByRole("button", { name: "", hidden: true });
    expect(btn).toHaveAttribute("aria-hidden", "true");
    expect(btn).toHaveAttribute("tabindex", "-1");
  });

  it("forwards aria-controls when provided", () => {
    render(
      <ScrollArrow
        direction="left"
        visible
        onClick={() => {}}
        aria-label="Scroll left"
        aria-controls="my-list"
      />,
    );

    expect(screen.getByRole("button", { name: "Scroll left" })).toHaveAttribute(
      "aria-controls",
      "my-list",
    );
  });
});
