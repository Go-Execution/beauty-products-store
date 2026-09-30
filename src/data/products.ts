export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  longDescription: string;
  ingredients?: string;
  howToUse?: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'WOW Snow White Body Treatment Cream',
    category: 'Skincare',
    price: 39.99,
    image: '/assets/images/snow-white-cream.jpeg',
    description: 'Intensive Brightening & Exfoliating Treatment',
    longDescription: 'A luxury, spa-grade intensive body treatment formulated with pure citric soap, sweet almond oil, shea butter, vegetable glycerin, vitamins E & C, Jergens lotion, and pure rose water. Designed for profound brightening and all-over skin resurfacing, it delivers velvety softness and exceptional luminosity.',
    ingredients: 'Pure Citric Soap, Sweet Almond Oil, Raw Shea Butter, Vegetable Glycerin, Vitamin E, Vitamin C, Jergens Nourishing Lotion, Pure Rose Water.',
    howToUse: '1. Apply 1 even layer across your body; let dry, then apply a second layer.\n2. Allow it to sit for 1 to 2 hours.\n3. Thoroughly scrub and buff with a Moroccan luffa (kessa).\n4. Rinse thoroughly with warm water, then gently wash and rinse your body clean.'
  },
  {
    id: '2',
    name: 'Lemon Radiance Soap',
    category: 'Bath & Body',
    price: 6.99,
    image: '/assets/images/lemon-soap.jpeg',
    description: 'Pure Citric Oil Face & Body Bar',
    longDescription: 'Handcrafted artisan lemon soap infused with pure citric oil. Specially crafted to deeply clarify pores, even skin tone, and bring an irresistible natural radiance and youthful glow to your complexion.',
    ingredients: 'Pure Citric Oil, Natural Saponified Vegetable Oils, Organic Glycerin.',
    howToUse: 'Work into a silky lather with warm water. Gently massage onto damp facial and body skin in circular motions, then rinse thoroughly.'
  },
  {
    id: '3',
    name: 'Hibiscus Moisturizing Soap',
    category: 'Bath & Body',
    price: 9.99,
    image: '/assets/images/hibiscus-soap.jpeg',
    description: 'Brightening Botanical Bar',
    longDescription: 'An artisan botanical soap enriched with natural crushed hibiscus and gentle glycerin. Packed with natural AHAs and antioxidants, it works to gently polish away dullness, brighten your face, and lock in deep moisture without stripping the skin.',
    ingredients: 'Natural Crushed Hibiscus, Pure Vegetable Glycerin Soap Base.',
    howToUse: 'Lather between hands with warm water. Smooth the creamy foam over face and body, allowing botanical nutrients to nourish your skin before rinsing clean.'
  },
  {
    id: '4',
    name: 'Coffee & Cocoa Artisan Soap',
    category: 'Bath & Body',
    price: 6.99,
    image: '/assets/images/coffee-soap.jpeg',
    description: 'Handcrafted Exfoliating Bar',
    longDescription: 'Pure handcrafted artisan soap lovingly made with finely ground coffee, real cocoa, and nourishing glycerin soap—formulated with zero harsh additives or synthetic fillers. Stimulates microcirculation, gently buffs away dry skin, and leaves your skin feeling remarkably soft, supple, and radiant.',
    ingredients: 'Real Coffee Grounds, Pure Cocoa, Natural Glycerin Soap Base (no additional artificial ingredients).',
    howToUse: 'Glide the bar gently over wet skin for stimulating physical exfoliation, or lather in palms for a gentler wash. Rinse thoroughly with water.'
  },
  {
    id: '5',
    name: 'Frankincense & Aloe Vera Soap',
    category: 'Bath & Body',
    price: 9.99,
    image: '/assets/images/frankincense.jpeg',
    description: 'Softening & Radiance Facial Bar',
    longDescription: 'Infused with ancient sacred frankincense liquid, cooling aloe vera, and gentle glycerin. This restorative artisan bar calms redness, restores hydration, and promotes skin renewal, leaving your face feeling soft, revitalized, and naturally radiant.',
    ingredients: 'Frankincense Liquid Extract, Pure Aloe Vera, Natural Glycerin Soap Base.',
    howToUse: 'Lather gently with lukewarm water. Massage the velvety lather over your face and neck, then rinse well.'
  }
];

