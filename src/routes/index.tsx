import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Phone, Star } from "lucide-react";

import heroVideo from "@/assets/hero-food.mp4";
import heroPoster from "@/assets/hero-poster.jpg";
import burgerImg from "@/assets/burger.jpg";
import brunchImg from "@/assets/brunch.jpg";
import interiorAsset from "@/assets/cafe-interior.jpg";
import { CAFE, DAY_NAMES, formatPrice, formatTime, WEEK_ORDER } from "@/lib/cafe";
import { hoursQuery, menuQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Village Boys — Tasty Hub, Cafe & Takeaway, Adelaide CBD" },
      {
        name: "description",
        content:
          "Locally owned Adelaide CBD cafe serving bold coffee, hearty brunches and juicy burgers on Waymouth Street. Dine in, takeaway, collection or delivery.",
      },
      { property: "og:title", content: "Village Boys — Tasty Hub, Cafe & Takeaway, Adelaide CBD" },
      {
        property: "og:description",
        content: "Bold coffee, big brunches and juicy burgers in the heart of Adelaide.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: menu = [] } = useQuery(menuQuery);
  const { data: hours = [] } = useQuery(hoursQuery);
  const featured = menu.filter((m) => m.is_featured && m.is_available).slice(0, 6);
  const today = hours.find((h) => h.day_of_week === new Date().getDay());

  return (
    <>
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 size-full object-cover"
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="bg-gradient-dark absolute inset-0" />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative mx-auto max-w-3xl px-5 pt-24 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-background/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-background backdrop-blur">
            <Star className="size-3.5" /> {CAFE.rating} · {CAFE.reviews}
          </p>
          <h1 className="mt-6 font-display text-5xl leading-none text-background sm:text-7xl md:text-8xl">
            {CAFE.name}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-background/90">
            Juicy burgers, big brekkies and authentic Hyderabadi biryani — made fresh in the heart
            of Adelaide CBD.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/menu" className="btn-hero">
              View the menu
            </Link>
            <a
              href={CAFE.orderUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-background px-6 py-[0.7rem] text-sm font-bold uppercase tracking-[0.08em] text-background transition-colors hover:bg-background hover:text-foreground"
            >
              <Phone className="size-4" /> Order now
            </a>

          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-3">
          <InfoTile
            icon={<Clock className="size-5 text-primary" />}
            title="Today"
            value={
              today
                ? today.is_closed
                  ? "Closed today"
                  : `${formatTime(today.open_time)} – ${formatTime(today.close_time)}`
                : "6:59am – 2:30pm"
            }
          />
          <InfoTile
            icon={<MapPin className="size-5 text-primary" />}
            title="Find us"
            value="1/288 Waymouth St, Adelaide"
          />
          <InfoTile
            icon={<Phone className="size-5 text-primary" />}
            title="Call & collect"
            value={CAFE.phone}
          />
        </div>
      </section>

      <section className="section mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <img
            src={interiorAsset}
            alt="Village Boys storefront on Waymouth Street, Adelaide"
            width={1600}
            height={1000}
            loading="lazy"
            className="shadow-elegant rounded-2xl object-cover"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">About us</p>
            <h2 className="mt-3 text-4xl text-foreground sm:text-5xl">
              Built for big cravings and busy days
            </h2>
            <p className="mt-4 text-muted-foreground">
              We're a locally owned, family-run cafe and takeaway spot in the Adelaide CBD. From
              your morning coffee fix to satisfying meal deals for lunch, everything is made fresh
              with quality ingredients and a whole lot of flavour.
            </p>
            <p className="mt-3 text-muted-foreground">
              Signature meals · Friendly service · Fusion comfort food
            </p>
            <Link to="/about" className="btn-outline-hero mt-6 text-sm">
              Our story
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Customer favourites
              </p>
              <h2 className="mt-3 text-4xl text-foreground sm:text-5xl">Signature picks</h2>
            </div>
            <Link to="/menu" className="btn-hero text-sm">
              Full menu
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <article
                key={item.id}
                className="shadow-elegant rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl text-foreground">{item.name}</h3>
                  <span className="font-display text-xl text-primary">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                <span className="mt-4 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
                  {item.category}
                </span>
              </article>
            ))}
            {featured.length === 0 && (
              <p className="text-muted-foreground">Menu highlights are being updated.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section mx-auto max-w-6xl px-5">
        <div className="grid gap-6 md:grid-cols-2">
          <figure className="relative overflow-hidden rounded-2xl">
            <img
              src={burgerImg}
              alt="Hungry Man burger with chips"
              width={1200}
              height={900}
              loading="lazy"
              className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <figcaption className="absolute bottom-0 w-full bg-gradient-to-t from-foreground/80 to-transparent p-6 font-display text-3xl text-background">
              Burgers & big feeds
            </figcaption>
          </figure>
          <figure className="relative overflow-hidden rounded-2xl">
            <img
              src={brunchImg}
              alt="Breakfast wrap, coffee and croissant"
              width={1200}
              height={900}
              loading="lazy"
              className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <figcaption className="absolute bottom-0 w-full bg-gradient-to-t from-foreground/80 to-transparent p-6 font-display text-3xl text-background">
              Brunch & barista coffee
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-sidebar py-16 text-sidebar-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2">
          <div>
            <h2 className="text-4xl sm:text-5xl">Trading hours</h2>
            <p className="mt-3 text-sidebar-foreground/70">
              Open Monday to Saturday for dine in, takeaway, collection and delivery.
            </p>
            <Link to="/hours" className="btn-hero mt-6 text-sm">
              See full hours
            </Link>
          </div>
          <ul className="divide-y divide-sidebar-border">
            {WEEK_ORDER.map((day) => {
              const row = hours.find((h) => h.day_of_week === day);
              return (
                <li key={day} className="flex items-center justify-between py-3">
                  <span className="font-semibold">{DAY_NAMES[day]}</span>
                  <span className="text-sidebar-foreground/80">
                    {!row
                      ? "—"
                      : row.is_closed
                        ? "Closed"
                        : `${formatTime(row.open_time)} – ${formatTime(row.close_time)}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}

function InfoTile({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
