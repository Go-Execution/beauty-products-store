import { useEffect, useState, useCallback } from 'react';
import { Product, products as defaultProducts } from '@/data/products';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_PRODUCTS_KEY = 'baraka_live_products';

// Helper to get client-side live products with fallback
export const getLocalProducts = (): Product[] => {
  if (typeof window === 'undefined') return defaultProducts;
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProducts;
  } catch (err) {
    console.error('Error reading products from localStorage:', err);
    return defaultProducts;
  }
};

// Helper to save client-side products
export const saveLocalProducts = (items: Product[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('baraka_products_updated'));
  } catch (err) {
    console.error('Error saving products to localStorage:', err);
  }
};

// Fetch products from Supabase (or fallback to local)
export const fetchProducts = async (): Promise<Product[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Product[] = data.map((row: any) => ({
          id: String(row.id),
          name: row.name,
          category: row.category,
          price: Number(row.price),
          compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
          size: row.size || '',
          image: row.image,
          secondaryImage: row.secondary_image || undefined,
          description: row.description,
          longDescription: row.long_description || row.description,
          ingredients: row.ingredients || '',
          directions: row.directions || '',
          howToUse: row.directions || '',
          variants: row.variants || [],
          stockQuantity: row.stock_quantity ?? 50,
          isActive: row.is_active ?? true
        }));
        saveLocalProducts(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Could not fetch products from Supabase, using local catalog:', e);
    }
  }

  return getLocalProducts();
};

// Save / Create / Update a product
export const saveProduct = async (productData: Partial<Product> & { name: string; price: number; category: string }): Promise<Product> => {
  const isNew = !productData.id;
  const productId = productData.id || `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const finalProduct: Product = {
    id: productId,
    name: productData.name,
    category: productData.category,
    price: Number(productData.price),
    compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : undefined,
    size: productData.size || '',
    image: productData.image || '/assets/images/products/shampoo.jpeg',
    secondaryImage: productData.secondaryImage || undefined,
    description: productData.description || productData.name,
    longDescription: productData.longDescription || productData.description || productData.name,
    ingredients: productData.ingredients || '',
    directions: productData.directions || '',
    howToUse: productData.directions || '',
    variants: productData.variants || [],
    stockQuantity: productData.stockQuantity ?? 50,
    isActive: productData.isActive ?? true
  };

  // 1. If Supabase is connected, upsert into Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const payload: any = {
        id: finalProduct.id,
        name: finalProduct.name,
        category: finalProduct.category,
        price: finalProduct.price,
        compare_at_price: finalProduct.compareAtPrice || null,
        size: finalProduct.size || null,
        image: finalProduct.image,
        secondary_image: finalProduct.secondaryImage || null,
        description: finalProduct.description,
        long_description: finalProduct.longDescription,
        ingredients: finalProduct.ingredients || null,
        directions: finalProduct.directions || null,
        variants: finalProduct.variants || [],
        stock_quantity: finalProduct.stockQuantity ?? 50,
        is_active: finalProduct.isActive ?? true
      };

      const { error } = await supabase.from('products').upsert(payload);
      if (error) {
        console.warn('Supabase product upsert warning:', error.message);
      }
    } catch (e) {
      console.warn('Supabase upsert failed, saving to local store:', e);
    }
  }

  // 2. Update local state
  const current = getLocalProducts();
  const existingIdx = current.findIndex(p => p.id === productId);
  let updated: Product[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = finalProduct;
  } else {
    updated = [finalProduct, ...current];
  }
  saveLocalProducts(updated);

  return finalProduct;
};

// Delete a product
export const deleteProduct = async (productId: string): Promise<boolean> => {
  // 1. If Supabase is connected, delete from DB
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        console.warn('Supabase delete warning:', error.message);
      }
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  // 2. Remove from local store
  const current = getLocalProducts();
  const updated = current.filter(p => p.id !== productId);
  saveLocalProducts(updated);

  return true;
};

// Custom React Hook to consume live products with automatic synchronization
export const useLiveProducts = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProductsList(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();

    const handleUpdate = () => {
      setProductsList(getLocalProducts());
    };

    window.addEventListener('baraka_products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('baraka_products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [reload]);

  return {
    products: productsList,
    loading,
    refresh: reload,
    saveProduct,
    deleteProduct
  };
};
