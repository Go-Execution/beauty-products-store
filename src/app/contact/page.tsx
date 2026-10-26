"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'General Inquiry',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <main className="container page-wrapper">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title fade-in">Connect With Baraka</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '-1rem' }}>
          We are here to assist with product inquiries, custom orders, or skincare guidance.
        </p>
      </div>

      <div className={`${styles.contactContainer} fade-in-up`}>
        {/* Contact Info Column */}
        <div className={styles.infoColumn}>
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h3>Official Email Concierge</h3>
            <p>
              Send us a direct inquiry. Our beauty and skincare specialists review every message with artisanal care.
            </p>
            <a href="mailto:info@barakabeautystore.com" className={styles.emailPill}>
              <span>info@barakabeautystore.com</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <div className={styles.supportBadge}>
              <span className={styles.dot}></span>
              <span>Typically responds within 24 hours</span>
            </div>
          </div>

          <div className={styles.extraDetails}>
            <div className={styles.detailItem}>
              <h4>Order Inquiries</h4>
              <p>For inquiries regarding an existing order, please include your order number and full name in the email subject.</p>
            </div>
            <div className={styles.detailItem}>
              <h4>Handcrafted Small Batches</h4>
              <p>Our artisan soaps and whitening creams are made in fresh, limited batches to preserve active botanicals and purity.</p>
            </div>
            <div className={styles.detailItem}>
              <h4>Hours of Operation</h4>
              <p>Monday — Saturday: 9:00 AM – 7:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className={styles.formCard}>
          <h2>Send a Message</h2>
          <p className={styles.formSubtitle}>Fill out the form below and we will get back to you promptly.</p>

          {isSubmitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3>Thank You for Reaching Out</h3>
              <p>
                Your message has been received. Our team will contact you at <strong>{formData.email}</strong> shortly.
              </p>
              <button onClick={handleReset} className={styles.resetBtn}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="sarah@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="General Inquiry">General Skincare Inquiry</option>
                  <option value="Order Status">Order Status & Shipping</option>
                  <option value="Custom Batch / Gift Sets">Custom Batch / Gift Sets</option>
                  <option value="Ingredients & Formulation">Ingredients & Formulation Query</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  required
                  placeholder="Tell us what you need help with..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className={`cta-button ${styles.submitBtn}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message to info@barakabeautystore.com'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
