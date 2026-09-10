"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './Cart.module.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <main className="container page-wrapper"><div style={{marginTop: '8rem', textAlign: 'center'}}>Loading...</div></main>;

  if (cart.length === 0) {
    return (
      <main className="container page-wrapper">
        <div className={styles.emptyCart}>
          <h1 className="page-title fade-in">Your Cart</h1>
          <p>Your cart is currently empty.</p>
          <Link href="/shop" className="cta-button" style={{ marginTop: '2rem' }}>
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container page-wrapper">
      <h1 className="page-title fade-in">Your Cart</h1>
      
      <div className={`${styles.cartContainer} fade-in-up`}>
        <div className={styles.cartItems}>
          <div className={styles.cartHeader}>
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
          
          {cart.map((item) => (
            <div key={item.id} className={styles.cartRow}>
              <div className={styles.itemInfo}>
                <div className={styles.itemImage}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <Link href={`/product/${item.id}`} className={styles.itemName}>{item.name}</Link>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className={styles.itemQuantity}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              
              <div className={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.cartSummary}>
          <h3>Order Summary</h3>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <Link href="/checkout" className={`cta-button ${styles.checkoutBtn}`}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
