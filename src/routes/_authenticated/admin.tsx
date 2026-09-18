import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut, Plus, Trash2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CAFE, DAY_NAMES, WEEK_ORDER } from "@/lib/cafe";
import { hoursQuery, menuQuery, type MenuItem } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: `Admin Panel — ${CAFE.name}` },
      { name: "description", content: "Manage the cafe menu and trading hours." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Admin Panel — ${CAFE.name}` },
      { property: "og:description", content: "Manage the cafe menu and trading hours." },
    ],
  }),
  component: AdminPage,
});

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "Coffee",
  is_available: true,
  is_featured: false,
  sort_order: 0,
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: menu = [] } = useQuery(menuQuery);
  const { data: hours = [] } = useQuery(hoursQuery);
  const [draft, setDraft] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  const roleQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return { isAdmin: false, email: "" };
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);
      return {
        isAdmin: (data ?? []).some((r) => r.role === "admin"),
        email: userData.user.email ?? "",
      };
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["menu"] });
    qc.invalidateQueries({ queryKey: ["hours"] });
  };

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function claimAdmin() {
    setBusy(true);
    const { error } = await supabase.rpc("claim_first_admin");
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("You're now an admin.");
      roleQuery.refetch();
    }
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("menu_items").insert({
      name: draft.name,
      description: draft.description,
      price: Number(draft.price),
      category: draft.category,
      is_available: draft.is_available,
      is_featured: draft.is_featured,
      sort_order: Number(draft.sort_order) || 0,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Menu item added");
    setDraft(EMPTY);
    refresh();
  }

  async function updateItem(item: MenuItem, patch: Partial<MenuItem>) {
    const { error } = await supabase.from("menu_items").update(patch).eq("id", item.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
  }

  async function deleteItem(item: MenuItem) {
    const { error } = await supabase.from("menu_items").delete().eq("id", item.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Removed");
    refresh();
  }

  async function updateHours(
    day: number,
    patch: { open_time?: string; close_time?: string; is_closed?: boolean },
  ) {
    const { error } = await supabase.from("opening_hours").update(patch).eq("day_of_week", day);
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
  }

  const isAdmin = roleQuery.data?.isAdmin ?? false;

  return (
    <div className="mx-auto max-w-5xl px-5 py-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <img src="/favicon.ico" alt="" className="size-6 object-contain" />
            {CAFE.name}
          </p>
          <h1 className="mt-1 text-4xl text-foreground">Admin panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">{roleQuery.data?.email}</p>
        </div>
        <button onClick={signOut} className="btn-outline-hero text-sm">
          <LogOut className="size-4" /> Sign out
        </button>
      </div>

      {!roleQuery.isLoading && !isAdmin && (
        <div className="mt-8 rounded-2xl border border-border bg-secondary/60 p-6">
          <h2 className="text-2xl text-foreground">Admin access required</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account can't edit content yet. If you're the cafe owner setting this up for the
            first time, claim admin access below. Once an admin exists, this stops working.
          </p>
          <button onClick={claimAdmin} disabled={busy} className="btn-hero mt-4 text-sm">
            Claim admin access
          </button>
        </div>
      )}

      {isAdmin && (
        <Tabs defaultValue="menu" className="mt-10">
          <TabsList>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="hours">Trading hours</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-6 space-y-8">
            <form
              onSubmit={addItem}
              className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2"
            >
              <h2 className="col-span-full text-2xl text-foreground">Add a menu item</h2>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  required
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  required
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="sort">Sort order</Label>
                <Input
                  id="sort"
                  type="number"
                  value={draft.sort_order}
                  onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                  className="mt-1.5"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={draft.is_featured}
                  onCheckedChange={(v) => setDraft({ ...draft, is_featured: v })}
                />
                <Label htmlFor="featured">Feature on home page</Label>
              </div>
              <div className="flex items-end">
                <button type="submit" disabled={busy} className="btn-hero text-sm">
                  <Plus className="size-4" /> Add item
                </button>
              </div>
            </form>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {menu.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
                >
                  <div className="min-w-48 flex-1">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={item.price}
                    onBlur={(e) => {
                      const price = Number(e.target.value);
                      if (price !== Number(item.price)) updateItem(item, { price });
                    }}
                    className="w-28"
                  />
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Switch
                      checked={item.is_available}
                      onCheckedChange={(v) => updateItem(item, { is_available: v })}
                    />
                    Available
                  </label>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Switch
                      checked={item.is_featured}
                      onCheckedChange={(v) => updateItem(item, { is_featured: v })}
                    />
                    Featured
                  </label>
                  <button
                    onClick={() => deleteItem(item)}
                    aria-label={`Delete ${item.name}`}
                    className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hours" className="mt-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {WEEK_ORDER.map((day) => {
                const row = hours.find((h) => h.day_of_week === day);
                if (!row) return null;
                return (
                  <div
                    key={day}
                    className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
                  >
                    <span className="w-28 font-semibold text-foreground">{DAY_NAMES[day]}</span>
                    <Input
                      type="time"
                      defaultValue={row.open_time?.slice(0, 5)}
                      disabled={row.is_closed}
                      onBlur={(e) => updateHours(day, { open_time: e.target.value })}
                      className="w-36"
                    />
                    <Input
                      type="time"
                      defaultValue={row.close_time?.slice(0, 5)}
                      disabled={row.is_closed}
                      onBlur={(e) => updateHours(day, { close_time: e.target.value })}
                      className="w-36"
                    />
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Switch
                        checked={row.is_closed}
                        onCheckedChange={(v) => updateHours(day, { is_closed: v })}
                      />
                      Closed
                    </label>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
