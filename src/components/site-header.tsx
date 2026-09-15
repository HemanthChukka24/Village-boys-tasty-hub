import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { CAFE } from "@/lib/cafe";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/hours", label: "Trading Hours" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/95 shadow-elegant backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src="/favicon.ico" alt="" className="size-10 object-contain" />
          <span className="font-display text-xl tracking-wide text-foreground sm:text-2xl">
            {CAFE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="text-sm font-semibold uppercase tracking-wider text-foreground/80 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <a href={CAFE.phoneHref} className="btn-hero text-sm">
            Order now
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 pb-5 pt-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-sm font-semibold uppercase tracking-wider text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a href={CAFE.phoneHref} className="btn-hero mt-4 inline-flex text-sm">
            Order now
          </a>
        </nav>
      )}
    </header>
  );
}
