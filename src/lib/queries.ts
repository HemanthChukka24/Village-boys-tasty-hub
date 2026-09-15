import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type OpeningHour = {
  id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  note: string;
};

export const menuQuery = queryOptions({
  queryKey: ["menu-items"],
  queryFn: async (): Promise<MenuItem[]> => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("id,name,description,price,category,is_available,is_featured,sort_order")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as MenuItem[];
  },
});

export const hoursQuery = queryOptions({
  queryKey: ["opening-hours"],
  queryFn: async (): Promise<OpeningHour[]> => {
    const { data, error } = await supabase
      .from("opening_hours")
      .select("id,day_of_week,open_time,close_time,is_closed,note")
      .order("day_of_week", { ascending: true });
    if (error) throw error;
    return (data ?? []) as OpeningHour[];
  },
});
