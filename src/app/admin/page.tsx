"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchOrders, updateOrderStatus } from '@/lib/orders';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useLiveProducts } from '@/lib/products';
import { Order, OrderStatus } from '@/types/ecommerce';
import { Product, ProductVariant, CATEGORIES } from '@/data/products';
import styles from './Admin.module.css';

// Preset beauty images for quick selection when creating products
const PRESET_IMAGES = [
  { label: 'Lemon Radiance Soap', url: '/assets/images/products/lemon-radiance-soap.jpeg' },
  { label: 'Hibiscus Glow Soap', url: '/assets/images/products/hibiscus-soap.jpeg' },
  { label: 'Coffee & Cocoa Soap', url: '/assets/images/products/coffee-cocoa-soap.jpeg' },
  { label: 'Frankincense Radiance Soap', url: '/assets/images/products/frankincense-soap.jpeg' },
  { label: 'Snow White Cream', url: '/assets/images/products/snow-white-cream.jpeg' },
  { label: 'Arab Oud Cream', url: '/assets/images/products/arab-oud-cream.jpeg' },
  { label: 'Hair Growth Shampoo', url: '/assets/images/products/shampoo.jpeg' },
  { label: 'Miracle Hair Oil', url: '/assets/images/products/hair-oil.jpeg' },
  { label: 'Frizzy Hair Cream', url: '/assets/images/products/frizzy-hair-cream.jpeg' },
  { label: 'Rapunzel Hair Spray', url: '/assets/images/products/rapunzel-spray.jpeg' },
  { label: 'Smell Me Roll-On Oil', url: '/assets/images/products/smell-me-rollon.jpeg' },
  { label: 'Smells Great Perfume', url: '/assets/images/products/smells-great-perfume.jpeg' },
  { label: 'Purple Floral Candle', url: '/assets/images/products/candle-purple-floral.jpeg' },
  { label: 'Golden Pearl Candle', url: '/assets/images/products/candle-golden-pearl.jpeg' },
  { label: 'Ocean Azure Candle', url: '/assets/images/products/candle-ocean-azure.jpeg' },
  { label: 'Amethyst Gems Candle', url: '/assets/images/products/candle-amethyst-gems.jpeg' },
  { label: 'Sunburst Pearl Candle', url: '/assets/images/products/candle-sunburst-pearl.jpeg' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  // Live Products CRUD Hook
  const { products: liveProducts, saveProduct, deleteProduct, refresh: refreshProducts } = useLiveProducts();

  // Dashboard Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState<{
    name: string;
    category: string;
    price: string;
    compareAtPrice: string;
    size: string;
    image: string;
    secondaryImage: string;
    description: string;
    longDescription: string;
    ingredients: string;
    directions: string;
    stockQuantity: string;
    variants: ProductVariant[];
  }>({
    name: '',
    category: 'Artisan Soaps',
    price: '',
    compareAtPrice: '',
    size: '',
    image: PRESET_IMAGES[0].url,
    secondaryImage: '',
    description: '',
    longDescription: '',
    ingredients: '',
    directions: '',
    stockQuantity: '50',
    variants: []
  });

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedAuth = sessionStorage.getItem('baraka_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadOrders();
    }
  }, []);

  const loadOrders = async () => {
    const loadedOrders = await fetchOrders();
    setOrders(loadedOrders);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'baraka2026' || passcode.trim() === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('baraka_admin_auth', 'true');
      setErrorMsg('');
      loadOrders();
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

  // Open Create Product Modal
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductFormData({
      name: '',
      category: 'Artisan Soaps',
      price: '9.99',
      compareAtPrice: '',
      size: 'Artisan Bar',
      image: PRESET_IMAGES[0].url,
      secondaryImage: '',
      description: '',
      longDescription: '',
      ingredients: '',
      directions: '',
      stockQuantity: '50',
      variants: [
        { id: `var_${Date.now()}_1`, name: 'Single Bar', price: 9.99, stockQuantity: 50 },
        { id: `var_${Date.now()}_2`, name: '3-Bar Value Bundle', price: 24.99, stockQuantity: 30 }
      ]
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductFormData({
      name: p.name,
      category: p.category,
      price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
      size: p.size || '',
      image: p.image,
      secondaryImage: p.secondaryImage || '',
      description: p.description,
      longDescription: p.longDescription || p.description,
      ingredients: p.ingredients || '',
      directions: p.directions || p.howToUse || '',
      stockQuantity: String(p.stockQuantity ?? 50),
      variants: p.variants && p.variants.length > 0 ? [...p.variants] : []
    });
    setIsProductModalOpen(true);
  };

  // Add a variant row
  const handleAddVariantRow = () => {
    const newVariant: ProductVariant = {
      id: `var_${Date.now()}_${Math.floor(Math.random() * 100)}`,
      name: 'Special Edition',
      price: Number(productFormData.price) || 9.99,
      stockQuantity: 25
    };
    setProductFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
  };

  // Update variant row
  const handleUpdateVariant = (index: number, field: keyof ProductVariant, val: any) => {
    setProductFormData(prev => {
      const nextVars = [...prev.variants];
      nextVars[index] = { ...nextVars[index], [field]: val };
      return { ...prev, variants: nextVars };
    });
  };

  // Remove variant row
  const handleRemoveVariant = (index: number) => {
    setProductFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, idx) => idx !== index)
    }));
  };

  // Save / Update product
  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name.trim() || !productFormData.price) {
      alert('Please enter a product name and price.');
      return;
    }

    await saveProduct({
      id: editingProductId || undefined,
      name: productFormData.name.trim(),
      category: productFormData.category,
      price: parseFloat(productFormData.price) || 0,
      compareAtPrice: productFormData.compareAtPrice ? parseFloat(productFormData.compareAtPrice) : undefined,
      size: productFormData.size.trim(),
      image: productFormData.image.trim(),
      secondaryImage: productFormData.secondaryImage.trim() || undefined,
      description: productFormData.description.trim(),
      longDescription: productFormData.longDescription.trim() || productFormData.description.trim(),
      ingredients: productFormData.ingredients.trim(),
      directions: productFormData.directions.trim(),
      howToUse: productFormData.directions.trim(),
      stockQuantity: parseInt(productFormData.stockQuantity, 10) || 50,
      variants: productFormData.variants.map(v => ({
        ...v,
        price: Number(v.price) || 0,
        stockQuantity: Number(v.stockQuantity) || 0
      }))
    });

    setIsProductModalOpen(false);
    refreshProducts();
  };

  // Delete product confirmation
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id);
    setProductToDelete(null);
    refreshProducts();
  };

  if (!mounted) return null;

  // 1. Passcode Gate
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
              Store operations, product uploads, variant management, and live order fulfillment.
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

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' || o.paymentMethod === 'cod' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'pending').length;
  const totalProductsCount = liveProducts.length;

  // Filtered Orders
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

  // Filtered Products
  const filteredProducts = liveProducts.filter(p => {
    const matchesCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    const q = productSearchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)) || p.id.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <main className="container page-wrapper">
      <div className={styles.adminContainer}>
        {/* Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.headerLeft}>
            <h1>Baraka Store Operations</h1>
            <p>Full Product CRUD (Add, Edit, Delete, Variants) & Real-time Orders.</p>
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
            <span className={styles.statSub}>Live products in store</span>
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
            Product Catalog & CRUD ({liveProducts.length})
          </button>
        </div>

        {/* TAB 1: ORDERS */}
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

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div>
            <div className={styles.productsToolbar}>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(0,0,0,0.18)',
                    fontSize: '0.88rem',
                    background: '#FFF'
                  }}
                >
                  <option value="All">All Categories ({liveProducts.length})</option>
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  style={{ minWidth: '240px' }}
                />
              </div>

              <button onClick={handleOpenAddProduct} className={styles.addProductBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>+ Upload / Add New Product</span>
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Size / Details</th>
                    <th>Base Price</th>
                    <th>Variants</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No products found in this category.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => {
                      const variantsCount = product.variants ? product.variants.length : 0;
                      return (
                        <tr key={product.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                              <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#eee' }}>
                                <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 600 }}>{product.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {product.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.82rem', background: '#F3F4F6', padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                              {product.category}
                            </span>
                          </td>
                          <td>{product.size || 'Standard'}</td>
                          <td style={{ fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                          <td>
                            {variantsCount > 0 ? (
                              <span style={{ fontSize: '0.8rem', background: '#EEF2FF', color: '#4338CA', padding: '0.2rem 0.6rem', borderRadius: 4, fontWeight: 500 }}>
                                {variantsCount} Options
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Single SKU</span>
                            )}
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{product.stockQuantity ?? 50}</span>
                          </td>
                          <td>
                            {(product.stockQuantity ?? 50) > 5 ? (
                              <span className={`${styles.badge} ${styles.badgeDelivered}`}>In Stock</span>
                            ) : (product.stockQuantity ?? 50) > 0 ? (
                              <span className={`${styles.badge} ${styles.badgePending}`}>Low Stock</span>
                            ) : (
                              <span className={`${styles.badge} ${styles.badgeCancelled}`}>Out of Stock</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className={styles.actionBtnGroup} style={{ justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleOpenEditProduct(product)}
                                className={styles.editBtn}
                                title="Edit product and variants"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setProductToDelete(product)}
                                className={styles.deleteBtn}
                                title="Delete product permanently"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT PRODUCT */}
        {isProductModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsProductModalOpen(false)}>
            <div className={styles.productModalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setIsProductModalOpen(false)}>
                &times;
              </button>

              <div className={styles.modalHeader}>
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>
                  {editingProductId ? 'Edit Product & Variants' : 'Upload / Add New Handcrafted Product'}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                  {editingProductId ? 'Update specifications, pricing, stock, and variant configurations.' : 'Add a new beauty item to your storefront catalog.'}
                </p>
              </div>

              <form onSubmit={handleSaveProductSubmit}>
                <div className={styles.formGridTwoCol}>
                  {/* Name */}
                  <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                    <label htmlFor="prodName">Product Title *</label>
                    <input
                      type="text"
                      id="prodName"
                      required
                      placeholder="e.g. Saffron & Honey Glow Soap"
                      value={productFormData.name}
                      onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    />
                  </div>

                  {/* Category */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="prodCat">Category *</label>
                    <select
                      id="prodCat"
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    >
                      <option value="Artisan Soaps">Artisan Soaps</option>
                      <option value="Body Care">Body Care</option>
                      <option value="Hair Care">Hair Care</option>
                      <option value="Perfumes & Oils">Perfumes & Oils</option>
                      <option value="Candles">Candles</option>
                      <option value="Face Care">Face Care</option>
                      <option value="Wellness & Bath">Wellness & Bath</option>
                    </select>
                  </div>

                  {/* Size / Volume */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="prodSize">Size / Packaging *</label>
                    <input
                      type="text"
                      id="prodSize"
                      placeholder="e.g. Artisan Bar, 250ml, 32 oz Jar"
                      value={productFormData.size}
                      onChange={(e) => setProductFormData({ ...productFormData, size: e.target.value })}
                    />
                  </div>

                  {/* Base Price */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="prodPrice">Base Selling Price ($) *</label>
                    <input
                      type="number"
                      id="prodPrice"
                      step="0.01"
                      required
                      placeholder="9.99"
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    />
                  </div>

                  {/* Compare at Price */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="prodCompPrice">Original / Compare-At Price ($) (Optional)</label>
                    <input
                      type="number"
                      id="prodCompPrice"
                      step="0.01"
                      placeholder="e.g. 14.99 (for discount display)"
                      value={productFormData.compareAtPrice}
                      onChange={(e) => setProductFormData({ ...productFormData, compareAtPrice: e.target.value })}
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="prodStock">Initial Stock Quantity</label>
                    <input
                      type="number"
                      id="prodStock"
                      placeholder="50"
                      value={productFormData.stockQuantity}
                      onChange={(e) => setProductFormData({ ...productFormData, stockQuantity: e.target.value })}
                    />
                  </div>

                  {/* Primary Image */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="prodImg">Product Image URL / Asset *</label>
                    <input
                      type="text"
                      id="prodImg"
                      required
                      placeholder="/assets/images/products/... or https://..."
                      value={productFormData.image}
                      onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                    />
                  </div>

                  {/* Image Presets & Preview */}
                  <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                    <label>Or Choose From Existing Handcrafted Product Photos:</label>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                      {PRESET_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProductFormData({ ...productFormData, image: img.url })}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.78rem',
                            borderRadius: '4px',
                            border: productFormData.image === img.url ? '1.5px solid var(--text-main)' : '1px solid #D1D5DB',
                            background: productFormData.image === img.url ? '#FAF5EE' : '#FFF',
                            cursor: 'pointer'
                          }}
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>

                    <div className={styles.imagePreviewSection}>
                      <div className={styles.previewThumbnail}>
                        <Image
                          src={productFormData.image || PRESET_IMAGES[0].url}
                          alt="Preview"
                          fill
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as any).src = PRESET_IMAGES[0].url;
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Live thumbnail preview
                      </span>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                    <label htmlFor="prodDesc">Short Summary *</label>
                    <input
                      type="text"
                      id="prodDesc"
                      required
                      placeholder="Brief one-line summary for product cards and quick views..."
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    />
                  </div>

                  {/* Long Description */}
                  <div className={`${styles.fieldGroup} ${styles.fullCol}`}>
                    <label htmlFor="prodLongDesc">Full Botanical Description</label>
                    <textarea
                      id="prodLongDesc"
                      rows={3}
                      placeholder="Detailed craftsmanship, botanical benefits, and sensory notes..."
                      value={productFormData.longDescription}
                      onChange={(e) => setProductFormData({ ...productFormData, longDescription: e.target.value })}
                    />
                  </div>

                  {/* Ingredients */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="prodIng">Ingredients</label>
                    <textarea
                      id="prodIng"
                      rows={2}
                      placeholder="e.g. Pure plant glycerin, essential oils, shea butter..."
                      value={productFormData.ingredients}
                      onChange={(e) => setProductFormData({ ...productFormData, ingredients: e.target.value })}
                    />
                  </div>

                  {/* Directions */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="prodDir">Directions / How To Use</label>
                    <textarea
                      id="prodDir"
                      rows={2}
                      placeholder="e.g. Lather over wet skin in circular motions, then rinse..."
                      value={productFormData.directions}
                      onChange={(e) => setProductFormData({ ...productFormData, directions: e.target.value })}
                    />
                  </div>
                </div>

                {/* VARIANTS BUILDER */}
                <div className={styles.variantsCard}>
                  <div className={styles.variantsCardHeader}>
                    <div>
                      <h4>Product Variants (Sizes / Bundles / Options)</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Allow customers to pick different bundle sizes, pack options, or volumes with customized prices.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariantRow}
                      className={styles.addVariantBtn}
                    >
                      + Add Variant
                    </button>
                  </div>

                  {productFormData.variants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.2rem', color: '#9CA3AF', fontSize: '0.85rem' }}>
                      No variants added. This product will be sold as a single standard option. Click <strong>+ Add Variant</strong> above to add size or bundle choices.
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 32px', gap: '0.8rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                        <span>Variant Name / Option</span>
                        <span>Price ($)</span>
                        <span>Stock</span>
                        <span></span>
                      </div>
                      {productFormData.variants.map((v, idx) => (
                        <div key={v.id} className={styles.variantRow}>
                          <input
                            type="text"
                            placeholder="e.g. 100ml / 3-Bar Bundle"
                            value={v.name}
                            onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: 4, fontSize: '0.88rem' }}
                          />
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={v.price}
                            onChange={(e) => handleUpdateVariant(idx, 'price', e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: 4, fontSize: '0.88rem' }}
                          />
                          <input
                            type="number"
                            placeholder="Stock"
                            value={v.stockQuantity ?? 50}
                            onChange={(e) => handleUpdateVariant(idx, 'stockQuantity', e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: 4, fontSize: '0.88rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className={styles.variantRemoveBtn}
                            title="Remove variant"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cta-button">
                    {editingProductId ? 'Save Changes' : 'Publish Product to Store'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE CONFIRMATION */}
        {productToDelete && (
          <div className={styles.modalOverlay} onClick={() => setProductToDelete(null)}>
            <div className={styles.confirmDeleteCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.deleteIconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </div>

              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Remove Product?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Are you sure you want to permanently remove <strong>{productToDelete.name}</strong>? This item will be removed from your catalog and Supabase database immediately.
              </p>

              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  style={{
                    background: '#DC2626',
                    color: '#FFF',
                    border: 'none',
                    padding: '0.65rem 1.4rem',
                    borderRadius: 4,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Yes, Remove Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ORDER DETAILS */}
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
