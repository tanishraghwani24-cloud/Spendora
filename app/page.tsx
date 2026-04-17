import { categories } from "@/components/data";
import { PrimaryButton } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="relative isolate">
      <section className="container-shell flex min-h-[calc(100vh-4rem)] items-center py-12 sm:py-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl animate-appear">
            <div className="mb-6 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-brand-blue dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              Discover the right credit card, faster
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-brand-ink dark:text-white sm:text-6xl">
              Find your perfect credit card in 60 seconds
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              Answer 3 simple questions about how you spend. We&apos;ll show you exactly
              how much you can save.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PrimaryButton href="/onboarding" className="px-7 py-3.5 text-base">
                Find my card
              </PrimaryButton>
            </div>
          </div>

          <div className="relative h-[420px] rounded-[2rem] border border-white/70 bg-hero p-6 shadow-card dark:border-slate-700 dark:bg-slate-900/50 sm:h-[520px]">
            <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-white/90 bg-white/90 text-center shadow-card backdrop-blur dark:border-slate-600 dark:bg-slate-800/90">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-400">
                  CardMatch
                </p>
                <p className="mt-2 text-2xl font-bold text-brand-ink dark:text-white">Spend smarter</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">UI-first recommendation flow</p>
              </div>
            </div>

            {categories.map((category, index) => {
              const positions = [
                "left-3 top-8 sm:left-6",
                "right-4 top-10 sm:right-6",
                "left-8 bottom-28",
                "right-8 bottom-32",
                "left-1/2 top-4 -translate-x-1/2",
                "left-1/2 bottom-8 -translate-x-1/2"
              ];

              return (
                <div
                  key={category.label}
                  className={`absolute ${positions[index]} animate-float`}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/90 px-4 py-3 shadow-lg shadow-slate-200/50 backdrop-blur dark:border-slate-600 dark:bg-slate-800/90 dark:shadow-none">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                      <category.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-100">{category.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-shell pb-16 sm:pb-20">
        <div className="panel grid gap-4 px-6 py-5 text-center sm:grid-cols-3 sm:text-left">
          <div>
            <p className="text-sm font-semibold text-brand-ink dark:text-white">Based on 22 top Indian credit cards</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-ink dark:text-white">No personal data required</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-ink dark:text-white">Takes less than 60 seconds</p>
          </div>
        </div>
      </section>
    </div>
  );
}
