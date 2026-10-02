export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden bg-brand-soft">
      <div
        aria-hidden
        className="absolute -top-48 -left-48 -z-10 size-[36rem] rounded-full bg-gradient-to-br from-orange-200/80 via-brand-muted to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-48 -bottom-48 -z-10 size-[36rem] rounded-full bg-gradient-to-tl from-amber-200/70 via-brand-muted to-transparent blur-3xl"
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-multiply" />
      {children}
    </div>
  );
}
