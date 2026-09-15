import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import styles from './page.module.css';

export default function Home() {
  const featuredProducts = products.slice(0, 3);

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
          <p className={styles.heroSubtitle}>Discover the essence of pure, uncompromised beauty.</p>
          <Link href="/shop" className="cta-button">Explore Collection</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <h2 className="section-title fade-in">Curated for You</h2>
        <div className={styles.categoryGrid}>
          <Link href="/shop?category=Fragrance" className={`${styles.categoryCard} fade-in`} style={{ transitionDelay: '0.1s' }}>
            <div className={styles.categoryImageContainer}>
              <Image src="/assets/images/perfume.jpg" alt="Signature Fragrances" fill />
              <div className={styles.categoryOverlay}>
                <h3>Fragrances</h3>
              </div>
            </div>
          </Link>
          <Link href="/shop?category=Skincare" className={`${styles.categoryCard} fade-in`} style={{ transitionDelay: '0.2s' }}>
            <div className={styles.categoryImageContainer}>
              <Image src="/assets/images/cream.jpg" alt="Nourishing Creams" fill />
              <div className={styles.categoryOverlay}>
                <h3>Skincare</h3>
              </div>
            </div>
          </Link>
          <Link href="/shop?category=Bath+%26+Body" className={`${styles.categoryCard} fade-in`} style={{ transitionDelay: '0.3s' }}>
            <div className={styles.categoryImageContainer}>
              <Image src="/assets/images/soap.jpg" alt="Artisanal Soaps" fill />
              <div className={styles.categoryOverlay}>
                <h3>Bath & Body</h3>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-light">
        <div className="container">
          <h2 className="section-title fade-in">Featured Essentials</h2>
          <div className={styles.productGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="section-padding">
        <div className={`container ${styles.storyContainer}`}>
          <div className={`${styles.storyText} fade-in`}>
            <h2 className="section-title text-left">Our Philosophy</h2>
            <p>At Baraka, we believe that true beauty stems from simplicity and authenticity. Our formulations are crafted with the finest natural ingredients, designed to nourish not just your skin, but your soul.</p>
            <p>Every product is a testament to mindful luxury, bringing a moment of tranquility to your daily ritual.</p>
            <Link href="/shop" className="cta-button outline" style={{ marginTop: '1.5rem' }}>Read Our Story</Link>
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
