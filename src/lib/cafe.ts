export const CAFE = {
  name: "VillageBoys Tasty Hub",
  tagline: "Bold coffee. Big feeds. Adelaide CBD.",
  address: "1/288 Waymouth St, Adelaide SA 5000, Australia",
  phone: "+61 411 111 991",
  phoneHref: "tel:+61411111991",
  priceRange: "$1–20 per person",
  rating: "4.7",
  reviews: "77 Google reviews",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=1%2F288+Waymouth+St+Adelaide+SA+5000",
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/" },
    { label: "Facebook", url: "https://www.facebook.com/" },
    { label: "TikTok", url: "https://www.tiktok.com/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
  ],
} as const;

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

// Display order: Monday first
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function formatTime(value: string): string {
  const [h, m] = value.split(":");
  const hour = Number(h ?? 0);
  const minute = m ?? "00";
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return minute === "00" ? `${display}${suffix}` : `${display}:${minute}${suffix}`;
}

export function formatPrice(value: number | string): string {
  return `$${Number(value).toFixed(2)}`;
}
