import { cn } from "@/shared/lib";
import { IconButton } from "./IconButton";

interface ScrollArrowProps {
  direction: "left" | "right";
  visible: boolean;
  onClick: VoidFunction;
  /** Accessible label for the button. */
  "aria-label": string;
  /** Optional id of the element this arrow scrolls. */
  "aria-controls"?: string;
  className?: string;
}

/**
 * Circular arrow button for horizontal scrollers. Absolutely positioned to the
 * left or right edge of the nearest positioned ancestor; fades out when
 * `visible` is false while remaining in layout.
 */
export function ScrollArrow({ direction, visible, onClick, className, ...rest }: ScrollArrowProps) {
  const isLeft = direction === "left";
  return (
    <IconButton
      type="button"
      size="sm"
      onClick={onClick}
      // When not visible, hide from assistive tech and remove from the tab
      // order in addition to disabling pointer events.
      aria-hidden={!visible || undefined}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "!size-7 !rounded-full",
        "absolute top-1/2 z-10 -translate-y-1/2",
        "bg-surface/90 text-muted-foreground hover:text-foreground backdrop-blur",
        "transition-all duration-200",
        isLeft ? "left-1" : "right-1",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
        className,
      )}
      {...rest}
    >
      {isLeft ? "‹" : "›"}
    </IconButton>
  );
}
