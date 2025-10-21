export const INGREDIENTS = [
  { id: "ing-1", name: "Quail Egg" },
  { id: "ing-2", name: "Spinach" },
  { id: "ing-3", name: "Crab Stick" },
  { id: "ing-4", name: "Tofu" },
  { id: "ing-5", name: "Mushroom" },
  { id: "ing-6", name: "Lotus Root" },
  { id: "ing-7", name: "Fish Ball" },
  { id: "ing-8", name: "Beef Slice" },
  { id: "ing-9", name: "Pork Slice" },
  { id: "ing-10", name: "Bok Choy" },
  { id: "ing-11", name: "Napa Cabbage" },
  { id: "ing-12", name: "Enoki Mushroom" },
];

export function getIngredientById(id: string): string {
  return INGREDIENTS.find((i) => i.id === id)?.name ?? "Unknown";
}
