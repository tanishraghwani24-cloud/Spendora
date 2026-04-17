"use client";

import { useCompareStore } from "@/components/compare-store";

type CompareCard = {
  card_name?: string;
  [key: string]: unknown;
};

export default function AddToCompareButton({ card }: { card: CompareCard }) {
  const { addCard, selectedCards } = useCompareStore();

  const alreadySelected = selectedCards.some((c) => c.card === card.card_name);

  const handleAddToCompare = () => {
    if (alreadySelected) {
      return;
    }

    if (selectedCards.length >= 3) {
      window.alert("You can compare up to 3 cards only.");
      return;
    }

    addCard(card);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCompare}
      disabled={alreadySelected}
      className="mt-2 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {alreadySelected ? "Added" : "Add to Compare"}
    </button>
  );
}
