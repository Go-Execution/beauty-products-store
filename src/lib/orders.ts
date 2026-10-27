import { Order, OrderStatus } from '@/types/ecommerce';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_ORDERS_KEY = 'baraka_beauty_orders';

// Initial demo orders for admin visualization if empty
const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord_sample_01',
    orderNumber: 'BB-100234',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    customer: {
      firstName: 'Amina',
      lastName: 'Sheikh',
      email: 'amina.sheikh@example.com',
      phone: '+92 300 1234567',
      address: 'House 42, Street 8, Sector F-7/2',
      city: 'Islamabad',
      postalCode: '44000',
      notes: 'Please deliver after 2 PM'
    },
    items: [
      {
        id: '7',
        name: 'Snow White Body Treatment Cream',
        price: 39.99,
        quantity: 1,
        image: '/assets/images/products/snow-white-cream.jpeg',
        category: 'Body Care'
      },
      {
        id: '10',
        name: 'Hibiscus Glow Facial Soap',
        price: 9.99,
        quantity: 2,
        image: '/assets/images/products/hibiscus-soap.jpeg',
        category: 'Artisan Soaps'
      }
    ],
    subtotal: 59.97,
    shippingFee: 0,
    total: 59.97,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'pending'
  },
  {
    id: 'ord_sample_02',
    orderNumber: 'BB-100231',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    customer: {
      firstName: 'Zainab',
      lastName: 'Tariq',
      email: 'zainab.t@example.com',
      phone: '+92 321 9876543',
      address: 'Apartment 4B, Clifton Block 5',
      city: 'Karachi',
      postalCode: '75600'
    },
    items: [
      {
        id: '11',
        name: 'Frankincense Radiance Soap',
        price: 9.99,
        quantity: 1,
        image: '/assets/images/products/frankincense-soap.jpeg',
        category: 'Artisan Soaps'
      },
      {
        id: '13',
        name: 'Pure Lemon Radiance Soap',
        price: 9.99,
        quantity: 1,
        image: '/assets/images/products/lemon-radiance-soap.jpeg',
        category: 'Artisan Soaps'
      }
    ],
    subtotal: 19.98,
    shippingFee: 0,
    total: 19.98,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'processing'
  }
];

// Helper to get local orders
export const getLocalOrders = (): Order[] => {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_ORDERS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_SAMPLE_ORDERS));
      return INITIAL_SAMPLE_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read orders from localStorage:', err);
    return INITIAL_SAMPLE_ORDERS;
  }
};

// Helper to save local orders
export const saveLocalOrders = (orders: Order[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to write orders to localStorage:', err);
  }
};

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus'>): Promise<Order> => {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `BB-${randomSuffix}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...orderData,
    id: `ord_${Date.now()}_${randomSuffix}`,
    orderNumber,
    createdAt: now,
    orderStatus: 'pending'
  };

  // 1. If Supabase is configured, save to Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: orderRow, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
          customer_email: orderData.customer.email,
          customer_phone: orderData.customer.phone,
          shipping_address: orderData.customer.address,
          city: orderData.customer.city,
          postal_code: orderData.customer.postalCode,
          order_notes: orderData.customer.notes || null,
          payment_method: orderData.paymentMethod,
          payment_status: orderData.paymentStatus,
          order_status: 'pending',
          payment_reference: orderData.paymentReference || null,
          subtotal: orderData.subtotal,
          shipping_fee: orderData.shippingFee,
          total: orderData.total,
          items_json: orderData.items
        })
        .select()
        .single();

      if (orderError) {
        console.warn('Supabase order insert warning (falling back to local):', orderError.message);
      } else if (orderRow) {
        // Also insert individual items into order_items if table exists
        const itemsToInsert = orderData.items.map(item => ({
          order_id: orderRow.id,
          product_id: item.id,
          product_name: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          image_url: item.image
        }));
        await supabase.from('order_items').insert(itemsToInsert);
      }
    } catch (e) {
      console.warn('Supabase insertion failed, saved locally:', e);
    }
  }

  // 2. Always store in local orders so user gets immediate visual feedback and admin works
  const existing = getLocalOrders();
  saveLocalOrders([newOrder, ...existing]);

  return newOrder;
};

// Fetch all orders for the Admin portal
export const fetchOrders = async (): Promise<Order[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map Supabase rows to Order type
        return data.map((row: any) => ({
          id: row.id,
          orderNumber: row.order_number,
          createdAt: row.created_at,
          customer: {
            firstName: row.customer_name.split(' ')[0] || '',
            lastName: row.customer_name.split(' ').slice(1).join(' ') || '',
            email: row.customer_email,
            phone: row.customer_phone,
            address: row.shipping_address,
            city: row.city,
            postalCode: row.postal_code,
            notes: row.order_notes || ''
          },
          items: row.items_json || [],
          subtotal: Number(row.subtotal),
          shippingFee: Number(row.shipping_fee || 0),
          total: Number(row.total),
          paymentMethod: row.payment_method,
          paymentStatus: row.payment_status,
          orderStatus: row.order_status,
          paymentReference: row.payment_reference
        }));
      }
    } catch (e) {
      console.warn('Could not fetch from Supabase, using local fallback:', e);
    }
  }

  return getLocalOrders();
};

// Update order status (Pending -> Processing -> Shipped -> Delivered -> Cancelled)
export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus): Promise<boolean> => {
  let updatedSuccessfully = false;

  // Update in Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (!error) updatedSuccessfully = true;
    } catch (e) {
      console.warn('Failed to update order status in Supabase:', e);
    }
  }

  // Update in local orders
  const existing = getLocalOrders();
  const updated = existing.map(o => (o.id === orderId || o.orderNumber === orderId) ? { ...o, orderStatus: newStatus } : o);
  saveLocalOrders(updated);

  return true;
};
