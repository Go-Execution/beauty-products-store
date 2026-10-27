"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { Product, CATEGORIES } from '@/data/products';
import { useLiveProducts } from '@/lib/products';
import styles from './Shop.module.css';

function ShopContent() {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get('category');
  const { products: liveProducts } = useLiveProducts();
  
  const [filter, setFilter] = useState<string>('All');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  useEffect(() => {
    if (rawCategory && CATEGORIES.includes(rawCategory as any)) {
      setFilter(rawCategory);
    } else {
      setFilter('All');
    }
  }, [rawCategory]);

  const filteredProducts = filter === 'All' 
    ? liveProducts 
    : liveProducts.filter(p => p.category === filter);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
  };

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return liveProducts.length;
    return liveProducts.filter(p => p.category === cat).length;
  };

  return (
    <main className="container page-wrapper">
      <h1 className="page-title fade-in">Handcrafted Collection</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '2.5rem' }}>
        Artisanal hair growth formulas, luxury perfumes, botanical skincare, handcrafted botanical soaps, and crystal gel candles.
      </p>
      
      {/* Category Tabs */}
      <div className={styles.filterContainer}>
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            type="button"
            className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat} ({getCategoryCount(cat)})
          </button>
        ))}
      </div>

      <div className={styles.shopGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="fade-in-up">
            <ProductCard 
              product={product} 
              onQuickView={handleOpenQuickView} 
            />
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className={styles.noProducts}>
          <p>No products found in this category.</p>
          <button 
            type="button"
            onClick={() => setFilter('All')}
            className="cta-button"
            style={{ marginTop: '1rem' }}
          >
            View All Products
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
      />
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="container page-wrapper"><p style={{marginTop: '2rem', textAlign: 'center'}}>Loading catalog...</p></div>}>
      <ShopContent />
    </Suspense>
  );
}
