"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getRecommendations, Recommendation } from "@/lib/scoringEngine";
import AnimatedCard from "../../components/AnimatedCard";
import AddToCompareButton from "../../components/AddToCompareButton";

type ResultsClientProps = {
  rawData: any;
  primaryParam: string;
  secondaryParam: string;
  foodSpending: number;
  travelSpending: number;
  shoppingSpending: number;
};

type BreakdownItem = {
  category?: string;
  categoryName?: string;
  amountSpent?: number;
  monthlySpend?: number;
  spend?: number;
  rewardRate?: number;
  rate?: number;
  savings?: number;
  savingsCalculated?: number;
  annualSavings?: number;
};

function normalizeCategory(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function getCardVisualGradient(cardName: string): string {
  const normalizedName = cardName.toLowerCase();

  if (normalizedName.includes("sbi")) {
    return "from-blue-900 to-blue-600";
  }

  if (normalizedName.includes("hdfc")) {
    return "from-red-900 to-red-600";
  }

  if (normalizedName.includes("icici")) {
    return "from-orange-900 to-orange-600";
  }

  return "from-gray-900 to-gray-700";
}

function getCardNetwork(cardName: string): string {
  const normalizedName = cardName.toLowerCase();

  if (normalizedName.includes("mastercard")) {
    return "MASTERCARD";
  }

  if (normalizedName.includes("visa")) {
    return "VISA";
  }

  if (normalizedName.includes("rupay")) {
    return "RUPAY";
  }

  return "VISA";
}

export default function ResultsClient({
  rawData,
  primaryParam,
  secondaryParam,
  foodSpending,
  travelSpending,
  shoppingSpending,
}: ResultsClientProps) {
  const [showDetails, setShowDetails] = useState(false);

  const userInput = useMemo(() => {
    const primaryCategory = `cat_${normalizeCategory(primaryParam || "shopping")}`;

    const secondaryCategories = secondaryParam
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => `cat_${normalizeCategory(item)}`);

    return {
      primaryCategory,
      secondaryCategories,
      selectedSubcategories: [],
      spending: {
        food: foodSpending,
        travel: travelSpending,
        shopping: shoppingSpending,
      },
    };
  }, [foodSpending, primaryParam, secondaryParam, shoppingSpending, travelSpending]);

  const results: Recommendation[] = useMemo(() => {
    return getRecommendations(userInput, rawData);
  }, [userInput]);

  const breakdownItems = useMemo(() => {
    const topResult = (results[0] ?? null) as
      | (Recommendation & {
          breakdown?: BreakdownItem[];
          card?: { breakdown?: BreakdownItem[] };
        })
      | null;

    const candidate = topResult?.breakdown ?? topResult?.card?.breakdown;
    return Array.isArray(candidate) ? candidate : [];
  }, [results]);

  const formatCurrency = (value: number) =>
    `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      Math.max(0, Math.round(value))
    )}`;

  const toTitleCase = (value: string) =>
    value
      .replace(/^cat_/, "")
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const parsedBreakdown = useMemo(() => {
    return breakdownItems
      .map((item) => {
        const rawCategory =
          typeof item.categoryName === "string"
            ? item.categoryName
            : typeof item.category === "string"
              ? item.category
              : "Other";

        const amount = Number(item.amountSpent ?? item.monthlySpend ?? item.spend ?? 0);
        const rewardRate = Number(item.rewardRate ?? item.rate ?? 0);
        const computedSavings = Number(item.savings ?? item.savingsCalculated ?? item.annualSavings ?? 0);

        return {
          category: toTitleCase(rawCategory),
          amount: Number.isFinite(amount) ? amount : 0,
          rewardRate: Number.isFinite(rewardRate) ? rewardRate : 0,
          savings: Number.isFinite(computedSavings) ? computedSavings : 0,
        };
      })
      .filter((item) => item.category.length > 0);
  }, [breakdownItems]);

  const totalSavings = useMemo(
    () => parsedBreakdown.reduce((sum, item) => sum + item.savings, 0),
    [parsedBreakdown]
  );

  return (
    <div className="container-shell relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-10 px-1">
        <section
          className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-100 via-white to-sky-100 p-8 shadow-lg dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 sm:p-12"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-200/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-teal-200/40 blur-2xl" />
          <p className="relative text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            Estimated savings preview
          </p>

          <h1 className="relative mt-4 text-4xl font-bold leading-tight text-slate-900 dark:text-white sm:text-5xl">
            You could save up to
            <span className="ml-2 inline-block text-green-600">
              {results.length > 0 ? results[0].displaySavings : "₹0"}
            </span>
          </h1>

          <p className="relative mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Based on your spending habits
          </p>
        </section>

        <section className="space-y-6">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
              No recommendations found
            </div>
          ) : (
            results.map((result: Recommendation, index: number) => (
              <AnimatedCard
                key={result.card?.id ?? result.card?.card_name ?? index}
                index={index}
              >
                <article className="group relative cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl dark:border-slate-600 dark:bg-slate-800 sm:p-7">
                  <div
                    className={`mb-4 h-40 w-full rounded-xl bg-gradient-to-r ${getCardVisualGradient(
                      result.card?.card_name ?? ""
                    )} p-4 text-white`}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                          {result.card?.card_name}
                        </p>
                        {result.card?.bank ? (
                          <p className="mt-1 text-sm font-medium text-white/90">
                            {result.card.bank}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-end justify-between">
                        <p className="text-lg font-semibold tracking-[0.2em]">
                          **** 1234
                        </p>
                        <p className="text-xs font-semibold tracking-[0.16em] text-white/80">
                          {getCardNetwork(result.card?.card_name ?? "")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start justify-between gap-3 pr-28">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {result.card?.card_name}
                    </h2>
                  </div>

                  {index === 0 ? (
                    <span className="absolute right-6 top-6 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Best Match
                    </span>
                  ) : null}

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-300">
                    Estimated Savings
                  </p>

                  <p className="mt-1 text-4xl font-bold text-green-600">
                    {result.displaySavings}
                  </p>

                  <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 dark:border-yellow-800 dark:bg-yellow-950/40">
                    <p className="text-sm font-semibold text-amber-900 dark:text-yellow-200">
                      <span className="mr-1">⭐</span>
                      {result.whyRecommended}
                    </p>
                  </div>

                  <ul className="mt-4 space-y-1 text-sm text-gray-600 dark:text-slate-300">
                    {toStringArray(result.card?.other_benefits).map(
                      (benefit: string, benefitIndex: number) => (
                        <li key={benefitIndex} className="flex items-start gap-2">
                          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                          <span>{benefit}</span>
                        </li>
                      )
                    )}
                  </ul>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-200">
                      Fee: ₹{result.card?.annual_fee ?? "-"}
                    </p>

                    {result.card?.apply_link && (
                      <a
                        href={result.card.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Apply Now →
                      </a>
                    )}

                    <AddToCompareButton card={result.card ?? {}} />

                    <p className="text-sm text-gray-500 dark:text-slate-300">{result.tradeoff}</p>
                  </div>
                </article>
              </AnimatedCard>
            ))
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setShowDetails((previous) => !previous)}
            className="flex w-full items-center justify-between text-left"
          >
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Calculation details
            </h2>
            <ChevronDown
              className={`h-5 w-5 text-slate-500 transition-transform duration-300 dark:text-slate-300 ${
                showDetails ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div
            className={`grid transition-all duration-300 ease-out ${
              showDetails ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-xl border border-white/50 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-500/30 dark:bg-slate-900/40">
                {parsedBreakdown.length > 0 ? (
                  <div className="space-y-2">
                    {parsedBreakdown.map((item, index) => (
                      <p
                        key={`${item.category}-${index}`}
                        className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                      >
                        {`${item.category}: ${formatCurrency(item.amount)} × ${item.rewardRate}% = ${formatCurrency(
                          item.savings
                        )}`}
                      </p>
                    ))}
                    <p className="pt-2 text-sm font-semibold text-green-700 dark:text-green-300">
                      {`Total Savings: ${formatCurrency(totalSavings)}`}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Detailed breakdown is not available for this recommendation.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
