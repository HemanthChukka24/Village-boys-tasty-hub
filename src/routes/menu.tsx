import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import brunchImg from "@/assets/brunch.jpg";
import { CAFE, formatPrice } from "@/lib/cafe";
import { menuQuery } from "@/lib/queries";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: `Menu — ${CAFE.name}, Adelaide` },
      {
        name: "description",
        content:
          `Coffee, breakfast wraps, burgers, loaded fries and comfort food classics. See the full ${CAFE.name} menu and prices.`,
      },
      { property: "og:title", content: `Menu — ${CAFE.name}` },
      {
        property: "og:description",
        content: "Coffee, brunch, burgers and comfort food classics in Adelaide CBD.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { data: menu = [], isLoading } = useQuery(menuQuery);
  const available = menu.filter((m) => m.is_available);
  const categories = Array.from(new Set(available.map((m) => m.category)));

  return (
    <>
      <PageHero
        image={brunchImg}
        eyebrow="Fresh every day"
        title="Our menu"
        subtitle="Made to order with quality ingredients and a whole lot of flavour."
      />

      <div className="mx-auto max-w-5xl px-5 py-16">
        {isLoading && <p className="text-muted-foreground">Loading the menu…</p>}
        {categories.map((category) => (
          <section key={category} className="mb-14">
            <h2 className="text-3xl text-foreground sm:text-4xl">{category}</h2>
            <div className="mt-2 h-1 w-16 bg-gradient-warm" />
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {available
                .filter((m) => m.category === category)
                .map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-elegant"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl text-foreground">{item.name}</h3>
                      <span className="font-display text-lg text-primary">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        ))}
        {!isLoading && available.length === 0 && (
          <p className="text-muted-foreground">The menu is being updated — check back soon.</p>
        )}
      </div>
    </>
  );
}

export function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
}: {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative flex h-[52vh] min-h-80 items-end overflow-hidden">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="bg-gradient-dark absolute inset-0" />
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-background/80">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-5xl text-background sm:text-6xl">{title}</h1>
        <p className="mt-3 max-w-xl text-background/90">{subtitle}</p>
      </div>
    </section>
  );
}
