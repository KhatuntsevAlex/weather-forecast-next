import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib";

export const buttonBase =
  "rounded-xl transition-[background-color,border-color,box-shadow,color,transform] duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";

export const buttonVariants = {
  primary:
    "bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium shadow-md hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95",
  ghost:
    "bg-surface border border-border hover:bg-surface-hover hover:border-border-hover text-foreground",
  danger: "bg-red-500/15 border border-red-500/40 hover:bg-red-500/25 text-red-400",
} as const;

export const buttonSizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4",
  lg: "h-[50px] px-6",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export function buttonClass(
  variant: ButtonVariant = "ghost",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = "ghost", size = "md", className, ...props }: ButtonProps) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}
