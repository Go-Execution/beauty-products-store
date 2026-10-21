"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './QuickViewModal.module.css';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const hasMultipleImages = Boolean(product.secondaryImage);

  return (
    <div 
      className={styles.modalBackdrop} 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      <div className={styles.modalContainer}>
        <button 
          className={styles.closeBtn} 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.modalContent}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.mainImageWrapper}>
              <Image 
                src={selectedImage || product.image} 
                alt={product.name} 
                fill 
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 450px"
                priority
              />
            </div>

            {hasMultipleImages && (
              <div className={styles.thumbnailRow}>
                <button
                  type="button"
                  className={`${styles.thumbBtn} ${selectedImage === product.image ? styles.thumbBtnActive : ''}`}
                  onClick={() => setSelectedImage(product.image)}
                  aria-label="Product view 1"
                >
                  <Image src={product.image} alt="Thumbnail 1" fill style={{ objectFit: 'cover' }} />
                </button>
                <button
                  type="button"
                  className={`${styles.thumbBtn} ${selectedImage === product.secondaryImage ? styles.thumbBtnActive : ''}`}
                  onClick={() => setSelectedImage(product.secondaryImage!)}
                  aria-label="Product view 2"
                >
                  <Image src={product.secondaryImage!} alt="Thumbnail 2" fill style={{ objectFit: 'cover' }} />
                </button>
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className={styles.infoSection}>
            <div className={styles.headerMeta}>
              <span className={styles.categoryBadge}>{product.category}</span>
              {product.size && (
                <span className={styles.sizeBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {product.size}
                </span>
              )}
            </div>

            <h2 id="quickview-title" className={styles.productTitle}>
              {product.name}
            </h2>

            <div className={styles.priceWrapper}>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
            </div>

            <p className={styles.shortDesc}>
              {product.description || product.longDescription}
            </p>

            {/* Ingredients Display */}
            {product.ingredients && (
              <div className={styles.detailCard}>
                <h4 className={styles.detailTitle}>
                  🌿 Ingredients
                </h4>
                <p className={styles.detailText}>{product.ingredients}</p>
              </div>
            )}

            {/* Directions Display */}
            {(product.directions || product.howToUse) && (
              <div className={styles.detailCard}>
                <h4 className={styles.detailTitle}>
                  ✨ Directions / How to Use
                </h4>
                <p className={styles.detailText}>{product.directions || product.howToUse}</p>
              </div>
            )}

            {/* Actions: Quantity & Add to Cart */}
            <div className={styles.actionsRow}>
              <div className={styles.quantityControl}>
                <button 
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button 
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button 
                type="button"
                className={`${styles.addToBagBtn} ${added ? styles.addToBagBtnSuccess : ''}`}
                onClick={handleAddToCart}
              >
                {added ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Added to Bag
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Add to Bag
                  </>
                )}
              </button>
            </div>

            <Link 
              href={`/product/${product.id}`} 
              className={styles.viewDetailsLink}
              onClick={onClose}
            >
              View Full Product Page &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
