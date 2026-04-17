"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { categories, subcategoryGroups } from "@/components/data";
import { Pill } from "@/components/ui";

function normalizeCategory(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function getCategoryEmoji(label: string): string {
  const map: Record<string, string> = {
    Shopping: "🛍️",
    Dining: "🍔",
    Travel: "✈️",
    Movies: "🎬",
    Fuel: "⛽",
    Electronics: "📱",
  };

  return map[label] ?? "💳";
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [spending, setSpending] = useState<Record<string, string | number>>({});
  const [brands, setBrands] = useState<string[]>([]);

  const filteredSubcategoryGroups = useMemo(
    () => subcategoryGroups.filter((group) => selectedCategories.includes(group.title)),
    [selectedCategories]
  );

  const availableBrands = useMemo(
    () => filteredSubcategoryGroups.flatMap((group) => group.options),
    [filteredSubcategoryGroups]
  );

  useEffect(() => {
    setBrands((current) => current.filter((brand) => availableBrands.includes(brand)));
  }, [availableBrands]);

  const toggleSelection = (value: string) => {
    setSelectedCategories((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const updateSpending = (category: string, value: string) => {
    setSpending((current) => ({
      ...current,
      [category]: value === "" ? "" : Number(value)
    }));
  };

  const toggleBrand = (value: string) => {
    setBrands((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const primary = normalizeCategory(selectedCategories[0] ?? "shopping");
  const secondary = selectedCategories
    .slice(1)
    .map(normalizeCategory)
    .filter(Boolean)
    .join(",");

  const spendingQuery = selectedCategories
    .map(
      (category) => {
        const amount = Number(spending[category] ?? 0);
        const safeAmount = Number.isFinite(amount) ? amount : 0;

        return (
        `${encodeURIComponent(normalizeCategory(category))}=${encodeURIComponent(
          String(safeAmount)
        )}`
        );
      }
    )
    .join("&");

  const resultsHref = secondary
    ? `/results?primary=${encodeURIComponent(primary)}&secondary=${encodeURIComponent(secondary)}${
        spendingQuery ? `&${spendingQuery}` : ""
      }`
    : `/results?primary=${encodeURIComponent(primary)}${spendingQuery ? `&${spendingQuery}` : ""}`;

  useEffect(() => {
    router.prefetch(resultsHref);
  }, [resultsHref, router]);

  const progressPercent = (step / 3) * 100;

  return (
    <div className="container-shell min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 py-8 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:py-12">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:border dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-slate-300">Step {step} of 3</p>
            <div className="h-2 rounded-full bg-gray-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="mt-8 space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Choose your top categories</h1>
                <p className="mt-1 text-gray-500 dark:text-slate-300">
                  Tell us where you spend the most to personalize card recommendations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category.label);

                  return (
                    <button
                      key={category.label}
                      type="button"
                      onClick={() => toggleSelection(category.label)}
                      className={`rounded-xl border p-4 text-left transition-all duration-200 hover:border-green-500 ${
                        isSelected
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800"
                      }`}
                    >
                      <p className="text-2xl">{getCategoryEmoji(category.label)}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{category.label}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-300">{category.description}</p>
                    </button>
                  );
                })}
              </div>

              {selectedCategories.length > 0 && (
                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-900/70">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Monthly spending by category (₹)</p>

                  <div className="space-y-3">
                    {selectedCategories.map((category) => (
                      <label key={category} className="block">
                        <span className="mb-1 block text-sm text-slate-700 dark:text-slate-200">{category}</span>
                        <input
                          type="number"
                          min={0}
                          inputMode="numeric"
                          step={1}
                          value={spending[category] ?? ""}
                          onChange={(event) => updateSpending(category, event.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-green-900/40"
                          placeholder="0"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <StepActions
                onNext={() => setStep(2)}
                nextLabel="Next"
                nextDisabled={selectedCategories.length === 0}
              />
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Refine your interests</h2>
                <p className="mt-1 text-gray-500 dark:text-slate-300">Pick brands to sharpen reward matching.</p>
              </div>

              {filteredSubcategoryGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{group.title}</p>

                  <div className="mt-2 flex flex-wrap gap-3">
                    {group.options.map((option) => (
                      <Pill
                        key={option}
                        label={option}
                        active={brands.includes(option)}
                        onClick={() => toggleBrand(option)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <StepActions onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Next" />
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to see your best cards?</h2>
                <p className="mt-1 text-gray-500 dark:text-slate-300">We have enough details to generate your recommendations.</p>
              </div>

              <Link
                href={resultsHref}
                prefetch={true}
                onMouseEnter={() => router.prefetch(resultsHref)}
                onFocus={() => router.prefetch(resultsHref)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Get my recommendations
                <ChevronRight className="h-4 w-4" />
              </Link>

              <StepActions onBack={() => setStep(2)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepActions({
  onBack,
  onNext,
  nextLabel,
  nextDisabled = false
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex justify-between gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      ) : (
        <span />
      )}

      {nextLabel ? (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextLabel}
        </button>
      ) : null}
    </div>
  );
}
