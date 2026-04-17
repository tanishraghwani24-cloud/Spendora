import { getCards } from "@/lib/getCards";
import ResultsClient from "./ResultsClient";

type SearchParams = Record<string, string | string[] | undefined>;

function toFirstString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function toSafeNumber(value: string | string[] | undefined): number {
  const raw = toFirstString(value);
  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : 0;
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawData = await getCards();

  const primaryParam = toFirstString(resolvedSearchParams.primary);
  const secondaryParam = toFirstString(resolvedSearchParams.secondary);
  const foodSpending = toSafeNumber(resolvedSearchParams.food);
  const travelSpending = toSafeNumber(resolvedSearchParams.travel);
  const shoppingSpending = toSafeNumber(resolvedSearchParams.shopping);

  return (
    <ResultsClient
      rawData={rawData}
      primaryParam={primaryParam}
      secondaryParam={secondaryParam}
      foodSpending={foodSpending}
      travelSpending={travelSpending}
      shoppingSpending={shoppingSpending}
    />
  );
}
