import { cn } from "@/lib/utils";
import { CheckIcon } from "./icons";

export function Checkbox({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <span className={cn("relative inline-flex size-4.5 shrink-0", className)}>
      <input
        type="checkbox"
        className="peer size-full cursor-pointer appearance-none rounded-[5px] border border-zinc-300 bg-white shadow-xs transition-colors checked:border-brand checked:bg-brand hover:not-disabled:border-zinc-400 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-50"
        {...props}
      />
      <CheckIcon
        strokeWidth={3}
        className="pointer-events-none absolute inset-0 m-auto size-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
      />
    </span>
  );
}
