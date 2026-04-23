import { type HTMLAttributes } from "react";
import { cn } from "@/shared/lib";

const base = "glass-panel p-4 sm:p-6";

type Animation = "fade-in" | "pulse" | "none";

const animationClass: Record<Animation, string> = {
  "fade-in": "animate-fade-in",
  pulse: "animate-pulse",
  none: "",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  animation?: Animation;
}

export function Card({ animation = "fade-in", className, ...props }: CardProps) {
  return <div className={cn(base, animationClass[animation], className)} {...props} />;
}
