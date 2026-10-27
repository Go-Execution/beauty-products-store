"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, ProductVariant } from '@/data/products';
import { useLiveProducts } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import styles from './ProductDetail.module.css';

export default function ProductDetailClient({ id }: { id: string }) {
  const { products: liveProducts } = useLiveProducts();
  const product = liveProducts.find(p => p.id === id) || products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    (product?.variants && product.variants.length > 0) ? product.variants[0] : null
  );
  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [added, setAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  if (!product) {
    notFound();
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  const handleAddToCart = () => {
    const itemToAdd = selectedVariant
      ? {
          ...product,
          id: `${product.id}_${selectedVariant.id}`,
          name: `${product.name} (${selectedVariant.name})`,
          price: selectedVariant.price,
          size: selectedVariant.size || product.size
        }
      : product;
    addToCart(itemToAdd, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1800);
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

  const currentImage = selectedImage || product.image;
  const hasMultipleImages = Boolean(product.secondaryImage);

  return (
    <main className={`container page-wrapper ${styles.productDetail}`}>
      <Link href="/shop" className={styles.backLink}>
        &larr; Back to Shop
      </Link>
      
      <div className={styles.grid}>
        <div>
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
                src={currentImage} 
                alt={product.name} 
                fill 
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>

            <div className={`${styles.zoomBadge} ${isZoomed ? styles.zoomBadgeActive : ''}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="22" y1="22" x2="15.5" y2="15.5"></line>
              </svg>
              <span>{isZoomed ? 'Move to explore details' : 'Hover to zoom'}</span>
            </div>
          </div>

          {hasMultipleImages && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setSelectedImage(product.image)}
                style={{
                  position: 'relative',
                  width: '70px',
                  height: '70px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: currentImage === product.image ? '2px solid #1a1a1a' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <Image src={product.image} alt="View 1" fill style={{ objectFit: 'cover' }} />
              </button>
              <button
                type="button"
                onClick={() => setSelectedImage(product.secondaryImage!)}
                style={{
                  position: 'relative',
                  width: '70px',
                  height: '70px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: currentImage === product.secondaryImage ? '2px solid #1a1a1a' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <Image src={product.secondaryImage!} alt="View 2" fill style={{ objectFit: 'cover' }} />
              </button>
            </div>
          )}
        </div>
        
        <div className={`${styles.infoContainer} fade-in`} style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <p className={styles.category}>{product.category}</p>
            {product.size && (
              <span style={{ 
                fontSize: '0.82rem', 
                background: '#F0ECE6', 
                color: '#4A3E37', 
                padding: '0.3rem 0.75rem', 
                borderRadius: '20px', 
                fontWeight: 500 
              }}>
                {product.size}
              </span>
            )}
          </div>

          <h1 className={styles.title}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <p className={styles.price}>${currentPrice.toFixed(2)}</p>
            {product.compareAtPrice && product.compareAtPrice > currentPrice && (
              <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.1rem' }}>
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className={styles.description}>
            <p>{product.longDescription || product.description}</p>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div style={{ margin: '1.5rem 0' }}>
              <label style={{ 
                fontSize: '0.8rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em', 
                color: 'var(--text-muted)', 
                display: 'block', 
                marginBottom: '0.6rem', 
                fontWeight: 600 
              }}>
                Select Option / Variant:
              </label>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: '0.55rem 1.1rem',
                        border: isSelected ? '1.5px solid var(--text-main)' : '1px solid #D1D5DB',
                        background: isSelected ? 'var(--text-main)' : '#FFF',
                        color: isSelected ? '#FFF' : 'var(--text-main)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? 600 : 500,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {v.name} • ${v.price.toFixed(2)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
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
            
            <button 
              className={`cta-button ${added ? styles.addedBtn : ''}`} 
              onClick={handleAddToCart}
              style={{ minWidth: '180px' }}
            >
              {added ? 'Added to Bag ✓' : 'Add to Bag'}
            </button>
          </div>
          
          <div className={styles.detailsList}>
            {product.ingredients && (
              <div className={styles.detailItem}>
                <h4>🌿 Ingredients</h4>
                <p>{product.ingredients}</p>
              </div>
            )}
            {(product.directions || product.howToUse) && (
              <div className={styles.detailItem}>
                <h4>✨ Directions / How to Use</h4>
                <p style={{ whiteSpace: 'pre-line' }}>{product.directions || product.howToUse}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
