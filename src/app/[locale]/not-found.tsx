import { Illustration, NotFound } from "@/components/ui/not-found";
import { PageShell } from "@/components/site/page-shell";

export default function NotFoundPage() {
  return (
    <PageShell>
      <main className="relative flex flex-1 items-center justify-center px-4 py-24">
        <Illustration className="pointer-events-none absolute inset-0 m-auto h-[50vh] w-full max-w-4xl text-zinc-950 opacity-[0.04]" />
        <NotFound />
      </main>
    </PageShell>
  );
}
