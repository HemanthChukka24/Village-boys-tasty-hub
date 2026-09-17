import { createFileRoute } from "@tanstack/react-router";

import burgerImg from "@/assets/burger.jpg";
import { CAFE, DAY_NAMES, formatTime, WEEK_ORDER } from "@/lib/cafe";
import { hoursQuery } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "./menu";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Location — VillageBoys Tasty Hub, Adelaide" },
      {
        name: "description",
        content:
          "Find VillageBoys Tasty Hub at 1/288 Waymouth St, Adelaide SA 5000. Call +61 411 111 991 for collection or delivery.",
      },
      { property: "og:title", content: "Contact VillageBoys Tasty Hub" },
      {
        property: "og:description",
        content: "1/288 Waymouth St, Adelaide SA 5000. Call us for collection or delivery.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: hours = [] } = useQuery(hoursQuery);

  return (
    <>
      <PageHero
        image={burgerImg}
        eyebrow="Say hello"
        title="Contact & location"
        subtitle="Dine in, takeaway, collection or delivery — we're on Waymouth Street."
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-3xl text-foreground">Get in touch</h2>
          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="font-bold uppercase tracking-widest text-muted-foreground">Address</dt>
              <dd className="mt-1 text-base text-foreground">{CAFE.address}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-widest text-muted-foreground">Phone</dt>
              <dd className="mt-1 text-base">
                <a href={CAFE.phoneHref} className="text-primary hover:underline">
                  {CAFE.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-widest text-muted-foreground">
                Price per person
              </dt>
              <dd className="mt-1 text-base text-foreground">{CAFE.priceRange}</dd>
            </div>
            <div>
              <dt className="font-bold uppercase tracking-widest text-muted-foreground">Social</dt>
              <dd className="mt-1 flex flex-wrap gap-3">
                {CAFE.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
          <a href={CAFE.mapsUrl} target="_blank" rel="noreferrer" className="btn-hero mt-8 text-sm">
            Get directions
          </a>

          <h3 className="mt-12 text-2xl text-foreground">Opening hours</h3>
          <ul className="mt-4 divide-y divide-border text-sm">
            {WEEK_ORDER.map((day) => {
              const row = hours.find((h) => h.day_of_week === day);
              return (
                <li key={day} className="flex justify-between py-2">
                  <span className="text-foreground">{DAY_NAMES[day]}</span>
                  <span className="text-muted-foreground">
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

        <iframe
          title="Map to VillageBoys Tasty Hub"
          src="https://www.google.com/maps?q=1%2F288%20Waymouth%20St%2C%20Adelaide%20SA%205000&output=embed"
          className="h-[520px] w-full rounded-2xl"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

      </div>
    </>
  );
}
