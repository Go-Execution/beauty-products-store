"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchOrders, updateOrderStatus } from '@/lib/orders';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Order, OrderStatus } from '@/types/ecommerce';
import { products, Product } from '@/data/products';
import styles from './Admin.module.css';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  // Dashboard Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Products stock state (editable locally)
  const [stockMap, setStockMap] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
    // Check session storage for existing auth
    const savedAuth = sessionStorage.getItem('baraka_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    const loadedOrders = await fetchOrders();
    setOrders(loadedOrders);

    // Initialize mock stock
    const initialStock: Record<string, number> = {};
    products.forEach((p, idx) => {
      initialStock[p.id] = 25 + (idx % 5) * 8;
    });
    setStockMap(initialStock);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master passcode for Baraka Beauty Admin
    if (passcode.trim() === 'baraka2026' || passcode.trim() === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('baraka_admin_auth', 'true');
      setErrorMsg('');
      loadDashboardData();
    } else {
      setErrorMsg('Incorrect passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('baraka_admin_auth');
    setIsAuthenticated(false);
    setPasscode('');
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => (o.id === orderId || o.orderNumber === orderId) ? { ...o, orderStatus: newStatus } : o));
    if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderNumber === orderId)) {
      setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
    }
  };

  if (!mounted) return null;

  // 1. Passcode Authentication Gate
  if (!isAuthenticated) {
    return (
      <main className="container page-wrapper">
        <div className={styles.loginWrapper}>
          <div className={`${styles.loginCard} fade-in`}>
            <div className={styles.lockIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2>Baraka Admin Portal</h2>
            <p className={styles.loginSubtitle}>
              Enter your store management passcode to manage orders, inventory, and fulfillment.
            </p>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              <input
                type="password"
                placeholder="Enter Admin Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={styles.passcodeInput}
                autoFocus
                required
              />
              {errorMsg && (
                <p style={{ color: '#DC2626', fontSize: '0.85rem', margin: 0 }}>{errorMsg}</p>
              )}
              <button type="submit" className={`cta-button ${styles.loginBtn}`}>
                Unlock Dashboard
              </button>
            </form>

            <p className={styles.hintText}>
              Default Passcode: <code>baraka2026</code>
            </p>
          </div>
        </div>
      </main>
    );
  }

  // 2. Metrics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' || o.paymentMethod === 'cod' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'pending').length;
  const totalProductsCount = products.length;

  // 3. Filtered Orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(query) ||
      `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(query) ||
      order.customer.city.toLowerCase().includes(query) ||
      order.customer.phone.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <main className="container page-wrapper">
      <div className={styles.adminContainer}>
        {/* Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.headerLeft}>
            <h1>Store Operations & Orders</h1>
            <p>Real-time fulfillment, inventory sync, and customer management.</p>
          </div>
          <div className={styles.headerRight}>
            {isSupabaseConfigured() ? (
              <span className={`${styles.dbBadge} ${styles.dbConnected}`}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }}></span>
                Supabase DB Active
              </span>
            ) : (
              <span className={`${styles.dbBadge} ${styles.dbLocal}`} title="Configure NEXT_PUBLIC_SUPABASE_URL in .env.local to sync with Supabase cloud">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706', display: 'inline-block' }}></span>
                Local Mode (Ready for Supabase)
              </span>
            )}
            <Link href="/" className={styles.logoutBtn} style={{ textDecoration: 'none' }}>
              View Storefront
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Sales</span>
            <div className={styles.statValue}>${totalRevenue.toFixed(2)}</div>
            <span className={styles.statSub}>Gross Order Value</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Orders</span>
            <div className={styles.statValue}>{totalOrdersCount}</div>
            <span className={styles.statSub}>All-time placements</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Pending Orders</span>
            <div className={styles.statValue} style={{ color: pendingOrdersCount > 0 ? '#D97706' : 'var(--text-main)' }}>
              {pendingOrdersCount}
            </div>
            <span className={styles.statSub}>Awaiting fulfillment</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Catalog Items</span>
            <div className={styles.statValue}>{totalProductsCount}</div>
            <span className={styles.statSub}>Handcrafted products</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabsBar}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders & Shipments ({orders.length})
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'products' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Product Catalog & Stock ({products.length})
          </button>
        </div>

        {/* Tab Content: Orders */}
        {activeTab === 'orders' && (
          <div>
            <div className={styles.controlsBar}>
              <div className={styles.filterGroup}>
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
                  <button
                    key={st}
                    className={`${styles.filterBtn} ${statusFilter === st ? styles.filterActive : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st === 'all' ? 'All Orders' : st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search by order #, name, city, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Destination</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No orders matching this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <span
                            className={styles.orderNumLink}
                            onClick={() => setSelectedOrder(order)}
                          >
                            #{order.orderNumber}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{order.customer.firstName} {order.customer.lastName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.customer.phone}</div>
                        </td>
                        <td>{order.customer.city}</td>
                        <td>{order.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                        <td style={{ fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                        <td>
                          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', fontWeight: 500 }}>
                            {order.paymentMethod}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: order.paymentStatus === 'paid' ? '#15803D' : '#D97706' }}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className={styles.statusSelect}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className={styles.viewBtn}
                            onClick={() => setSelectedOrder(order)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Products */}
        {activeTab === 'products' && (
          <div className={styles.tableCard}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Stock Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const currentStock = stockMap[product.id] ?? 20;
                  return (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: '#eee' }}>
                            <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{product.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>{product.size || 'Standard'}</td>
                      <td style={{ fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            style={{ padding: '0.2rem 0.6rem', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', borderRadius: 3 }}
                            onClick={() => setStockMap(prev => ({ ...prev, [product.id]: Math.max(0, (prev[product.id] ?? 20) - 1) }))}
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 600, minWidth: 28, textAlign: 'center' }}>{currentStock}</span>
                          <button
                            style={{ padding: '0.2rem 0.6rem', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', borderRadius: 3 }}
                            onClick={() => setStockMap(prev => ({ ...prev, [product.id]: (prev[product.id] ?? 20) + 1 }))}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        {currentStock > 5 ? (
                          <span className={`${styles.badge} ${styles.badgeDelivered}`}>In Stock</span>
                        ) : currentStock > 0 ? (
                          <span className={`${styles.badge} ${styles.badgePending}`}>Low Stock</span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeCancelled}`}>Out of Stock</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Drawer/Modal */}
        {selectedOrder && (
          <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setSelectedOrder(null)}>
                &times;
              </button>

              <div className={styles.modalHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Order #{selectedOrder.orderNumber}</h2>
                  <span className={`${styles.badge} ${
                    selectedOrder.orderStatus === 'pending' ? styles.badgePending :
                    selectedOrder.orderStatus === 'processing' ? styles.badgeProcessing :
                    selectedOrder.orderStatus === 'shipped' ? styles.badgeShipped :
                    selectedOrder.orderStatus === 'delivered' ? styles.badgeDelivered : styles.badgeCancelled
                  }`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <div className={styles.modalSection}>
                <h4>Customer Information</h4>
                <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: 6, fontSize: '0.92rem' }}>
                  <p style={{ margin: '0 0 0.3rem', fontWeight: 600 }}>
                    {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                  </p>
                  <p style={{ margin: '0 0 0.3rem' }}>
                    Email: <a href={`mailto:${selectedOrder.customer.email}`} style={{ color: 'var(--accent)', textDecoration: 'underline' }}>{selectedOrder.customer.email}</a>
                  </p>
                  <p style={{ margin: '0 0 0.3rem' }}>
                    Phone: <a href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>{selectedOrder.customer.phone} (WhatsApp)</a>
                  </p>
                  <p style={{ margin: '0 0 0.3rem' }}>
                    Shipping Address: {selectedOrder.customer.address}, {selectedOrder.customer.city} {selectedOrder.customer.postalCode}
                  </p>
                  {selectedOrder.customer.notes && (
                    <p style={{ margin: '0.5rem 0 0', fontStyle: 'italic', color: '#6B7280' }}>
                      Instructions: &quot;{selectedOrder.customer.notes}&quot;
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.modalSection}>
                <h4>Ordered Handcrafted Items</h4>
                <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, padding: '0.8rem 1rem' }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className={styles.itemListRow}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.8rem', marginTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '1rem' }}>
                    <span>Order Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.modalSection}>
                <h4>Payment & Fulfillment Status</h4>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Payment Method</span>
                    <strong style={{ textTransform: 'uppercase' }}>{selectedOrder.paymentMethod}</strong>
                    {selectedOrder.paymentReference && (
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#4B5563' }}>
                        Ref: {selectedOrder.paymentReference}
                      </span>
                    )}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Payment Status</span>
                    <strong style={{ color: selectedOrder.paymentStatus === 'paid' ? '#15803D' : '#D97706', textTransform: 'uppercase' }}>
                      {selectedOrder.paymentStatus}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Update Order Status</span>
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                      className={styles.statusSelect}
                      style={{ marginTop: '0.2rem' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
