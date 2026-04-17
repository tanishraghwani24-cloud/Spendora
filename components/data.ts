import {
  Clapperboard,
  Plane,
  ShoppingBag,
  UtensilsCrossed,
  Fuel,
  Smartphone
} from "lucide-react";

export type Bank =
  | "HDFC Bank"
  | "SBI Card"
  | "Axis Bank"
  | "ICICI Bank"
  | "IDFC FIRST"
  | "Unknown Bank";

export type Card = {
  bank: Bank;
  card: string;
  badge?: string;
  savings: string;
  description: string;
  benefits: readonly string[];
  annualFee: string;
  joiningFee: string;
  waiver: string;
  tradeoff: string;
};

export const categories = [
  {
    label: "Movies",
    description: "Tickets, streaming, and weekend movie plans.",
    icon: Clapperboard
  },
  {
    label: "Travel",
    description: "Flights, hotels, cabs, and airport perks.",
    icon: Plane
  },
  {
    label: "Shopping",
    description: "Online marketplaces and fashion favorites.",
    icon: ShoppingBag
  },
  {
    label: "Dining",
    description: "Restaurant bills, food delivery, and cafes.",
    icon: UtensilsCrossed
  },
  {
    label: "Fuel",
    description: "Fuel spends and commute-friendly rewards.",
    icon: Fuel
  },
  {
    label: "Electronics",
    description: "Gadgets, accessories, and major upgrades.",
    icon: Smartphone
  }
] as const;

export const subcategoryGroups = [
  { title: "Movies", options: ["BookMyShow", "PVR", "INOX"] },
  { title: "Travel", options: ["Flights", "Hotels", "MakeMyTrip"] },
  { title: "Shopping", options: ["Amazon", "Flipkart", "Myntra"] },
  { title: "Dining", options: ["Swiggy", "Zomato", "Restaurants"] },
  { title: "Fuel", options: ["HPCL", "BPCL", "Indian Oil"] },
  { title: "Electronics", options: ["Apple", "Samsung", "Croma"] }
];

export const recommendationCards = [
  {
    bank: "HDFC Bank",
    card: "Millennia Credit Card",
    badge: "#1 Best Match",
    savings: "Save \u20b98,693/year",
    description:
      "High-return lifestyle card built for online shopping, entertainment, and app-first spends.",
    benefits: ["5% cashback on top partner merchants", "Quarterly lounge milestone perks", "Easy annual fee waiver"],
    annualFee: "\u20b91,000",
    joiningFee: "\u20b91,000",
    waiver: "Spend \u20b91 lakh in a year",
    tradeoff: "Best value comes from partner merchants rather than broad offline categories."
  },
  {
    bank: "SBI Card",
    card: "Cashback Card",
    savings: "Save \u20b97,940/year",
    description:
      "Straightforward cashback-focused card for people who want simplicity across everyday online purchases.",
    benefits: ["Flat cashback style rewards", "Simple fee structure", "Works well as an all-rounder"],
    annualFee: "\u20b9999",
    joiningFee: "\u20b9999",
    waiver: "Spend threshold available",
    tradeoff: "Perks are less specialized for travel or lounge-heavy users."
  },
  {
    bank: "Axis Bank",
    card: "ACE Credit Card",
    savings: "Save \u20b97,320/year",
    description:
      "Solid utility and delivery-focused option with easy redemption and reliable monthly value.",
    benefits: ["Great for bill payments", "Useful app-based benefits", "Simple ongoing value"],
    annualFee: "\u20b9499",
    joiningFee: "\u20b9499",
    waiver: "Annual spend-based waiver",
    tradeoff: "Fewer premium travel-style benefits compared with higher-fee cards."
  },
  {
    bank: "ICICI Bank",
    card: "Amazon Pay Credit Card",
    savings: "Save \u20b96,880/year",
    description:
      "A strong fit for frequent Amazon shoppers who prefer direct savings over point tracking.",
    benefits: ["Rewards integrated into Amazon ecosystem", "No complex redemption", "Useful for regular online shopping"],
    annualFee: "Nil",
    joiningFee: "Nil",
    waiver: "Not needed",
    tradeoff: "Value is concentrated in one ecosystem rather than broader categories."
  },
  {
    bank: "IDFC FIRST",
    card: "Select Credit Card",
    savings: "Save \u20b96,220/year",
    description:
      "Balanced mid-premium card with entertainment and lifestyle benefits alongside standard rewards.",
    benefits: ["Lifestyle-oriented offers", "Flexible rewards format", "Useful introductory experience"],
    annualFee: "\u20b9499",
    joiningFee: "\u20b9499",
    waiver: "Spend-based waiver",
    tradeoff: "Reward rates may feel moderate compared with highly targeted cashback cards."
  }
] as const satisfies readonly Card[];

export const compareRows = [
  { label: "Annual savings", left: "\u20b98,693", right: "\u20b97,940", better: "left" },
  { label: "Annual fee", left: "\u20b91,000", right: "\u20b9999", better: "right" },
  { label: "Joining fee", left: "\u20b91,000", right: "\u20b9999", better: "right" },
  { label: "Reward type", left: "Cashback + merchant boosts", right: "Flat cashback", better: "left" },
  { label: "Lounge access", left: "Milestone-based", right: "Limited", better: "left" },
  { label: "Fee waiver", left: "\u20b91 lakh annual spend", right: "Spend threshold", better: "tie" },
  { label: "Best for", left: "Shopping + entertainment", right: "Simple online cashback", better: "tie" }
] as const;

