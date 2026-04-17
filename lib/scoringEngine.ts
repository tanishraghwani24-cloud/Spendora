import { normalizeCategory } from "./normalizeCategory";

export type Recommendation = {
  rank: number;
  card: any;
  netAnnualSavings: number;
  displaySavings: string;
  whyRecommended: string;
  tradeoff: string;
};

function unwrapData(raw: any) {
  if (Array.isArray(raw)) {
    return raw[0];
  }

  return raw;
}

export function getRecommendations(
  userInput: any,
  rawData: any
): Recommendation[] {
  const data = unwrapData(rawData);
  const cards = Array.isArray(data?.cards) ? data.cards : [];

  const primary = normalizeCategory(userInput?.primaryCategory);
  const secondary = Array.isArray(userInput?.secondaryCategories)
    ? userInput.secondaryCategories.map((c: string) => normalizeCategory(c)).filter(Boolean)
    : [];
  const spending = userInput?.spending ?? {};

  const secondarySet = new Set(secondary);
  const annualSpendingCache = new Map<string, number>();

  const getAnnualSpending = (normalizedCategoryId: string): number => {
    const cached = annualSpendingCache.get(normalizedCategoryId);
    if (cached !== undefined) {
      return cached;
    }

    const categoryKey = normalizedCategoryId.replace(/^cat_/, "");
    const monthly = Number(spending?.[categoryKey] ?? 0);
    const annual = Number.isFinite(monthly) ? monthly * 12 : 0;

    annualSpendingCache.set(normalizedCategoryId, annual);
    return annual;
  };

  const PRIMARY_SPEND = 5000 * 12;
  const SECONDARY_SPEND = 3000 * 12;

  const results: Recommendation[] = [];

  for (const card of cards) {
    let savings = 0;
    const why: string[] = [];
    let matched = false;

    const rewards = Array.isArray(card?.category_rewards) ? card.category_rewards : [];

    for (const r of rewards) {
      if (!r) {
        continue;
      }

      const id = (r.category_id || r.category || "").toLowerCase();
      const normalizedId = normalizeCategory(id);
      const rate = Number(r.reward_rate || 0);

      if (!normalizedId || !Number.isFinite(rate) || rate <= 0) {
        continue;
      }

      const annualSpending = getAnnualSpending(normalizedId);
      const rewardMultiplier = rate / 100;
      const categoryLabel = normalizedId.replace("cat_", "");

      if (primary && normalizedId === primary) {
        matched = true;
        savings += rewardMultiplier * PRIMARY_SPEND;
        savings += rewardMultiplier * annualSpending;
        why.push(`High rewards for ${categoryLabel}`);
      }

      if (secondarySet.has(normalizedId)) {
        matched = true;
        savings += rewardMultiplier * SECONDARY_SPEND;
        savings += rewardMultiplier * annualSpending;
        why.push(`Good rewards for ${categoryLabel}`);
      }
    }

    if (!matched) {
      continue;
    }

    const annualFee = Number(card?.annual_fee || 0);
    const net = savings - (Number.isFinite(annualFee) ? annualFee : 0);

    results.push({
      rank: 0,
      card,
      netAnnualSavings: net,
      displaySavings: `₹${Math.max(0, Math.round(net))}`,
      whyRecommended: why.join(", "),
      tradeoff: annualFee > 0 ? `Annual fee: ₹${annualFee}` : "No annual fee",
    });
  }

  results.sort((a, b) => b.netAnnualSavings - a.netAnnualSavings);

  const topResults = results.slice(0, 5);
  for (let i = 0; i < topResults.length; i += 1) {
    topResults[i].rank = i + 1;
  }

  return topResults;
}
