export interface BrandPreset {
  id: string;
  name: string;
  category: string;
  defaultCost: number;
  billingCycle: "weekly" | "monthly" | "quarterly" | "yearly";
  color: string;
  cancelUrl: string;
}

export const BRAND_PRESETS: BrandPreset[] = [
  {
    id: "netflix",
    name: "Netflix 4K",
    category: "Streaming",
    defaultCost: 649,
    billingCycle: "monthly",
    color: "#E50914",
    cancelUrl: "https://www.netflix.com/youraccount",
  },
  {
    id: "spotify",
    name: "Spotify Duo",
    category: "Streaming",
    defaultCost: 149,
    billingCycle: "monthly",
    color: "#1DB954",
    cancelUrl: "https://www.spotify.com/account/subscription/",
  },
  {
    id: "prime",
    name: "Amazon Prime",
    category: "Streaming",
    defaultCost: 299,
    billingCycle: "monthly",
    color: "#00A8E1",
    cancelUrl: "https://www.amazon.in/mc/manage",
  },
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    category: "AI Tools",
    defaultCost: 1999,
    billingCycle: "monthly",
    color: "#10A37F",
    cancelUrl: "https://chatgpt.com/#settings/Subscription",
  },
  {
    id: "claude",
    name: "Claude Pro",
    category: "AI Tools",
    defaultCost: 1999,
    billingCycle: "monthly",
    color: "#D97706",
    cancelUrl: "https://claude.ai/settings/billing",
  },
  {
    id: "youtube",
    name: "YouTube Premium",
    category: "Streaming",
    defaultCost: 149,
    billingCycle: "monthly",
    color: "#FF0000",
    cancelUrl: "https://www.youtube.com/paid_memberships",
  },
  {
    id: "hotstar",
    name: "Disney+ Hotstar",
    category: "Streaming",
    defaultCost: 299,
    billingCycle: "quarterly",
    color: "#0C111B",
    cancelUrl: "https://www.hotstar.com/in/my-account",
  },
  {
    id: "icloud",
    name: "iCloud 200GB",
    category: "Cloud",
    defaultCost: 219,
    billingCycle: "monthly",
    color: "#38BDF8",
    cancelUrl: "https://support.apple.com/HT207594",
  },
  {
    id: "googleone",
    name: "Google One",
    category: "Cloud",
    defaultCost: 130,
    billingCycle: "monthly",
    color: "#4285F4",
    cancelUrl: "https://one.google.com/settings",
  },
  {
    id: "xbox",
    name: "Xbox Game Pass",
    category: "Gaming",
    defaultCost: 349,
    billingCycle: "monthly",
    color: "#107C41",
    cancelUrl: "https://account.microsoft.com/services",
  },
  {
    id: "cultfit",
    name: "Cult.fit Gym",
    category: "Gym/Health",
    defaultCost: 899,
    billingCycle: "monthly",
    color: "#EC4899",
    cancelUrl: "https://www.cult.fit/membership",
  },
];

export const CATEGORIES = [
  { name: "Streaming", color: "#8B5CF6" },
  { name: "Gym/Health", color: "#EC4899" },
  { name: "Cloud", color: "#34D399" },
  { name: "Gaming", color: "#475569" },
  { name: "AI Tools", color: "#22D3EE" },
  { name: "Work", color: "#F59E0B" },
  { name: "Utilities", color: "#94A3B8" },
  { name: "Other", color: "#64748B" },
];
