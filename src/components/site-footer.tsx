import { Link } from "@tanstack/react-router";
import { CAFE } from "@/lib/cafe";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <h2 className="flex items-center gap-3 font-display text-2xl tracking-wide text-foreground">
            <img src="/favicon.ico" alt="" className="size-10 object-contain" />
            {CAFE.name}
          </h2>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{CAFE.tagline}</p>
          <p className="mt-4 text-sm text-muted-foreground">{CAFE.priceRange}</p>
        </div>
        <div className="text-sm">
          <h3 className="font-display text-lg tracking-wide text-foreground">Find us</h3>
          <p className="mt-3 text-muted-foreground">{CAFE.address}</p>
          <a href={CAFE.phoneHref} className="mt-2 block text-primary hover:underline">
            {CAFE.phone}
          </a>
          <a
            href={CAFE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block text-primary hover:underline"
          >
            Get directions
          </a>
        </div>
        <div className="text-sm">
          <h3 className="font-display text-lg tracking-wide text-foreground">Explore</h3>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/menu" className="text-muted-foreground hover:text-primary">
              Menu
            </Link>
            <Link to="/hours" className="text-muted-foreground hover:text-primary">
              Trading hours
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary">
              Contact
            </Link>
            <Link to="/admin" className="text-muted-foreground hover:text-primary">
              Staff login
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {CAFE.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © 2026{" "}
        <strong className="text-foreground">
          <img
            src="/favicon.ico"
            alt=""
            className="mr-1 inline-block size-4 object-contain align-middle"
          />
          {CAFE.name}
        </strong>{" "}
        — {CAFE.tagline}. All rights reserved | Designed and Developed by{" "}
        <a
          href="https://www.vikrin.com"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-foreground hover:underline"
        >
          Vikrin Pvt Ltd
        </a>
      </div>
    </footer>
  );
}
