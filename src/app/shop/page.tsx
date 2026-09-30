"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import styles from './Shop.module.css';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [filter, setFilter] = useState(initialCategory);
  const categories = ['All', 'Skincare', 'Bath & Body'];

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.includes(category)) {
      setFilter(category);
    }
  }, [searchParams]);

  return (
    <main className="container page-wrapper">
      <h1 className="page-title fade-in">The Collection</h1>
      
      <div className={styles.filterContainer}>
        {categories.map(cat => (
          <button 
            key={cat}
            className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.shopGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="fade-in-up">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className={styles.noProducts}>
          <p>No products found in this category.</p>
        </div>
      )}
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="container page-wrapper"><p style={{marginTop: '2rem', textAlign: 'center'}}>Loading...</p></div>}>
      <ShopContent />
    </Suspense>
  );
}
