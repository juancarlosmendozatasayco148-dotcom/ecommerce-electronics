'use client';

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { useCategories } from '@/hooks/useProducts';
import type { Product, ProductFilters as Filters } from '@/types';

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const { categories } = useCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollLock = useRef(0);
  const prevCategory = useRef<string | undefined>('__init__');
  const prevSortBy = useRef<string | undefined>('__init__');
  const prevSearch = useRef<string | undefined>('__init__');

  const [filters, setFilters] = useState<Filters>({
    category: searchParams.get('category') || undefined,
    sortBy: (searchParams.get('sortBy') as Filters['sortBy']) || 'newest',
    search: searchParams.get('search') || undefined,
    page: 1,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get('category') || undefined,
      sortBy: (searchParams.get('sortBy') as Filters['sortBy']) || 'newest',
      search: searchParams.get('search') || undefined,
      page: 1,
    }));
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    const isNewNav = prevCategory.current !== filters.category ||
                     prevSortBy.current !== filters.sortBy ||
                     prevSearch.current !== filters.search;
    prevCategory.current = filters.category;
    prevSortBy.current = filters.sortBy;
    prevSearch.current = filters.search;

    if (isNewNav) {
      window.scrollTo(0, 0);
      scrollLock.current = 0;
    } else {
      scrollLock.current = window.scrollY;
    }
    setLoading(true);
    try {
      const { getProducts } = await import('@/lib/firebase/db');
      const result = await getProducts(filters);
      setProducts(result.items);
      setTotal(result.total);
    } catch {} finally {
      setLoading(false);
    }
  }, [filters]);

  useLayoutEffect(() => {
    if (!loading && scrollLock.current > 0) {
      window.scrollTo(0, scrollLock.current);
      scrollLock.current = 0;
    }
  }, [loading]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchQuery || undefined, page: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>Productos</h1>
        <p className="text-zinc-500 mt-1">{total} productos encontrados</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-full bg-zinc-800/80 border-0 text-zinc-100 placeholder:text-zinc-500"
          />
        </div>
      </form>

      <div className="flex gap-8 items-start">
        <ProductFilters categories={categories} filters={filters} onFiltersChange={setFilters} />
        <div className="flex-1 min-w-0 min-h-[calc(100vh-14rem)]">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}
