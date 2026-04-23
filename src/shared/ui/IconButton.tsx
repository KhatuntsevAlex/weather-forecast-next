import { type ButtonHTMLAttributes } from "react";
import { buttonBase, buttonVariants, type ButtonVariant, type ButtonSize } from "./Button";
import { cn } from "@/shared/lib";

const iconSizes: Record<ButtonSize, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-[50px] h-[50px]",
};

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Accessible label — required since icon buttons have no visible text. */
  "aria-label": string;
}

/**
 * Square button for a single icon/glyph. Shares the visual system with `Button`
 * but constrains dimensions to a square and requires `aria-label`.
 */
export function IconButton({
  variant = "ghost",
  size = "md",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], iconSizes[size], className)}
      {...props}
    />
  );
}
