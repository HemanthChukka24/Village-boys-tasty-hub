import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import interiorAsset from "@/assets/cafe-interior.jpg";
import { CAFE, DAY_NAMES, formatTime, WEEK_ORDER } from "@/lib/cafe";
import { hoursQuery } from "@/lib/queries";
import { PageHero } from "./menu";

export const Route = createFileRoute("/hours")({
  head: () => ({
    meta: [
      { title: "Trading Hours — VillageBoys Tasty Hub, Adelaide" },
      {
        name: "description",
        content:
          "Opening and closing times for VillageBoys Tasty Hub on Waymouth St, Adelaide CBD. Open Monday to Saturday, 6:59am to 2:30pm.",
      },
      { property: "og:title", content: "Trading Hours — VillageBoys Tasty Hub" },
      {
        property: "og:description",
        content: "When we're open on Waymouth St, Adelaide CBD.",
      },
    ],
  }),
  component: HoursPage,
});

function HoursPage() {
  const { data: hours = [] } = useQuery(hoursQuery);
  const todayIndex = new Date().getDay();

  return (
    <>
      <PageHero
        image={interiorAsset}
        eyebrow="Monday to Saturday"
        title="Trading hours"
        subtitle="Morning coffee, lunch rush or an afternoon feed — here's when we're on."
      />

      <div className="mx-auto max-w-3xl px-5 py-16">
        <ul className="shadow-elegant overflow-hidden rounded-2xl border border-border bg-card">
          {WEEK_ORDER.map((day) => {
            const row = hours.find((h) => h.day_of_week === day);
            const isToday = day === todayIndex;
            return (
              <li
                key={day}
                className={`flex items-center justify-between border-b border-border px-6 py-4 last:border-b-0 ${
                  isToday ? "bg-secondary" : ""
                }`}
              >
                <span className="font-semibold text-foreground">
                  {DAY_NAMES[day]}
                  {isToday && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                      Today
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {!row
                    ? "—"
                    : row.is_closed
                      ? "Closed"
                      : `${formatTime(row.open_time)} – ${formatTime(row.close_time)}`}
                  {row?.note ? ` · ${row.note}` : ""}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 rounded-2xl border border-border bg-secondary/60 p-6">
          <h2 className="text-2xl text-foreground">Public holidays</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hours can change on public holidays. Give us a call on{" "}
            <a href={CAFE.phoneHref} className="text-primary hover:underline">
              {CAFE.phone}
            </a>{" "}
            to confirm before you head in.
          </p>
        </div>
      </div>
    </>
  );
}
