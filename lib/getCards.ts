import { supabase } from "@/lib/supabaseClient";

export type Card = Record<string, any>;

export async function getCards(): Promise<Card[]> {
  const { data, error } = await supabase
    .from("cards")
    .select("data");

  if (error || !data) {
    // Optionally log error for debugging
    // console.error("Error fetching cards:", error);
    return [];
  }

  // data is an array of rows with a 'data' property
  return data.map((item: { data: Card }) => item.data);
}
