"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    addToCart(product, 1);
  };

  return (
    <Link href={`/product/${product.id}`} className={styles.productCard}>
      <div className={styles.productImage}>
        <Image 
          src={product.image} 
          alt={product.name} 
          width={400} 
          height={400} 
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productCategory}>{product.category}</p>
        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
        <button className={styles.addToCart} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
