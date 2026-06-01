import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

// Esquinas rectas (arquitectónico). Press = translateY(1px), sin rebote ni escala.
const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium tracking-snug rounded-none " +
  "transition-[background-color,color,border-color,transform] duration-fast ease-expo active:translate-y-px " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-cream disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // ink → taupe al hover
  primary: "bg-ink-900 text-on-ink border border-ink-900 hover:bg-ink-600 hover:border-ink-600",
  // transparente → relleno ink (invierte)
  secondary: "bg-transparent text-ink-900 border border-ink-900 hover:bg-ink-900 hover:text-on-ink",
  // enlace: ink → stone
  ghost: "border border-transparent text-ink-900 hover:text-stone-500",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2.5",
  md: "text-sm px-6 py-3.5",
  lg: "text-base px-8 py-4",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}
