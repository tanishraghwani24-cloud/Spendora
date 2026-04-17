import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PrimaryButton({
  href,
  children,
  className
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700",
        className
      )}
    >
      {children}
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
}

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const width = `${(current / total) * 100}%`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
        <span>Step {current}</span>
        <span>{total} total</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-green transition-all duration-500"
          style={{ width }}
        />
      </div>
    </div>
  );
}

export function SelectCard({
  icon: Icon,
  title,
  description,
  active,
  compact = false,
  onClick
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  active: boolean;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group w-full rounded-3xl border text-left transition duration-200",
        compact ? "p-4" : "p-5 sm:p-6",
        active
          ? "border-brand-blue bg-blue-50 shadow-lg shadow-blue-100"
          : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-card dark:border-slate-600 dark:bg-slate-800"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cx(
            "flex items-center justify-center rounded-2xl",
            compact ? "h-11 w-11" : "h-14 w-14",
            active ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100"
          )}
        >
          <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">{title}</h3>
            {active && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-white">
                <Check className="h-4 w-4" />
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </div>
    </button>
  );
}

export function Pill({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-full border px-4 py-2.5 text-sm font-medium transition",
        active
          ? "border-brand-blue bg-brand-blue text-white shadow-lg shadow-blue-500/20"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700"
      )}
    >
      {label}
    </button>
  );
}
