"use client";

import React, { useState } from 'react';
import { Product, products, CATEGORIES, Category } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import styles from './StorefrontCatalog.module.css';

interface StorefrontCatalogProps {
  initialCategory?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function StorefrontCatalog({
  initialCategory = 'All',
  title,
  subtitle,
  limit
}: StorefrontCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All') return products.length;
    return products.filter(p => p.category === category).length;
  };

  return (
    <div className={styles.catalogSection}>
      {/* Category Filter Tabs */}
      <div className={styles.filterWrapper}>
        <div className={styles.tabsContainer} role="tablist" aria-label="Product Categories">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                <span className={styles.countPill}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.resultsMeta}>
          Showing {displayedProducts.length} {displayedProducts.length === 1 ? 'product' : 'products'} {activeCategory !== 'All' ? `in ${activeCategory}` : 'in our handcrafted collection'}
        </div>
      </div>

      {/* Products Grid */}
      {displayedProducts.length > 0 ? (
        <div className={styles.productsGrid}>
          {displayedProducts.map((product) => (
            <div key={product.id} className="fade-in-up">
              <ProductCard 
                product={product} 
                onQuickView={handleOpenQuickView} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No products found in this category.</p>
          <button 
            type="button" 
            className={styles.resetBtn} 
            onClick={() => setActiveCategory('All')}
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
    </div>
  );
}
