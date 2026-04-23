import { type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib";

const base =
  "w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder-muted-foreground outline-none transition-[border-color,box-shadow] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] focus:border-cyan-400 focus:shadow-[0_0_0_3px_hsla(195,95%,55%,0.1)]";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, className)} {...props} />;
}
