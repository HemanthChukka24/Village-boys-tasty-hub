import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CAFE } from "@/lib/cafe";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Login — VillageBoys Tasty Hub" },
      { name: "description", content: "Staff sign in for VillageBoys Tasty Hub admin panel." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Staff Login — VillageBoys Tasty Hub" },
      { property: "og:description", content: "Admin access for cafe staff." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin" });
        else toast.success("Check your email to confirm your account.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5 py-24">
      <div className="shadow-elegant w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3">
          <img src="/favicon.ico" alt="" className="size-10 object-contain" />
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{CAFE.name}</p>
        </div>
        <h1 className="mt-2 text-4xl text-foreground">
          {mode === "signin" ? "Staff login" : "Create staff account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the menu and trading hours from the admin panel.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <button type="submit" disabled={busy} className="btn-hero w-full text-sm">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 w-full text-sm text-muted-foreground hover:text-primary"
        >
          {mode === "signin"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
