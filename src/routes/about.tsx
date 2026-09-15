import { createFileRoute, Link } from "@tanstack/react-router";

import baristaImg from "@/assets/barista.jpg";
import burgerImg from "@/assets/burger.jpg";
import brunchImg from "@/assets/brunch.jpg";
import interiorImg from "@/assets/cafe-interior.jpg";
import { PageHero } from "./menu";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — VillageBoys Tasty Hub, Adelaide CBD" },
      {
        name: "description",
        content:
          "A locally owned, family-run cafe and takeaway in the heart of Adelaide CBD serving fusion comfort food, bold coffee and friendly service.",
      },
      { property: "og:title", content: "About VillageBoys Tasty Hub" },
      {
        property: "og:description",
        content: "Family-run Adelaide cafe serving real food with genuine hospitality.",
      },
    ],
  }),
  component: AboutPage,
});

const REVIEWS = [
  "Hi there, I ordered the Breakfast Wrap and Coffee, and Croissant.",
  "Great place, great service and amazing food.",
  "Amazing value for money and being served with a smile by the kind staff.",
];

function AboutPage() {
  return (
    <>
      <PageHero
        image={baristaImg}
        eyebrow="Our story"
        title="Real food, fast service"
        subtitle="Proudly serving the Adelaide community with genuine hospitality."
      />

      <section className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-lg text-muted-foreground">
          VillageBoys Tasty Hub is a locally owned, family-run cafe and takeaway spot located in the
          heart of Adelaide CBD. We serve bold coffee, hearty brunches, juicy burgers and comfort
          food classics — all made fresh with quality ingredients and a whole lot of flavour.
        </p>
        <p className="mt-4 text-lg text-muted-foreground">
          From your morning coffee fix to satisfying meal deals for lunch and dinner, we're built
          for big cravings and busy days. Enjoy dine-in seating or grab a quick takeaway — we've got
          something for everyone.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {["Signature meals", "Friendly service", "Fusion comfort food"].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl text-foreground sm:text-5xl">What locals say</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((quote) => (
              <blockquote
                key={quote}
                className="shadow-elegant rounded-2xl border border-border bg-card p-6 text-muted-foreground"
              >
                <p className="text-lg text-foreground">“{quote}”</p>
                <footer className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                  Google review
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-4xl text-foreground sm:text-5xl">Inside the hub</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { src: interiorImg, alt: "Cafe seating and coffee counter" },
            { src: burgerImg, alt: "Cheeseburger with chips" },
            { src: brunchImg, alt: "Breakfast wrap with coffee" },
          ].map((img) => (
            <img
              key={img.alt}
              src={img.src}
              alt={img.alt}
              width={1200}
              height={900}
              loading="lazy"
              className="h-64 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
        <div className="mt-10">
          <Link to="/menu" className="btn-hero text-sm">
            Browse the menu
          </Link>
        </div>
      </section>
    </>
  );
}
