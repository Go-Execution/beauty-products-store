"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './ProductDetail.module.css';

export default function ProductDetailClient({ id }: { id: string }) {
  // Support both 1-5 and previous 7-11 so existing links / tabs work seamlessly
  const idMap: Record<string, string> = {
    '11': '1',
    '7': '2',
    '8': '3',
    '9': '4',
    '10': '5'
  };
  const resolvedId = idMap[id] || id;
  const product = products.find(p => p.id === resolvedId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomPos({ x: 50, y: 50 });
  };

  return (
    <main className={`container page-wrapper ${styles.productDetail}`}>
      <Link href="/shop" className={styles.backLink}>
        &larr; Back to Shop
      </Link>
      
      <div className={styles.grid}>
        <div 
          className={`${styles.imageContainer} fade-in`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className={styles.zoomImageWrapper}
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
            }}
          >
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <div className={`${styles.zoomBadge} ${isZoomed ? styles.zoomBadgeActive : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span>{isZoomed ? 'Move to explore details' : 'Hover to zoom'}</span>
          </div>
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
              <p>{product.ingredients || 'Formulated with 100% natural, sustainably sourced ingredients. Free from parabens, sulfates, and artificial fragrances.'}</p>
            </div>
            <div className={styles.detailItem}>
              <h4>How to Use</h4>
              <p style={{ whiteSpace: 'pre-line' }}>{product.howToUse || 'Apply a small amount to clean skin. Gently massage in upward circular motions until fully absorbed.'}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
