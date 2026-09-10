import React from 'react';
import Link from 'next/link';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <main className={`container page-wrapper ${styles.notFoundContainer}`}>
      <div className={`${styles.content} fade-in-up`}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          The page you are looking for has been moved, removed, renamed, or might never have existed.
        </p>
        <Link href="/" className="cta-button">
          Return Home
        </Link>
      </div>
    </main>
  );
}
