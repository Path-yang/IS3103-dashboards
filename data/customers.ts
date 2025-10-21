import type { CustomerProfile, Recommendation } from "@/lib/types";

const TIERS = ["Bronze", "Silver", "Gold", "Platinum"] as const;

const FAVOURITES = [
  "Beef + Thick Noodles + Spicy",
  "Lamb + Mushrooms + Medium Spice",
  "Tofu + Glass Noodles + Mild",
  "Chicken + Bok Choy + Medium",
  "Pork + Cabbage + Spicy",
  "Mixed Protein + Vegetables",
  "Beef + Spinach + Sichuan Soup",
];

export function generateCustomers(): CustomerProfile[] {
  const customers: CustomerProfile[] = [];

  for (let i = 1; i <= 150; i++) {
    const visits = Math.floor(Math.random() * 50) + 1;
    const avgSpend = 10 + Math.random() * 15; // $10-$25
    
    let tier: typeof TIERS[number] = "Bronze";
    if (visits > 30) tier = "Platinum";
    else if (visits > 20) tier = "Gold";
    else if (visits > 10) tier = "Silver";

    customers.push({
      id: `cust-${i}`,
      tier,
      avgSpend: Math.round(avgSpend * 100) / 100,
      visits,
      favouriteCombo: FAVOURITES[Math.floor(Math.random() * FAVOURITES.length)],
      preferences: {
        spice: Math.random(),
        protein: Math.random(),
        vegetables: Math.random(),
        soupBase: Math.random(),
        addons: Math.random(),
      },
    });
  }

  return customers;
}

export function getCustomerRecommendations(customerId: string): Recommendation[] {
  // Mock recommendations based on customer patterns
  const allRecs = [
    { item: "Premium Wagyu Beef", reason: "Based on your protein preferences" },
    { item: "Extra Spicy Chili Oil", reason: "Popular with similar customers" },
    { item: "Mushroom Medley", reason: "Complements your usual order" },
    { item: "Handmade Thick Noodles", reason: "Trending this week" },
    { item: "Century Egg", reason: "Pairs well with your soup base choice" },
    { item: "Fresh Tofu Skin", reason: "High protein, low calorie option" },
    { item: "Bok Choy Bundle", reason: "Nutritious addition" },
  ];

  // Return 3-5 random recommendations
  const count = 3 + Math.floor(Math.random() * 3);
  return allRecs.sort(() => Math.random() - 0.5).slice(0, count);
}

export function getSimilarCustomers(customerId: string, customers: CustomerProfile[]) {
  // Return 5 random similar customers
  return customers
    .filter((c) => c.id !== customerId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
}

