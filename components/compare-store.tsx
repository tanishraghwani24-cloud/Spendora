"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { Card } from "@/components/data";

const STORAGE_KEY = "cardmatch:selected-cards";
const MAX_COMPARE_CARDS = 3;

type CompareStoreValue = {
  selectedCards: Card[];
  maxSelection: number;
  selectionLimitReached: boolean;
  addCard: (card: Card | Record<string, unknown>) => void;
  toggleCardSelection: (card: Card) => void;
  removeCard: (card: Card) => void;
  clearSelection: () => void;
  isSelected: (card: Card) => boolean;
  canSelectMore: (card: Card) => boolean;
};

const CompareStoreContext = createContext<CompareStoreValue | null>(null);

function normalizeCard(card: Card | Record<string, unknown>): Card {
  if ("card" in card && typeof card.card === "string") {
    return card as Card;
  }

  const source = card as Record<string, unknown>;
  const annualFee = source.annual_fee;

  return {
    bank: (typeof source.bank === "string" ? source.bank : "Unknown Bank") as string,
    card: typeof source.card_name === "string" ? source.card_name : "Unknown Card",
    savings: typeof source.displaySavings === "string" ? source.displaySavings : "Not available",
    description: "",
    benefits: Array.isArray(source.other_benefits)
      ? source.other_benefits.filter((item): item is string => typeof item === "string")
      : [],
    annualFee:
      typeof annualFee === "number"
        ? `₹${annualFee}`
        : typeof annualFee === "string"
          ? annualFee
          : "Not available",
    joiningFee: "Not available",
    waiver: "Not available",
    tradeoff: typeof source.tradeoff === "string" ? source.tradeoff : ""
  };
}

export function CompareStoreProvider({ children }: { children: ReactNode }) {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);

  const addCard = (card: Card | Record<string, unknown>) => {
    const normalizedCard = normalizeCard(card);

    setSelectedCards((current) => {
      const alreadySelected = current.some((item) => item.card === normalizedCard.card);

      if (alreadySelected || current.length >= MAX_COMPARE_CARDS) {
        return current;
      }

      return [...current, normalizedCard];
    });
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as Card[];
      if (Array.isArray(parsed)) {
        setSelectedCards(parsed.slice(0, MAX_COMPARE_CARDS));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCards));
  }, [selectedCards]);

  const toggleCardSelection = (card: Card) => {
    setSelectedCards((current) => {
      const alreadySelected = current.some((item) => item.card === card.card);

      if (alreadySelected) {
        return current.filter((item) => item.card !== card.card);
      }

      if (current.length >= MAX_COMPARE_CARDS) {
        return current;
      }

      return [...current, card];
    });
  };

  const removeCard = (card: Card) => {
    setSelectedCards((current) => current.filter((item) => item.card !== card.card));
  };

  const clearSelection = () => {
    setSelectedCards([]);
  };

  const value = useMemo<CompareStoreValue>(
    () => ({
      selectedCards,
      maxSelection: MAX_COMPARE_CARDS,
      selectionLimitReached: selectedCards.length >= MAX_COMPARE_CARDS,
      addCard,
      toggleCardSelection,
      removeCard,
      clearSelection,
      isSelected: (card: Card) => selectedCards.some((item) => item.card === card.card),
      canSelectMore: (card: Card) =>
        selectedCards.length < MAX_COMPARE_CARDS ||
        selectedCards.some((item) => item.card === card.card)
    }),
    [selectedCards]
  );

  return <CompareStoreContext.Provider value={value}>{children}</CompareStoreContext.Provider>;
}

export function useCompareStore() {
  const context = useContext(CompareStoreContext);

  if (!context) {
    throw new Error("useCompareStore must be used within CompareStoreProvider");
  }

  return context;
}
