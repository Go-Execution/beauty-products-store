-- ==========================================================
-- Baraka Beauty Store — Supabase Database Schema
-- Run this script inside your Supabase project's SQL Editor.
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    size TEXT,
    image TEXT NOT NULL,
    secondary_image TEXT,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    ingredients TEXT,
    directions TEXT,
    variants JSONB DEFAULT '[]'::jsonb,
    stock_quantity INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    order_notes TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'card', 'bank_transfer')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_reference TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Order Items Table (Detailed Normalized Items)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Row Level Security (RLS) Setup
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
CREATE POLICY "Allow public read access to products" 
ON public.products FOR SELECT USING (true);

-- Allow public product insertion, update, delete (Admin operations)
DROP POLICY IF EXISTS "Allow public product insertion" ON public.products;
CREATE POLICY "Allow public product insertion" 
ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public product update" ON public.products;
CREATE POLICY "Allow public product update" 
ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public product delete" ON public.products;
CREATE POLICY "Allow public product delete" 
ON public.products FOR DELETE USING (true);

-- Allow public checkout order insertion
DROP POLICY IF EXISTS "Allow public order insertion" ON public.orders;
CREATE POLICY "Allow public order insertion" 
ON public.orders FOR INSERT WITH CHECK (true);

-- Allow public order items insertion
DROP POLICY IF EXISTS "Allow public order_items insertion" ON public.order_items;
CREATE POLICY "Allow public order_items insertion" 
ON public.order_items FOR INSERT WITH CHECK (true);

-- Allow reading orders (for admin / order lookups)
DROP POLICY IF EXISTS "Allow public order read" ON public.orders;
CREATE POLICY "Allow public order read" 
ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public order update" ON public.orders;
CREATE POLICY "Allow public order update" 
ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public order_items read" ON public.order_items;
CREATE POLICY "Allow public order_items read" 
ON public.order_items FOR SELECT USING (true);

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);


