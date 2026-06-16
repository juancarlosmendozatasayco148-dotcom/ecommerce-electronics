'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProducts, getProduct, getFeaturedProducts, getCategories } from '@/lib/firebase/db';
import type { Product, Category, ProductFilters, PaginatedResponse } from '@/types';

export function useProducts(filters?: ProductFilters) {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProducts(filters);
      setData(result);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products: data?.items || [], total: data?.total || 0, totalPages: data?.totalPages || 0, loading, refetch: fetch };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  return { product, loading };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((c) => {
      setCategories(c);
      setLoading(false);
    });
  }, []);

  return { categories, loading };
}
