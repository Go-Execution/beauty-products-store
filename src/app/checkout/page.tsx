"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/orders';
import { Order, PaymentMethod, PaymentStatus } from '@/types/ecommerce';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
    // Card inputs
    cardName: '',
    cardNumber: '',
    exp: '',
    cvc: '',
    // Bank transfer input
    bankReference: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <main className="container page-wrapper"></main>;

  // Success Confirmation Screen
  if (confirmedOrder) {
    return (
      <main className="container page-wrapper">
        <div className={`${styles.successContainer} fade-in`}>
          <div className={styles.successIconCircle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Order Confirmed</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
            Thank you for choosing Baraka Beauty. Your handcrafted ritual begins soon.
          </p>

          <div>
            <span className={styles.orderNumberBadge}>
              Order #{confirmedOrder.orderNumber}
            </span>
          </div>

          <div className={styles.confirmedDetailsGrid}>
            <div className={styles.confirmedBlock}>
              <h4>Customer</h4>
              <p>{confirmedOrder.customer.firstName} {confirmedOrder.customer.lastName}</p>
              <p>{confirmedOrder.customer.email}</p>
              <p>{confirmedOrder.customer.phone}</p>
            </div>

            <div className={styles.confirmedBlock}>
              <h4>Shipping Destination</h4>
              <p>{confirmedOrder.customer.address}</p>
              <p>{confirmedOrder.customer.city}, {confirmedOrder.customer.postalCode}</p>
            </div>

            <div className={styles.confirmedBlock}>
              <h4>Payment Method</h4>
              <p style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                {confirmedOrder.paymentMethod === 'cod' && 'Cash on Delivery (COD)'}
                {confirmedOrder.paymentMethod === 'card' && 'Credit / Debit Card (Authorized)'}
                {confirmedOrder.paymentMethod === 'bank_transfer' && 'Direct Bank Transfer / Raast'}
              </p>
              <p style={{ fontSize: '0.82rem', color: confirmedOrder.paymentStatus === 'paid' ? '#059669' : '#D97706' }}>
                Status: {confirmedOrder.paymentStatus.toUpperCase()}
              </p>
            </div>

            <div className={styles.confirmedBlock}>
              <h4>Amount Total</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                ${confirmedOrder.total.toFixed(2)}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {confirmedOrder.items.length} unique handcrafted items
              </p>
            </div>
          </div>

          <div className={styles.orderSupportCard}>
            <p className={styles.orderSupportTitle}>Need assistance with this order?</p>
            <p className={styles.orderSupportText}>
              Contact our concierge anytime at{' '}
              <a href="mailto:info@barakabeautystore.com" className={styles.supportEmailLink}>
                info@barakabeautystore.com
              </a>{' '}
              with Order #{confirmedOrder.orderNumber}
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/shop" className="cta-button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Empty Cart Screen
  if (cart.length === 0) {
    return (
      <main className="container page-wrapper">
        <div style={{ textAlign: 'center', padding: '6rem 0' }}>
          <h1 className="page-title fade-in">Your Cart is Empty</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Discover our pure handcrafted soaps, body creams, and fragrance oils.
          </p>
          <Link href="/shop" className="cta-button">
            Explore Handcrafted Collection
          </Link>
        </div>
      </main>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Realistic payment gateway status flow
    if (paymentMethod === 'card') {
      setProcessingStatus('Connecting to secure payment gateway...');
      await new Promise(r => setTimeout(r, 700));
      setProcessingStatus('Encrypting credentials & verifying 3D Secure...');
      await new Promise(r => setTimeout(r, 900));
      setProcessingStatus('Authorizing payment...');
      await new Promise(r => setTimeout(r, 600));
    } else if (paymentMethod === 'bank_transfer') {
      setProcessingStatus('Verifying transfer reference...');
      await new Promise(r => setTimeout(r, 800));
    } else {
      setProcessingStatus('Validating shipping address & confirming order...');
      await new Promise(r => setTimeout(r, 800));
    }

    const paymentStatus: PaymentStatus = paymentMethod === 'card' ? 'paid' : 'pending';

    try {
      const order = await createOrder({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category
        })),
        subtotal: cartTotal,
        shippingFee: 0, // Free shipping
        total: cartTotal,
        paymentMethod,
        paymentStatus,
        paymentReference: paymentMethod === 'bank_transfer' ? formData.bankReference : (paymentMethod === 'card' ? 'AUTH_GATEWAY_SUCCESS' : undefined)
      });

      clearCart();
      setConfirmedOrder(order);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Could not complete order. Please try again.');
    } finally {
      setIsSubmitting(false);
      setProcessingStatus('');
    }
  };

  return (
    <main className="container page-wrapper">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="page-title fade-in">Secure Checkout</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '-1rem' }}>
          Finalize your shipping details and select your preferred payment method.
        </p>
      </div>

      <div className={`${styles.checkoutContainer} fade-in-up`}>
        {/* Checkout Form */}
        <form className={styles.checkoutForm} onSubmit={handleSubmit}>
          {/* Section 1: Customer Contact & Shipping */}
          <div className={styles.formSection}>
            <h2>
              <span className={styles.sectionStep}>1</span>
              Shipping & Contact Information
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="e.g. Amina"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="e.g. Sheikh"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="amina@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="phone">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="e.g. +92 300 1234567"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="address">Full Delivery Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  placeholder="House / Apartment #, Street, Area"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  placeholder="e.g. Karachi / Lahore / Dubai"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="postalCode">Postal Code / ZIP</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  placeholder="e.g. 75600"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label htmlFor="notes">Order Instructions (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  placeholder="Special courier notes, building gates, delivery time..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Gateway Selection */}
          <div className={styles.formSection}>
            <h2>
              <span className={styles.sectionStep}>2</span>
              Payment Method
            </h2>

            <div className={styles.paymentMethodsList}>
              {/* Option A: Cash on Delivery */}
              <label
                className={`${styles.paymentMethodCard} ${paymentMethod === 'cod' ? styles.paymentMethodActive : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className={styles.paymentRadio}
                />
                <div className={styles.paymentMethodInfo}>
                  <div className={styles.paymentHeaderRow}>
                    <span className={styles.paymentMethodTitle}>Cash on Delivery (COD)</span>
                    <span className={`${styles.paymentBadge} ${styles.badgeGreen}`}>Recommended</span>
                  </div>
                  <p className={styles.paymentMethodDesc}>
                    Pay in cash when your parcel is delivered to your doorstep. No prepayment or card required.
                  </p>
                </div>
              </label>

              {/* Option B: Credit / Debit Card Gateway */}
              <label
                className={`${styles.paymentMethodCard} ${paymentMethod === 'card' ? styles.paymentMethodActive : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className={styles.paymentRadio}
                />
                <div className={styles.paymentMethodInfo}>
                  <div className={styles.paymentHeaderRow}>
                    <span className={styles.paymentMethodTitle}>Credit / Debit Card (Online Gateway)</span>
                    <span className={`${styles.paymentBadge} ${styles.badgeBlue}`}>Instant</span>
                  </div>
                  <p className={styles.paymentMethodDesc}>
                    Pay securely using Visa, Mastercard, or PayFast/Stripe encrypted gateway.
                  </p>
                </div>
              </label>

              {/* Card Form Details (conditionally shown) */}
              {paymentMethod === 'card' && (
                <div className={styles.cardDetailsBox}>
                  <div className={styles.formGrid}>
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                      <label htmlFor="cardName">Cardholder Name *</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        required={paymentMethod === 'card'}
                        placeholder="Name printed on card"
                        value={formData.cardName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                      <label htmlFor="cardNumber">Card Number *</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        required={paymentMethod === 'card'}
                        placeholder="•••• •••• •••• ••••"
                        maxLength={19}
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="exp">Expiration (MM/YY) *</label>
                      <input
                        type="text"
                        id="exp"
                        name="exp"
                        required={paymentMethod === 'card'}
                        placeholder="MM/YY"
                        maxLength={5}
                        value={formData.exp}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="cvc">CVV / CVC *</label>
                      <input
                        type="password"
                        id="cvc"
                        name="cvc"
                        required={paymentMethod === 'card'}
                        placeholder="123"
                        maxLength={4}
                        value={formData.cvc}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={styles.securityNote}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span>256-Bit SSL Encrypted Payment Gateway Integration</span>
                  </div>
                </div>
              )}

              {/* Option C: Direct Bank Transfer / Raast */}
              <label
                className={`${styles.paymentMethodCard} ${paymentMethod === 'bank_transfer' ? styles.paymentMethodActive : ''}`}
                onClick={() => setPaymentMethod('bank_transfer')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className={styles.paymentRadio}
                />
                <div className={styles.paymentMethodInfo}>
                  <div className={styles.paymentHeaderRow}>
                    <span className={styles.paymentMethodTitle}>Direct Bank Transfer / Raast</span>
                    <span className={`${styles.paymentBadge} ${styles.badgeGold}`}>0% Fees</span>
                  </div>
                  <p className={styles.paymentMethodDesc}>
                    Transfer directly to our official Baraka Beauty bank account and enter your transfer reference.
                  </p>
                </div>
              </label>

              {/* Bank Transfer Details (conditionally shown) */}
              {paymentMethod === 'bank_transfer' && (
                <div className={styles.bankDetailsBox}>
                  <div style={{ marginBottom: '0.8rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    Official Baraka Beauty Bank Details:
                  </div>
                  <div className={styles.bankDetailRow}>
                    <span className={styles.bankDetailLabel}>Bank:</span>
                    <span className={styles.bankDetailVal}>Meezan Bank Ltd</span>
                  </div>
                  <div className={styles.bankDetailRow}>
                    <span className={styles.bankDetailLabel}>Account Title:</span>
                    <span className={styles.bankDetailVal}>Baraka Beauty Store</span>
                  </div>
                  <div className={styles.bankDetailRow}>
                    <span className={styles.bankDetailLabel}>IBAN:</span>
                    <span className={styles.bankDetailVal}>PK64MEZN0001928374650101</span>
                  </div>
                  <div className={styles.bankDetailRow}>
                    <span className={styles.bankDetailLabel}>Raast ID:</span>
                    <span className={styles.bankDetailVal}>info@barakabeautystore.com</span>
                  </div>

                  <div className={styles.inputGroup} style={{ marginTop: '1.2rem' }}>
                    <label htmlFor="bankReference">Transaction / Reference ID *</label>
                    <input
                      type="text"
                      id="bankReference"
                      name="bankReference"
                      required={paymentMethod === 'bank_transfer'}
                      placeholder="e.g. TXN-84910284"
                      value={formData.bankReference}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`cta-button ${styles.submitBtn}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>{processingStatus || 'Processing Order...'}</span>
            ) : (
              <span>
                Place Order • ${(cartTotal).toFixed(2)}
              </span>
            )}
          </button>
        </form>

        {/* Order Summary Column */}
        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryItems}>
            {cart.map(item => (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.summaryItemTitle}>
                  <span className={styles.summaryItemName}>{item.name}</span>
                  <span className={styles.summaryItemQty}>Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                </div>
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
              <span>Handcrafted Packaging</span>
              <span style={{ color: '#15803D' }}>Included</span>
            </div>
            <div className={styles.totalsRow}>
              <span>Shipping Fee</span>
              <span style={{ color: '#15803D' }}>Free</span>
            </div>
            <div className={`${styles.totalsRow} ${styles.finalTotal}`}>
              <span>Total Due</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
