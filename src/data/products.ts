export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  longDescription: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Baraka No. 1',
    category: 'Fragrance',
    price: 120.00,
    image: '/assets/images/perfume.jpg',
    description: 'Eau de Parfum',
    longDescription: 'Our signature fragrance. A delicate balance of floral top notes, a warm amber heart, and a lasting sandalwood base. Baraka No. 1 is designed to be your daily luxury.'
  },
  {
    id: '2',
    name: 'Radiance Crème',
    category: 'Skincare',
    price: 85.00,
    image: '/assets/images/cream.jpg',
    description: 'Daily Moisturizer',
    longDescription: 'A rich, deeply nourishing face cream that revitalizes tired skin. Formulated with hyaluronic acid and rare botanical extracts to provide 24-hour hydration and a natural glow.'
  },
  {
    id: '3',
    name: 'Botanical Bar',
    category: 'Bath & Body',
    price: 24.00,
    image: '/assets/images/soap.jpg',
    description: 'Artisan Soap',
    longDescription: 'Handcrafted using traditional cold-process methods. This botanical soap gently exfoliates with natural oats and soothes with lavender essential oil, leaving skin soft and refreshed.'
  },
  {
    id: '4',
    name: 'Midnight Elixir',
    category: 'Skincare',
    price: 145.00,
    image: '/assets/images/cream.jpg',
    description: 'Overnight Recovery Oil',
    longDescription: 'A potent overnight treatment that works while you sleep. Infused with squalane and rosehip oil to repair the skin barrier and reduce fine lines.'
  },
  {
    id: '5',
    name: 'Citrus Bloom',
    category: 'Fragrance',
    price: 95.00,
    image: '/assets/images/perfume.jpg',
    description: 'Eau de Toilette',
    longDescription: 'A refreshing, energetic scent featuring bright bergamot, neroli, and a touch of white musk. Perfect for the spring and summer seasons.'
  },
  {
    id: '6',
    name: 'Silk Body Wash',
    category: 'Bath & Body',
    price: 35.00,
    image: '/assets/images/soap.jpg',
    description: 'Nourishing Body Wash',
    longDescription: 'Transform your shower into a spa experience. This rich, foaming body wash cleanses without stripping moisture, scented with a hint of vanilla and almond.'
  }
];