-- 7. Initial Seed: Handcrafted Products Catalog
INSERT INTO public.products (id, name, category, price, size, image, description, long_description, ingredients, directions, stock_quantity, is_active)
VALUES
  ('1', 'Amazing Hair Growth Shampoo', 'Hair Care', 13.99, '1.235 lb (~20 oz)', '/assets/images/products/shampoo.jpeg', 'Pure botanical hair growth shampoo formulated without harsh parabens or sulfates.', 'A pure, restorative hair growth shampoo handcrafted with nourishing aloe vera and nutrient-dense botanical oils. Gently purifies hair and scalp while stimulating robust, resilient hair follicles. Free from parabens, sulfates, and synthetic chemicals.', 'Shampoo base, Aloe Vera Gel, Vitamin E Oil, Lavender Essential Oil, Jojoba Oil. (No Paraben, No Sulfate, No Chemical)', 'Apply small amounts on wet hair, massage into scalp, and rinse. Shake well before use.', 50, true),
  ('2', 'Miracle Hair Oil', 'Hair Care', 12.99, '0.540 lb (~8.6 oz)', '/assets/images/products/hair-oil.jpeg', 'Potent botanical hair and scalp infusion powered by rosemary, castor oil, and biotin.', 'An ultra-nourishing elixir of cold-pressed botanical oils, rosemary, lavender, and biotin designed to awaken dormant follicles, invigorate circulation, strengthen hair strands, and seal in luminous shine.', 'Coconut Oil, Castor Oil, Rosemary, Lavender Oil, Sesame Oil, Vitamin E, Jojoba Oil, Biotin Oil, Wheat Germ Oil, Black Pepper Oil.', 'Apply to hair and scalp, leave it on for 2 hours, and wash out with shampoo.', 50, true),
  ('3', 'Amazing Cream for Frizzy Hair', 'Hair Care', 12.99, '0.816 lb (~13 oz)', '/assets/images/products/frizzy-hair-cream.jpeg', 'Nourishing anti-frizz leave-in treatment that smooths, seals moisture, and adds glossy softness.', 'Specially whipped to tame stubborn flyaways and frizz while restoring touchable softness. Works deep into cuticles to lock in moisture, enhance manageability, and protect strands against daily humidity.', 'Vaseline, Coconut Oil, Glycerin, Vitamin E Oil.', 'Work a small amount into damp or dry hair, focusing on mid-lengths and frizzy ends.', 50, true),
  ('4', 'Rapunzel Hair Growth Spray', 'Hair Care', 11.99, '0.916 lb (~14.6 oz)', '/assets/images/products/rapunzel-spray.jpeg', 'Traditional fermented rice water, flaxseed, and spiced herbal botanical growth spray.', 'Rooted in ancestral beauty rituals, this energizing spray blends fermented rice water, nutrient-rich flaxseed, black seed, and warm spiced extracts to fortify hair fibers, reduce shedding, and stimulate long, thick growth.', 'Flaxseed, Fermented Rice Water, Black Seed, Bay Leaves, Cinnamon Stick, Cloves.', 'Shake well before use. Spray evenly on hair and scalp, leave for 2 hours, then wash with shampoo. Use 3 times a week. Keep refrigerated.', 50, true),
  ('5', '"Smell Me" Roll-On Oil Perfume', 'Perfumes & Oils', 10.99, '10 ml Roll-on', '/assets/images/products/smell-me-rollon.jpeg', 'Concentrated artisanal perfume oil featuring romantic florals, noble attar, and sweet rose.', 'A pure, concentrated oil perfume crafted with moisturizing sweet almond oil and an opulent blend of rose, Sabaya, Ahlam Al Arab, and Anfar oils. Glides gently over pulse points for an alluring, long-lasting scent that evolves throughout the day.', 'Almond Oil, Rose Oil, Sabaya Oil, Ahlam Al Arab Oil, Anfar Oil.', 'Roll onto pulse points (wrists, neck, and behind ears).', 50, true),
  ('6', '"Smells Great" Artisanal Perfume', 'Perfumes & Oils', 11.99, 'Signature Bottle with Gold Cap', '/assets/images/products/smells-great-perfume.jpeg', 'Handcrafted artisanal personal fragrance featuring calming lavender and warm sandalwood.', 'Handcrafted artisanal personal fragrance (not an oil perfume). Masterfully blended with notes of calming French lavender, regal Australian sandalwood, and sumptuous Ehsas oils over a crisp, fine fragrance base.', 'Ehsas Oil, Lavender Oil, Sandalwood Oil, fine perfume base top.', 'Mist onto pulse points and clothing for an elegant, all-day personal fragrance.', 50, true),
  ('7', 'Snow White Body Treatment Cream', 'Body Care', 39.99, '1.999 lb (~32 oz jar)', '/assets/images/products/snow-white-cream.jpeg', 'Intensive spa-grade brightening & skin resurfacing Moroccan body treatment cream.', 'A luxurious, intensive brightening treatment cream formulated with citric soap, pure shea butter, vitamin E, raw honey, and rose water. Deeply exfoliates, softens rough patches, and restores an even, radiant porcelain glow across the entire body.', 'Citric Soap, Jergens, Shea Butter, Vitamin E Oil, Honey, Rose Water.', 'Apply one layer, let dry, then apply another layer. Use with a little warm water and scrub with a Moroccan loofah. Use daily or every other day. Keep refrigerated.', 50, true),
  ('8', 'Arab Oud Delicate Body Cream', 'Body Care', 12.99, '0.366 lb (~5.8 oz)', '/assets/images/products/arab-oud-cream.jpeg', 'Velvety body cream infused with authentic agarwood oud, sandalwood, and musk.', 'An enchanting, velvety cream crafted specifically for sensitive areas, neckline, and intimate pulse points. Imbued with pure agarwood oud, soothing sandalwood, musk powder, and Sensul oils for velvety skin and an intoxicating aroma.', 'Oud Oil, Sandalwood Oil, Anfar Oil, Musk Powder, Vaseline, Sensul Oil.', 'Apply gently around delicate/private areas, neckline, and under the chest.', 50, true),
  ('10', 'Hibiscus Glow Facial Soap', 'Artisan Soaps', 9.99, 'Artisan Bar', '/assets/images/products/hibiscus-soap.jpeg', 'Brightens face, evens out skin tone, and leaves skin deeply moisturized.', 'Handcrafted artisan botanical bar infused with natural crushed hibiscus and plant glycerin. Naturally rich in AHAs and antioxidants, it gently buffs away dullness while leaving your complexion clear, luminous, and supple.', 'Pure Hibiscus, plant glycerin soap.', 'Lather between hands with warm water, gently massage onto face in circular motions, and rinse clean.', 50, true),
  ('11', 'Frankincense Radiance Soap', 'Artisan Soaps', 9.99, 'Artisan Bar', '/assets/images/products/frankincense-soap.jpeg', 'Calms, restores softness, and gives skin a refreshed, radiant finish.', 'Crafted with precious frankincense liquid, restorative aloe vera, and pure glycerin soap. Soothes inflammation, calms irritation, and encourages skin regeneration for a supple, refined texture.', 'Frankincense liquid, glycerin soap & aloe vera.', 'Work into a velvety lather with warm water, apply over damp skin, and rinse cleanly.', 50, true),
  ('12', 'Coffee & Cocoa Exfoliating Soap', 'Artisan Soaps', 9.99, 'Artisan Bar', '/assets/images/products/coffee-cocoa-soap.jpeg', 'Gentle natural exfoliation to soften and brighten the skin.', 'Handcrafted artisan soap combining freshly ground coffee beans and pure cocoa with natural glycerin soap. Delivers stimulating physical exfoliation that buffs away dead skin cells, softens dry elbows and heels, and leaves an irresistible warmth.', 'Handcrafted coffee, cocoa, and pure glycerin soap with no additional chemicals.', 'Gently massage bar over wet skin to naturally exfoliate and stimulate circulation. Rinse with warm water.', 50, true),
  ('13', 'Pure Lemon Radiance Soap', 'Artisan Soaps', 9.99, 'Artisan Bar', '/assets/images/products/lemon-radiance-soap.jpeg', 'Clarifies pores and restores a youthful natural glow.', 'Infused with cold-pressed pure citric oil and a gentle plant glycerin soap base. Cleanses deep within the pores, regulates excess oil, and leaves your skin feeling invigorated, vibrant, and radiantly smooth.', 'Pure citric oil & plant glycerin soap base.', 'Lather with water, gently massage over skin to cleanse, and rinse thoroughly.', 50, true),
  ('14', 'Purple Floral & Pearl Glass Candle', 'Candles', 9.99, 'Decorative Glass Fishbowl', '/assets/images/products/candle-purple-floral.jpeg', 'Decorative glass bowl with preserved purple botanicals, luminous pearls, and scented wax.', 'A breathtaking decorative artisan candle poured into a clear glass fishbowl. Features preserved purple botanicals and lustrous pearls encased in crystal clear gel, crowned with aromatic purple wax for a soothing visual and aromatic centerpiece.', 'Scented wax, crystal gel, preserved purple botanicals, luminous pearls, cotton wick.', 'Trim wick to 1/4 inch before lighting. Burn within sight on a heat-resistant surface away from drafts.', 50, true),
  ('15', 'Amethyst & Glass Gems Candle', 'Candles', 9.99, 'Decorative Glass Fishbowl', '/assets/images/products/candle-amethyst-gems.jpeg', 'Purple scented wax floating over colorful glass gems and crystal gel.', 'Artisan handcrafted candle featuring scented purple wax resting gracefully atop colorful polished glass gems submerged in luminous crystal gel. Illuminates with shimmering multi-faceted reflections when lit.', 'Purple scented wax, crystal gel, colorful glass gems, fragrance oils, lead-free wick.', 'Place on a heat-safe surface. Light wick and allow fragrance to disperse evenly.', 50, true),
  ('16', 'Golden Pearl Glow Candle', 'Candles', 9.99, 'Decorative Glass Fishbowl', '/assets/images/products/candle-golden-pearl.jpeg', 'Rich aromatic wax over golden pearls in crystal gel.', 'Elegance in a glass bowl: handcrafted with shimmering golden pearls suspended in ultra-clear gel, topped with a generous layer of fragrant poured wax. Radiates warmth and opulence throughout any room.', 'Aromatic wax, golden pearls, crystal gel, premium fragrance oils, cotton wick.', 'Keep wick trimmed. Burn 2-3 hours per session for optimal scent throw and longevity.', 50, true),
  ('17', 'Sunburst Pearl Glass Candle', 'Candles', 9.99, 'Decorative Glass Fishbowl', '/assets/images/products/candle-sunburst-pearl.jpeg', 'Sunny citrus-colored wax over pearls and iridescent crystal marbles.', 'A burst of warm sunshine captured in glass. Scented sunburst-orange wax poured over pearlescent spheres and iridescent crystal marbles in clear gel. Brings an uplifting aura, cheerful light, and fresh fragrance.', 'Citrus-scented colored wax, pearls, iridescent crystal marbles, clear gel, cotton wick.', 'Trim wick before lighting. Keep away from flammable objects and breezy areas.', 50, true),
  ('18', 'Ocean Azure & Pearl Glass Candle', 'Candles', 9.99, 'Decorative Glass Fishbowl', '/assets/images/products/candle-ocean-azure.jpeg', 'Deep ocean blue wax over preserved blue petals and pearls in clear gel.', 'Inspired by tranquil coastal waters. Deep ocean blue scented wax floats over hand-placed blue botanical petals and glistening white pearls in transparent gel. Transports your senses to a peaceful sanctuary.', 'Ocean breeze scented wax, preserved blue petals, white pearls, crystal gel, cotton wick.', 'Burn on a level, fire-resistant surface. Extinguish gently when finished.', 50, true)
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  stock_quantity = EXCLUDED.stock_quantity;
