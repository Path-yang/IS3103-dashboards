import type { OrderRecord } from "@/lib/types";
import { generateOutlets } from "./outlets";

const INGREDIENTS = [
  { id: "beef", name: "Beef Slices", category: "protein" },
  { id: "lamb", name: "Lamb Slices", category: "protein" },
  { id: "pork", name: "Pork Slices", category: "protein" },
  { id: "chicken", name: "Chicken Slices", category: "protein" },
  { id: "tofu", name: "Tofu", category: "protein" },
  { id: "cabbage", name: "Cabbage", category: "veg" },
  { id: "spinach", name: "Spinach", category: "veg" },
  { id: "mushroom", name: "Mushrooms", category: "veg" },
  { id: "bok-choy", name: "Bok Choy", category: "veg" },
  { id: "corn", name: "Sweet Corn", category: "veg" },
  { id: "noodle-thick", name: "Thick Noodles", category: "noodles" },
  { id: "noodle-thin", name: "Thin Noodles", category: "noodles" },
  { id: "glass-noodle", name: "Glass Noodles", category: "noodles" },
  { id: "egg", name: "Egg", category: "addons" },
  { id: "century-egg", name: "Century Egg", category: "addons" },
];

const SOUP_BASES = ["Original Mala", "Tomato", "Mushroom", "Spicy Sichuan"];
const SPICE_LEVELS = ["Mild", "Medium", "Spicy"] as const;

export function generateOrders(): OrderRecord[] {
  const outlets = generateOutlets();
  const orders: OrderRecord[] = [];
  const now = Date.now();
  const daysBack = 90;

  // Generate 2000-5000 orders over 90 days
  const orderCount = 2500 + Math.floor(Math.random() * 2500);

  for (let i = 0; i < orderCount; i++) {
    const outlet = outlets[Math.floor(Math.random() * outlets.length)];
    const daysAgo = Math.random() * daysBack;
    const hour = Math.floor(Math.random() * 14) + 10; // 10am-11pm
    const timestamp = new Date(now - daysAgo * 86400000);
    timestamp.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

    // Pick 3-8 ingredients
    const itemCount = 3 + Math.floor(Math.random() * 6);
    const selectedIngredients = [...INGREDIENTS]
      .sort(() => Math.random() - 0.5)
      .slice(0, itemCount);

    const items = selectedIngredients.map((ing) => ({
      ingredientId: ing.id,
      name: ing.name,
      category: ing.category,
      qty: 1 + Math.floor(Math.random() * 2),
      weightGrams: 80 + Math.floor(Math.random() * 120),
    }));

    const basePrice = 8 + Math.random() * 7; // $8-$15
    const spend = Math.round((basePrice + items.length * 1.5) * 100) / 100;

    orders.push({
      id: `ord-${i + 1}`,
      customerId: `cust-${Math.floor(Math.random() * 150) + 1}`,
      outletId: outlet.id,
      outletName: outlet.name,
      tsISO: timestamp.toISOString(),
      items,
      spend,
      soupBase: SOUP_BASES[Math.floor(Math.random() * SOUP_BASES.length)],
      spiceLevel: SPICE_LEVELS[Math.floor(Math.random() * SPICE_LEVELS.length)],
    });
  }

  return orders.sort((a, b) => 
    new Date(b.tsISO).getTime() - new Date(a.tsISO).getTime()
  );
}

export function getTopIngredients(orders: OrderRecord[], limit = 10) {
  const counts: Record<string, { name: string; count: number; category: string }> = {};
  
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!counts[item.ingredientId]) {
        counts[item.ingredientId] = { 
          name: item.name, 
          count: 0, 
          category: item.category 
        };
      }
      counts[item.ingredientId].count += item.qty;
    });
  });

  return Object.entries(counts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, limit)
    .map(([id, data]) => ({ ingredientId: id, ...data }));
}

