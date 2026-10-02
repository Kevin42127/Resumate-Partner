import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand-strong text-white shadow-sm hover:bg-brand-hover",
  outline: "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300",
  ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
} as const;

const sizes = {
  sm: "h-8 gap-1.5 rounded-full px-3 text-sm",
  md: "h-10 gap-2 rounded-full px-4 text-sm",
  lg: "h-12 gap-2 rounded-full px-6 text-base",
  icon: "size-8 rounded-full",
} as const;

export type ButtonStyleProps = { variant?: keyof typeof variants; size?: keyof typeof sizes };

export const buttonClass = ({ variant = "primary", size = "md" }: ButtonStyleProps = {}, className?: string) =>
  cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & ButtonStyleProps) {
  return <button type={type} className={buttonClass({ variant, size }, className)} {...props} />;
}
