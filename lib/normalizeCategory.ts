export function normalizeCategory(input?: string | null): string {
  const value = (input ?? "").toString().trim().toLowerCase();

  if (!value) {
    return "";
  }

  // Keep category ids stable and dynamic across any incoming label format.
  const base = value.replace(/^cat_/, "").replace(/[\s-]+/g, "_");

  return `cat_${base}`;
}