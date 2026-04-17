"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import { useCompareStore } from "@/components/compare-store";
import type { Card } from "@/components/data";

const compareFields = [
  { label: "Annual savings", getValue: (card: Card) => card.savings },
  { label: "Annual fee", getValue: (card: Card) => card.annualFee },
  { label: "Joining fee", getValue: (card: Card) => card.joiningFee },
  { label: "Reward type", getValue: (card: Card) => card.benefits[0] ?? "Not specified" },
  { label: "Best category", getValue: (card: Card) => inferBestCategory(card) },
  { label: "Lounge access", getValue: (card: Card) => inferLoungeAccess(card) },
  { label: "Beginner friendly", getValue: (card: Card) => inferBeginnerFriendly(card) },
  { label: "Network", getValue: () => "Not available in current dataset" },
  { label: "Fee waiver", getValue: (card: Card) => card.waiver }
] as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ComparePage() {
  const { selectedCards, removeCard, clearSelection } = useCompareStore();

  if (selectedCards.length === 0) {
    return (
      <div className="container-shell py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <section className="panel p-6 text-center sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
              Compare cards
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
              No cards selected yet
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              Go back to results, select up to 3 cards, and we&apos;ll compare the exact ones here.
            </p>
            <Link
              href="/results"
              prefetch={true}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
            >
              Back to results
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="container-shell py-8 sm:py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="panel p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
                Compare cards
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-brand-ink sm:text-5xl">
                Side-by-side card comparison
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Comparing {selectedCards.length} selected {selectedCards.length === 1 ? "card" : "cards"}.
                This table renders directly from your current compare selection.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/results"
                prefetch={true}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {selectedCards.map((card) => (
              <div
                key={card.card}
                className="inline-flex items-center gap-3 rounded-full border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-slate-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-slate-100"
              >
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">{card.card}</span>
                  <span className="ml-2 text-slate-500 dark:text-slate-300">{card.bank}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCard(card)}
                  className="rounded-full p-1 text-slate-500 transition hover:bg-white hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  aria-label={`Remove ${card.card} from compare`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel overflow-hidden">
          <div
            className="grid min-w-[760px] border-b border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
            style={{ gridTemplateColumns: `180px repeat(${selectedCards.length}, minmax(220px, 1fr))` }}
          >
            <div className="px-4 py-4">Feature</div>
            {selectedCards.map((card) => (
              <div key={card.card} className="border-l border-slate-200 px-4 py-4 dark:border-slate-600">
                <p className="text-xs uppercase tracking-[0.18em] text-brand-blue">{card.bank}</p>
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{card.card}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            {compareFields.map((field) => (
              <div
                key={field.label}
                className="grid min-w-[760px] border-b border-slate-200 text-sm dark:border-slate-600"
                style={{ gridTemplateColumns: `180px repeat(${selectedCards.length}, minmax(220px, 1fr))` }}
              >
                <div className="bg-white px-4 py-4 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200">{field.label}</div>
                {selectedCards.map((card) => (
                  <ValueCell
                    key={`${field.label}-${card.card}`}
                    value={field.getValue(card)}
                    highlight={shouldHighlight(field.label, card, selectedCards)}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ValueCell({ value, highlight }: { value: string; highlight: boolean }) {
  return (
    <div
      className={cx(
        "border-l border-slate-200 px-4 py-4 dark:border-slate-600",
        highlight
          ? "bg-green-50 text-brand-green dark:bg-green-950/30"
          : "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200"
      )}
    >
      <span className={highlight ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}

function inferBestCategory(card: Card) {
  const content = `${card.description} ${card.benefits.join(" ")}`.toLowerCase();

  if (content.includes("shopping") || content.includes("amazon")) return "Shopping";
  if (content.includes("travel") || content.includes("lounge")) return "Travel";
  if (content.includes("bill") || content.includes("delivery")) return "Utilities & dining";
  if (content.includes("entertainment")) return "Entertainment";

  return "General spending";
}

function inferLoungeAccess(card: Card) {
  const content = `${card.description} ${card.benefits.join(" ")} ${card.tradeoff}`.toLowerCase();

  if (content.includes("lounge")) {
    if (content.includes("milestone")) return "Milestone-based";
    return "Available";
  }

  return "Not highlighted";
}

function inferBeginnerFriendly(card: Card) {
  const annualFee = card.annualFee.toLowerCase();

  if (annualFee.includes("nil") || annualFee.includes("499")) return "Yes";
  if (annualFee.includes("999") || annualFee.includes("1,000")) return "Maybe";

  return "Not specified";
}

function shouldHighlight(label: string, card: Card, selectedCards: Card[]) {
  const values = selectedCards.map((item) => getComparableValue(label, item));
  const current = getComparableValue(label, card);

  if (current === null) return false;

  if (label === "Annual fee" || label === "Joining fee") {
    const min = Math.min(...values.filter((value): value is number => value !== null));
    return current === min;
  }

  if (label === "Annual savings") {
    const max = Math.max(...values.filter((value): value is number => value !== null));
    return current === max;
  }

  return false;
}

function getComparableValue(label: string, card: Card) {
  if (label === "Annual savings") return parseCurrency(card.savings);
  if (label === "Annual fee") return parseCurrency(card.annualFee);
  if (label === "Joining fee") return parseCurrency(card.joiningFee);

  return null;
}

function parseCurrency(value: string) {
  if (value.toLowerCase().includes("nil")) return 0;

  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}
