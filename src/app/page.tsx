import Image from 'next/image';
import Link from 'next/link';
import StorefrontCatalog from '@/components/StorefrontCatalog';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <Image 
            src="/assets/images/hero.jpg" 
            alt="Baraka Luxury Beauty Products" 
            fill
            priority
            className={styles.heroImage}
          />
        </div>
        <div className={`${styles.heroContent} fade-in`}>
          <h1 className={styles.heroTitle}>Elevate Your Ritual</h1>
          <p className={styles.heroSubtitle}>Discover the essence of pure, handcrafted beauty & wellness.</p>
          <a href="#storefront-catalog" className="cta-button">Explore Collection</a>
        </div>
      </section>

      {/* Curated Categories Section */}
      <section className="section-padding">
        <div className="container">
          <h2 className="section-title fade-in">Curated Handcrafted Categories</h2>
          <div className={styles.categoryGrid}>
            <Link href="/shop?category=Hair+Care" className={`${styles.categoryCard} fade-in`} style={{ transitionDelay: '0.1s' }}>
              <div className={styles.categoryImageContainer}>
                <Image src="/assets/images/products/shampoo.jpeg" alt="Handcrafted Hair Care" fill style={{ objectFit: 'cover' }} />
                <div className={styles.categoryOverlay}>
                  <h3>Hair Care</h3>
                </div>
              </div>
            </Link>

            <Link href="/shop?category=Perfumes+%26+Oils" className={`${styles.categoryCard} fade-in`} style={{ transitionDelay: '0.15s' }}>
              <div className={styles.categoryImageContainer}>
                <Image src="/assets/images/products/smell-me-rollon.jpeg" alt="Perfumes & Oils" fill style={{ objectFit: 'cover' }} />
                <div className={styles.categoryOverlay}>
                  <h3>Perfumes & Oils</h3>
                </div>
              </div>
            </Link>

            <Link href="/shop?category=Body+Care" className={`${styles.categoryCard} fade-in`} style={{ transitionDelay: '0.2s' }}>
              <div className={styles.categoryImageContainer}>
                <Image src="/assets/images/products/snow-white-cream.jpeg" alt="Body Care" fill style={{ objectFit: 'cover' }} />
                <div className={styles.categoryOverlay}>
                  <h3>Body Care</h3>
                </div>
              </div>
            </Link>

            <Link href="/shop?category=Artisan+Soaps" className={`${styles.categoryCard} fade-in`} style={{ transitionDelay: '0.25s' }}>
              <div className={styles.categoryImageContainer}>
                <Image src="/assets/images/products/hibiscus-soap.jpeg" alt="Artisan Soaps" fill style={{ objectFit: 'cover' }} />
                <div className={styles.categoryOverlay}>
                  <h3>Artisan Soaps</h3>
                </div>
              </div>
            </Link>

            <Link href="/shop?category=Candles" className={`${styles.categoryCard} fade-in`} style={{ transitionDelay: '0.3s' }}>
              <div className={styles.categoryImageContainer}>
                <Image src="/assets/images/products/candle-purple-floral.jpeg" alt="Decorative Candles" fill style={{ objectFit: 'cover' }} />
                <div className={styles.categoryOverlay}>
                  <h3>Candles</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Storefront Products with Category Tabs & Quick View */}
      <section id="storefront-catalog" className="section-padding bg-light">
        <div className="container">
          <h2 className="section-title fade-in">Handcrafted Essentials</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '2.5rem' }}>
            Pure ingredients, authentic recipes, and artisanal care in every product.
          </p>

          <StorefrontCatalog initialCategory="All" />
        </div>
      </section>
      
      {/* Story Section */}
      <section className="section-padding">
        <div className={`container ${styles.storyContainer}`}>
          <div className={`${styles.storyText} fade-in`}>
            <h2 className="section-title text-left">Our Philosophy</h2>
            <p>At Baraka, we believe that true beauty stems from simplicity and authenticity. Our formulations are crafted with the finest natural ingredients, designed to nourish not just your skin, but your soul.</p>
            <p>From organic botanicals and cold-pressed oils to decorative crystal gel candles, every product is a testament to mindful luxury, bringing a moment of tranquility to your daily ritual.</p>
            <Link href="/shop" className="cta-button outline" style={{ marginTop: '1.5rem' }}>View Entire Shop</Link>
          </div>
          <div className={`${styles.storyImage} fade-in`} style={{ transitionDelay: '0.2s' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5' }}>
              <Image src="/assets/images/hero.jpg" alt="Our Philosophy" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
