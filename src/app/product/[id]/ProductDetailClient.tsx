"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './ProductDetail.module.css';

export default function ProductDetailClient({ id }: { id: string }) {
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <main className={`container page-wrapper ${styles.productDetail}`}>
      <Link href="/shop" className={styles.backLink}>
        &larr; Back to Shop
      </Link>
      
      <div className={styles.grid}>
        <div className={`${styles.imageContainer} fade-in`}>
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        
        <div className={`${styles.infoContainer} fade-in`} style={{ animationDelay: '0.2s' }}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          
          <div className={styles.description}>
            <p>{product.longDescription}</p>
          </div>
          
          <div className={styles.actions}>
            <div className={styles.quantitySelector}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >-</button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >+</button>
            </div>
            
            <button className="cta-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
          
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <h4>Ingredients</h4>
              <p>Formulated with 100% natural, sustainably sourced ingredients. Free from parabens, sulfates, and artificial fragrances.</p>
            </div>
            <div className={styles.detailItem}>
              <h4>How to Use</h4>
              <p>Apply a small amount to clean skin. Gently massage in upward circular motions until fully absorbed.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
