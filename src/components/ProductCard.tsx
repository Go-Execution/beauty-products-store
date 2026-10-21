"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div className={styles.productCard}>
      {/* Image with overlay tags and quick view button */}
      <Link href={`/product/${product.id}`} className={styles.imageWrapper}>
        <Image 
          src={product.image} 
          alt={product.name} 
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <div className={styles.badgesOverlay}>
          <span className={styles.categoryTag}>{product.category}</span>
          {product.size && (
            <span className={styles.sizeTag}>{product.size}</span>
          )}
        </div>

        {onQuickView && (
          <button 
            type="button" 
            className={styles.quickViewOverlayBtn} 
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Quick View
          </button>
        )}
      </Link>

      {/* Card Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <Link href={`/product/${product.id}`}>
            <h3 className={styles.productName}>{product.name}</h3>
          </Link>

          <div className={styles.priceSizeRow}>
            <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
            {product.size && (
              <span className={styles.sizeText}>{product.size}</span>
            )}
          </div>
        </div>

        {product.ingredients && (
          <div className={styles.ingredientsSnippet} title={product.ingredients}>
            <strong>Key: </strong>{product.ingredients}
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.cardActions}>
          {onQuickView ? (
            <button 
              type="button" 
              className={styles.secondaryBtn} 
              onClick={handleQuickView}
              title="View full details and directions"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Quick View
            </button>
          ) : (
            <Link href={`/product/${product.id}`} className={styles.secondaryBtn}>
              Details
            </Link>
          )}

          <button 
            type="button" 
            className={`${styles.primaryBtn} ${added ? styles.primaryBtnSuccess : ''}`} 
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Added
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
