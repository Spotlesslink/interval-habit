import { Helmet } from "react-helmet-async";
import Timer from "@/components/Timer";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { Button } from "@/components/ui/button";

const Index = () => {
  const canonical = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";

  return (
    <div className="min-h-[100svh] bg-background overflow-x-hidden">
      <Helmet>
        <title>Tameno-style Interval Timer | Interval Habit</title>
        <meta name="description" content="A focused, repeating interval timer for habits like tooth-brushing or watering plants." />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Tameno-style Interval Timer" />
        <meta property="og:description" content="Repeat intervals until you stop. Simple, beautiful, and efficient." />
      </Helmet>

      <header className="container py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Interval Habit</h1>
          <div className="flex gap-3">
            <GoogleAuthButton />
            <Button variant="link" asChild>
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container pb-16">
        <section className="mb-10">
          <div className="rounded-2xl p-8 md:p-12 border bg-gradient-to-b from-background to-muted/60">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-4xl font-semibold mb-3">Focus on the habit, we’ll keep the time</h2>
              <p className="text-muted-foreground">Set an interval and let it loop until you stop. Perfect for repetitive routines like brushing teeth, stretching, or pomodoros.</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="timer" className="space-y-6">
          <h2 id="timer" className="sr-only">Timer</h2>
          <Timer />
        </section>

        <section id="how-it-works" className="mt-16 grid md:grid-cols-3 gap-6">
          <article className="rounded-xl border p-6">
            <h3 className="font-medium mb-1">1. Set interval</h3>
            <p className="text-sm text-muted-foreground">Choose minutes and seconds for one round.</p>
          </article>
          <article className="rounded-xl border p-6">
            <h3 className="font-medium mb-1">2. Auto-repeat</h3>
            <p className="text-sm text-muted-foreground">It loops until you stop. We’ll ping you each cycle.</p>
          </article>
          <article className="rounded-xl border p-6">
            <h3 className="font-medium mb-1">3. Track cycles</h3>
            <p className="text-sm text-muted-foreground">See how many rounds you’ve completed.</p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Index;
