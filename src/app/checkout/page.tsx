"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <main className="container page-wrapper"></main>;

  if (isSuccess) {
    return (
      <main className="container page-wrapper">
        <div className={styles.successMessage}>
          <h1 className="page-title fade-in">Order Confirmed</h1>
          <p>Thank you for your purchase. Your elegant ritual begins soon.</p>
          <Link href="/" className="cta-button" style={{ marginTop: '2rem' }}>
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="container page-wrapper">
        <div className={styles.successMessage}>
          <h1 className="page-title fade-in">Checkout</h1>
          <p>Your cart is empty.</p>
          <Link href="/shop" className="cta-button" style={{ marginTop: '2rem' }}>
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  return (
    <main className="container page-wrapper">
      <h1 className="page-title fade-in">Checkout</h1>
      
      <div className={`${styles.checkoutContainer} fade-in-up`}>
        <form className={styles.checkoutForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h2>Shipping Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" required />
              </div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="address">Address</label>
                <input type="text" id="address" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="city">City</label>
                <input type="text" id="city" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="zip">ZIP / Postal Code</label>
                <input type="text" id="zip" required />
              </div>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h2>Payment Details</h2>
            <div className={styles.formGrid}>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="cardName">Name on Card</label>
                <input type="text" id="cardName" required />
              </div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="exp">Expiration Date</label>
                <input type="text" id="exp" placeholder="MM/YY" required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="cvc">Security Code</label>
                <input type="text" id="cvc" placeholder="CVC" required />
              </div>
            </div>
          </div>
          
          <button type="submit" className={`cta-button ${styles.submitBtn}`} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </form>
        
        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryItems}>
            {cart.map(item => (
              <div key={item.id} className={styles.summaryItem}>
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.totals}>
            <div className={styles.totalsRow}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className={styles.totalsRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={`${styles.totalsRow} ${styles.finalTotal}`}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
