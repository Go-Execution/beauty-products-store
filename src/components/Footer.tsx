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
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.linkColumn}>
            <h4>Shop</h4>
            <Link href="/shop">All Products</Link>
            <Link href="/shop?category=Skincare">Skincare</Link>
            <Link href="/shop?category=Bath+%26+Body">Bath & Body</Link>
          </div>
          <div className={styles.linkColumn}>
            <h4>Company</h4>
            <Link href="#">About Us</Link>
            <Link href="#">Sustainability</Link>
            <Link href="#">Contact</Link>
          </div>
          <div className={styles.linkColumn}>
            <h4>Legal</h4>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Shipping & Returns</Link>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Baraka Beauty. All rights reserved. (Mockup)</p>
      </div>
    </footer>
  );
}
