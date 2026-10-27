export interface ProductVariant {
  id: string;
  name: string; // e.g., "1 Bar (Standard)", "3-Bar Bundle", "100ml Bottle"
  price: number;
  size?: string;
  stockQuantity?: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'Hair Care' | 'Perfumes & Oils' | 'Body Care' | 'Artisan Soaps' | 'Candles' | string;
  price: number;
  compareAtPrice?: number;
  size?: string;
  image: string;
  secondaryImage?: string;
  description: string;
  longDescription: string;
  ingredients?: string;
  directions?: string;
  howToUse?: string; // alias for compatibility
  variants?: ProductVariant[];
  stockQuantity?: number;
  isActive?: boolean;
}

export const CATEGORIES = [
  'All',
  'Hair Care',
  'Perfumes & Oils',
  'Body Care',
  'Artisan Soaps',
  'Candles'
] as const;

export type Category = (typeof CATEGORIES)[number];

export const products: Product[] = [
  // 🌿 1. Hair Care Products
  {
    id: '1',
    name: 'Amazing Hair Growth Shampoo',
    category: 'Hair Care',
    price: 13.99,
    size: '1.235 lb (~20 oz)',
    image: '/assets/images/products/shampoo.jpeg',
    description: 'Pure botanical hair growth shampoo formulated without harsh parabens or sulfates.',
    longDescription: 'A pure, restorative hair growth shampoo handcrafted with nourishing aloe vera and nutrient-dense botanical oils. Gently purifies hair and scalp while stimulating robust, resilient hair follicles. Free from parabens, sulfates, and synthetic chemicals.',
    ingredients: 'Shampoo base, Aloe Vera Gel, Vitamin E Oil, Lavender Essential Oil, Jojoba Oil. (No Paraben, No Sulfate, No Chemical)',
    directions: 'Apply small amounts on wet hair, massage into scalp, and rinse. Shake well before use.',
    howToUse: 'Apply small amounts on wet hair, massage into scalp, and rinse. Shake well before use.'
  },
  {
    id: '2',
    name: 'Miracle Hair Oil',
    category: 'Hair Care',
    price: 12.99,
    size: '0.540 lb (~8.6 oz)',
    image: '/assets/images/products/hair-oil.jpeg',
    description: 'Potent botanical hair and scalp infusion powered by rosemary, castor oil, and biotin.',
    longDescription: 'An ultra-nourishing elixir of cold-pressed botanical oils, rosemary, lavender, and biotin designed to awaken dormant follicles, invigorate circulation, strengthen hair strands, and seal in luminous shine.',
    ingredients: 'Coconut Oil, Castor Oil, Rosemary, Lavender Oil, Sesame Oil, Vitamin E, Jojoba Oil, Biotin Oil, Wheat Germ Oil, Black Pepper Oil.',
    directions: 'Apply to hair and scalp, leave it on for 2 hours, and wash out with shampoo.',
    howToUse: 'Apply to hair and scalp, leave it on for 2 hours, and wash out with shampoo.'
  },
  {
    id: '3',
    name: 'Amazing Cream for Frizzy Hair',
    category: 'Hair Care',
    price: 12.99,
    size: '0.816 lb (~13 oz)',
    image: '/assets/images/products/frizzy-hair-cream.jpeg',
    description: 'Nourishing anti-frizz leave-in treatment that smooths, seals moisture, and adds glossy softness.',
    longDescription: 'Specially whipped to tame stubborn flyaways and frizz while restoring touchable softness. Works deep into cuticles to lock in moisture, enhance manageability, and protect strands against daily humidity.',
    ingredients: 'Vaseline, Coconut Oil, Glycerin, Vitamin E Oil.',
    directions: 'Work a small amount into damp or dry hair, focusing on mid-lengths and frizzy ends.',
    howToUse: 'Work a small amount into damp or dry hair, focusing on mid-lengths and frizzy ends.'
  },
  {
    id: '4',
    name: 'Rapunzel Hair Growth Spray',
    category: 'Hair Care',
    price: 11.99,
    size: '0.916 lb (~14.6 oz)',
    image: '/assets/images/products/rapunzel-spray.jpeg',
    description: 'Traditional fermented rice water, flaxseed, and spiced herbal botanical growth spray.',
    longDescription: 'Rooted in ancestral beauty rituals, this energizing spray blends fermented rice water, nutrient-rich flaxseed, black seed, and warm spiced extracts to fortify hair fibers, reduce shedding, and stimulate long, thick growth.',
    ingredients: 'Flaxseed, Fermented Rice Water, Black Seed, Bay Leaves, Cinnamon Stick, Cloves.',
    directions: 'Shake well before use. Spray evenly on hair and scalp, leave for 2 hours, then wash with shampoo. Use 3 times a week. Keep refrigerated.',
    howToUse: 'Shake well before use. Spray evenly on hair and scalp, leave for 2 hours, then wash with shampoo. Use 3 times a week. Keep refrigerated.'
  },

  // 🌸 2. Perfumes & Fragrance Oils
  {
    id: '5',
    name: '"Smell Me" Roll-On Oil Perfume',
    category: 'Perfumes & Oils',
    price: 10.99,
    size: '10 ml Roll-on',
    image: '/assets/images/products/smell-me-rollon.jpeg',
    description: 'Concentrated artisanal perfume oil featuring romantic florals, noble attar, and sweet rose.',
    longDescription: 'A pure, concentrated oil perfume crafted with moisturizing sweet almond oil and an opulent blend of rose, Sabaya, Ahlam Al Arab, and Anfar oils. Glides gently over pulse points for an alluring, long-lasting scent that evolves throughout the day.',
    ingredients: 'Almond Oil, Rose Oil, Sabaya Oil, Ahlam Al Arab Oil, Anfar Oil.',
    directions: 'Roll onto pulse points (wrists, neck, and behind ears).',
    howToUse: 'Roll onto pulse points (wrists, neck, and behind ears).'
  },
  {
    id: '6',
    name: '"Smells Great" Artisanal Perfume',
    category: 'Perfumes & Oils',
    price: 11.99,
    size: 'Signature Bottle with Gold Cap',
    image: '/assets/images/products/smells-great-perfume.jpeg',
    description: 'Handcrafted artisanal personal fragrance featuring calming lavender and warm sandalwood.',
    longDescription: 'Handcrafted artisanal personal fragrance (not an oil perfume). Masterfully blended with notes of calming French lavender, regal Australian sandalwood, and sumptuous Ehsas oils over a crisp, fine fragrance base.',
    ingredients: 'Ehsas Oil, Lavender Oil, Sandalwood Oil, fine perfume base top.',
    directions: 'Mist onto pulse points and clothing for an elegant, all-day personal fragrance.',
    howToUse: 'Mist onto pulse points and clothing for an elegant, all-day personal fragrance.'
  },

  // ✨ 3. Body & Skin Care
  {
    id: '7',
    name: 'Snow White Body Treatment Cream',
    category: 'Body Care',
    price: 39.99,
    size: '1.999 lb (~32 oz jar)',
    image: '/assets/images/products/snow-white-cream.jpeg',
    description: 'Intensive spa-grade brightening & skin resurfacing Moroccan body treatment cream.',
    longDescription: 'A luxurious, intensive brightening treatment cream formulated with citric soap, pure shea butter, vitamin E, raw honey, and rose water. Deeply exfoliates, softens rough patches, and restores an even, radiant porcelain glow across the entire body.',
    ingredients: 'Citric Soap, Jergens, Shea Butter, Vitamin E Oil, Honey, Rose Water.',
    directions: 'Apply one layer, let dry, then apply another layer. Use with a little warm water and scrub with a Moroccan loofah. Use daily or every other day. Keep refrigerated.',
    howToUse: 'Apply one layer, let dry, then apply another layer. Use with a little warm water and scrub with a Moroccan loofah. Use daily or every other day. Keep refrigerated.'
  },
  {
    id: '8',
    name: 'Arab Oud Delicate Body Cream',
    category: 'Body Care',
    price: 12.99,
    size: '0.366 lb (~5.8 oz)',
    image: '/assets/images/products/arab-oud-cream.jpeg',
    description: 'Velvety body cream infused with authentic agarwood oud, sandalwood, and musk.',
    longDescription: 'An enchanting, velvety cream crafted specifically for sensitive areas, neckline, and intimate pulse points. Imbued with pure agarwood oud, soothing sandalwood, musk powder, and Sensul oils for velvety skin and an intoxicating aroma.',
    ingredients: 'Oud Oil, Sandalwood Oil, Anfar Oil, Musk Powder, Vaseline, Sensul Oil.',
    directions: 'Apply gently around delicate/private areas, neckline, and under the chest.',
    howToUse: 'Apply gently around delicate/private areas, neckline, and under the chest.'
  },

  // 🧼 4. Artisan Soaps & Cleansers

  {
    id: '10',
    name: 'Hibiscus Glow Facial Soap',
    category: 'Artisan Soaps',
    price: 9.99,
    size: 'Artisan Bar',
    image: '/assets/images/products/hibiscus-soap.jpeg',
    description: 'Brightens face, evens out skin tone, and leaves skin deeply moisturized.',
    longDescription: 'Handcrafted artisan botanical bar infused with natural crushed hibiscus and plant glycerin. Naturally rich in AHAs and antioxidants, it gently buffs away dullness while leaving your complexion clear, luminous, and supple.',
    ingredients: 'Pure Hibiscus, plant glycerin soap.',
    directions: 'Lather between hands with warm water, gently massage onto face in circular motions, and rinse clean.',
    howToUse: 'Lather between hands with warm water, gently massage onto face in circular motions, and rinse clean.'
  },
  {
    id: '11',
    name: 'Frankincense Radiance Soap',
    category: 'Artisan Soaps',
    price: 9.99,
    size: 'Artisan Bar',
    image: '/assets/images/products/frankincense-soap.jpeg',
    description: 'Calms, restores softness, and gives skin a refreshed, radiant finish.',
    longDescription: 'Crafted with precious frankincense liquid, restorative aloe vera, and pure glycerin soap. Soothes inflammation, calms irritation, and encourages skin regeneration for a supple, refined texture.',
    ingredients: 'Frankincense liquid, glycerin soap & aloe vera.',
    directions: 'Work into a velvety lather with warm water, apply over damp skin, and rinse cleanly.',
    howToUse: 'Work into a velvety lather with warm water, apply over damp skin, and rinse cleanly.'
  },
  {
    id: '12',
    name: 'Coffee & Cocoa Exfoliating Soap',
    category: 'Artisan Soaps',
    price: 9.99,
    size: 'Artisan Bar',
    image: '/assets/images/products/coffee-cocoa-soap.jpeg',
    description: 'Gentle natural exfoliation to soften and brighten the skin.',
    longDescription: 'Handcrafted artisan soap combining freshly ground coffee beans and pure cocoa with natural glycerin soap. Delivers stimulating physical exfoliation that buffs away dead skin cells, softens dry elbows and heels, and leaves an irresistible warmth.',
    ingredients: 'Handcrafted coffee, cocoa, and pure glycerin soap with no additional chemicals.',
    directions: 'Gently massage bar over wet skin to naturally exfoliate and stimulate circulation. Rinse with warm water.',
    howToUse: 'Gently massage bar over wet skin to naturally exfoliate and stimulate circulation. Rinse with warm water.'
  },
  {
    id: '13',
    name: 'Pure Lemon Radiance Soap',
    category: 'Artisan Soaps',
    price: 9.99,
    size: 'Artisan Bar',
    image: '/assets/images/products/lemon-radiance-soap.jpeg',
    description: 'Clarifies pores and restores a youthful natural glow.',
    longDescription: 'Infused with cold-pressed pure citric oil and a gentle plant glycerin soap base. Cleanses deep within the pores, regulates excess oil, and leaves your skin feeling invigorated, vibrant, and radiantly smooth.',
    ingredients: 'Pure citric oil & plant glycerin soap base.',
    directions: 'Lather with water, gently massage over skin to cleanse, and rinse thoroughly.',
    howToUse: 'Lather with water, gently massage over skin to cleanse, and rinse thoroughly.'
  },

  // 🕯️ 5. Decorative Fishbowl Gel & Wax Candles
  {
    id: '14',
    name: 'Purple Floral & Pearl Glass Candle',
    category: 'Candles',
    price: 9.99,
    size: 'Decorative Glass Fishbowl',
    image: '/assets/images/products/candle-purple-floral.jpeg',
    description: 'Decorative glass bowl with preserved purple botanicals, luminous pearls, and scented wax.',
    longDescription: 'A breathtaking decorative artisan candle poured into a clear glass fishbowl. Features preserved purple botanicals and lustrous pearls encased in crystal clear gel, crowned with aromatic purple wax for a soothing visual and aromatic centerpiece.',
    ingredients: 'Scented wax, crystal gel, preserved purple botanicals, luminous pearls, cotton wick.',
    directions: 'Trim wick to 1/4 inch before lighting. Burn within sight on a heat-resistant surface away from drafts.',
    howToUse: 'Trim wick to 1/4 inch before lighting. Burn within sight on a heat-resistant surface away from drafts.'
  },
  {
    id: '15',
    name: 'Amethyst & Glass Gems Candle',
    category: 'Candles',
    price: 9.99,
    size: 'Decorative Glass Fishbowl',
    image: '/assets/images/products/candle-amethyst-gems.jpeg',
    description: 'Purple scented wax floating over colorful glass gems and crystal gel.',
    longDescription: 'Artisan handcrafted candle featuring scented purple wax resting gracefully atop colorful polished glass gems submerged in luminous crystal gel. Illuminates with shimmering multi-faceted reflections when lit.',
    ingredients: 'Purple scented wax, crystal gel, colorful glass gems, fragrance oils, lead-free wick.',
    directions: 'Place on a heat-safe surface. Light wick and allow fragrance to disperse evenly.',
    howToUse: 'Place on a heat-safe surface. Light wick and allow fragrance to disperse evenly.'
  },
  {
    id: '16',
    name: 'Golden Pearl Glow Candle',
    category: 'Candles',
    price: 9.99,
    size: 'Decorative Glass Fishbowl',
    image: '/assets/images/products/candle-golden-pearl.jpeg',
    description: 'Rich aromatic wax over golden pearls in crystal gel.',
    longDescription: 'Elegance in a glass bowl: handcrafted with shimmering golden pearls suspended in ultra-clear gel, topped with a generous layer of fragrant poured wax. Radiates warmth and opulence throughout any room.',
    ingredients: 'Aromatic wax, golden pearls, crystal gel, premium fragrance oils, cotton wick.',
    directions: 'Keep wick trimmed. Burn 2-3 hours per session for optimal scent throw and longevity.',
    howToUse: 'Keep wick trimmed. Burn 2-3 hours per session for optimal scent throw and longevity.'
  },
  {
    id: '17',
    name: 'Sunburst Pearl Glass Candle',
    category: 'Candles',
    price: 9.99,
    size: 'Decorative Glass Fishbowl',
    image: '/assets/images/products/candle-sunburst-pearl.jpeg',
    description: 'Sunny citrus-colored wax over pearls and iridescent crystal marbles.',
    longDescription: 'A burst of warm sunshine captured in glass. Scented sunburst-orange wax poured over pearlescent spheres and iridescent crystal marbles in clear gel. Brings an uplifting aura, cheerful light, and fresh fragrance.',
    ingredients: 'Citrus-scented colored wax, pearls, iridescent crystal marbles, clear gel, cotton wick.',
    directions: 'Trim wick before lighting. Keep away from flammable objects and breezy areas.',
    howToUse: 'Trim wick before lighting. Keep away from flammable objects and breezy areas.'
  },
  {
    id: '18',
    name: 'Ocean Azure & Pearl Glass Candle',
    category: 'Candles',
    price: 9.99,
    size: 'Decorative Glass Fishbowl',
    image: '/assets/images/products/candle-ocean-azure.jpeg',
    description: 'Deep ocean blue wax over preserved blue petals and pearls in clear gel.',
    longDescription: 'Inspired by tranquil coastal waters. Deep ocean blue scented wax floats over hand-placed blue botanical petals and glistening white pearls in transparent gel. Transports your senses to a peaceful sanctuary.',
    ingredients: 'Ocean breeze scented wax, preserved blue petals, white pearls, crystal gel, cotton wick.',
    directions: 'Burn on a level, fire-resistant surface. Extinguish gently when finished.',
    howToUse: 'Burn on a level, fire-resistant surface. Extinguish gently when finished.'
  }
];
