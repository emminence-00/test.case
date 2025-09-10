import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-between p-8 pb-20 font-sans bg-gradient-to-br from-background via-background to-muted/20 text-foreground transition-all duration-500 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <main className="relative z-10 flex flex-col items-center gap-10 w-full max-w-2xl mt-16">
        {/* Title */}
        <h1 className="mb-2 text-center text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
            test.case
          </span>
        </h1>

        {/* Description list (kept as ordered list for same UX) */}
        <div className="w-full">
          <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 shadow-sm">
            <ol className="list-decimal list-inside space-y-2 text-base font-mono text-muted-foreground">
              <li className="tracking-[-.01em]">
                Explore practice tests designed to challenge and improve your skills.
              </li>
              <li className="tracking-[-.01em]">
                Get AI-guided feedback to learn smarter, not harder.
              </li>
            </ol>
          </div>
        </div>

        {/* Primary actions (same links and flow) */}
        <div className="flex w-full flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="group w-full sm:w-auto relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href={"/tests"} className="flex items-center">
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
              <Image
                src="/vercel.svg"
                alt="Tests"
                width={20}
                height={20}
                className="mr-2 dark:invert"
              />
              See available tests
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="group w-full sm:w-auto relative overflow-hidden border-[1.5px] hover:bg-accent/40 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Link href={"/create"} className="flex items-center">
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-accent/30 to-transparent -skew-x-12" />
              <Image
                src="/file.svg"
                alt="Create"
                width={20}
                height={20}
                className="mr-2 dark:invert"
              />
              Make your own
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer (same links, refined style) */}
      <footer className="relative z-10 flex flex-wrap items-center justify-center w-full gap-8 py-8 mt-16 border-t border-border/60 backdrop-blur-sm">
        <a
          href="/learn"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Image
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
            aria-hidden
            className="dark:invert"
          />
          <span className="text-sm font-medium">Learn</span>
        </a>

        <a
          href="/examples"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Image
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
            aria-hidden
            className="dark:invert"
          />
          <span className="text-sm font-medium">Examples</span>
        </a>

        <a
          href="/faq"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Image
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
            aria-hidden
            className="dark:invert"
          />
          <span className="text-sm font-medium">FAQ</span>
        </a>
      </footer>
    </div>
  );
}
