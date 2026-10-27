import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.footerBrand}>
          <Link href="/">
            <Image src="/assets/logo.png" alt="Baraka Logo" width={120} height={150} className="logo" style={{ objectFit: 'contain', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }} />
          </Link>
          <p>Pure beauty, uncompromised.</p>
          <a href="mailto:info@barakabeautystore.com" className={styles.emailBadge}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>info@barakabeautystore.com</span>
          </a>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.linkColumn}>
            <h4>Shop</h4>
            <Link href="/shop">All Collection</Link>
            <Link href="/shop?category=Artisan+Soaps">Artisan Soaps</Link>
            <Link href="/shop?category=Body+Care">Body Care & Creams</Link>
          </div>
          <div className={styles.linkColumn}>
            <h4>Customer Care</h4>
            <Link href="/contact">Contact Us</Link>
            <a href="mailto:info@barakabeautystore.com">Email Support</a>
            <Link href="/checkout">Shipping & Returns</Link>
          </div>
          <div className={styles.linkColumn}>
            <h4>Get in Touch</h4>
            <p className={styles.contactText}>Have a question or custom order?</p>
            <a href="mailto:info@barakabeautystore.com" className={styles.emailTextLink}>
              info@barakabeautystore.com
            </a>
            <span className={styles.supportHours}>Mon - Sat: 9am - 7pm</span>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} Baraka Beauty. All rights reserved. • Inquiries:{' '}
          <a href="mailto:info@barakabeautystore.com" style={{ color: '#CCC', textDecoration: 'underline' }}>
            info@barakabeautystore.com
          </a>{' '}
          • <Link href="/admin" style={{ color: '#777', textDecoration: 'none', fontSize: '0.8rem' }}>Admin Portal</Link>
        </p>
      </div>
    </footer>
  );
}
