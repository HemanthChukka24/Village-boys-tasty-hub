CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'Mains',
  is_available boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Menu is public" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage menu" ON public.menu_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.opening_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL UNIQUE,
  open_time text NOT NULL DEFAULT '07:00',
  close_time text NOT NULL DEFAULT '15:00',
  is_closed boolean NOT NULL DEFAULT false,
  note text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opening_hours TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opening_hours TO authenticated;
GRANT ALL ON public.opening_hours TO service_role;
ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hours are public" ON public.opening_hours FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage hours" ON public.opening_hours FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER opening_hours_updated_at BEFORE UPDATE ON public.opening_hours FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.opening_hours (day_of_week, open_time, close_time, is_closed) VALUES
 (1,'07:00','15:00',false),(2,'07:00','15:00',false),(3,'07:00','15:00',false),
 (4,'07:00','15:00',false),(5,'07:00','15:00',false),(6,'08:00','15:00',false),(0,'08:00','14:00',false);

INSERT INTO public.menu_items (name, description, price, category, sort_order, is_featured) VALUES
 ('Flat White','Double shot house blend with silky steamed milk.',5.00,'Coffee',1,true),
 ('Cappuccino','Classic foam-topped cappuccino with a dusting of chocolate.',5.00,'Coffee',2,false),
 ('Long Black','Two shots over hot water, bold and clean.',4.50,'Coffee',3,false),
 ('Chai Latte','Spiced chai brewed with steamed milk.',5.50,'Coffee',4,false),
 ('Iced Latte','Chilled espresso over milk and ice.',6.00,'Coffee',5,false),
 ('Breakfast Wrap','Egg, bacon, cheese, rocket and smoky sauce in a toasted wrap.',12.00,'Breakfast',1,true),
 ('Big Brekkie Plate','Eggs your way, bacon, sausage, grilled tomato and sourdough.',19.00,'Breakfast',2,true),
 ('Avocado Smash','Smashed avo, feta, dukkah and lemon on toasted sourdough.',16.00,'Breakfast',3,false),
 ('Butter Croissant','Baked fresh daily, golden and flaky.',5.50,'Breakfast',4,false),
 ('Hungry Man Burger','Double beef patty, cheese, bacon, pickles and house sauce.',18.00,'Burgers',1,true),
 ('Crispy Chicken Burger','Buttermilk fried chicken, slaw and chipotle mayo.',16.50,'Burgers',2,false),
 ('Veggie Halloumi Burger','Grilled halloumi, roast capsicum, rocket and aioli.',15.50,'Burgers',3,false),
 ('Loaded Fries','Beer-battered fries with cheese, bacon and aioli.',12.00,'Sides',1,false),
 ('Beer Battered Chips','Golden chips with chicken salt and aioli.',8.00,'Sides',2,false),
 ('Onion Rings','Crunchy battered rings with smoky ketchup.',8.50,'Sides',3,false),
 ('Chicken Schnitzel & Chips','Crumbed chicken breast with chips and salad.',20.00,'Mains',1,false),
 ('Butter Chicken Bowl','Fusion favourite with rice and fresh coriander.',18.00,'Mains',2,true),
 ('Lamb Wrap','Marinated lamb, salad and garlic sauce.',16.00,'Mains',3,false),
 ('Choc Fudge Brownie','Warm brownie with cream.',7.00,'Sweets',1,false),
 ('Banana Bread','Toasted with butter.',6.00,'Sweets',2,false);