'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Category, ProductFilters as Filters } from '@/types';

interface ProductFiltersProps {
  categories: Category[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function ProductFilters({ categories, filters, onFiltersChange }: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const debouncedMin = useDebounce(minInput, 400);
  const debouncedMax = useDebounce(maxInput, 400);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      setMinInput(filters.minPrice?.toString() || '');
      setMaxInput(filters.maxPrice?.toString() || '');
      return;
    }
    onFiltersChange({
      ...filters,
      minPrice: debouncedMin ? Number(debouncedMin) : undefined,
      maxPrice: debouncedMax ? Number(debouncedMax) : undefined,
      page: 1,
    });
  }, [debouncedMin, debouncedMax]);

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    setMinInput('');
    setMaxInput('');
    onFiltersChange({});
  };

  const hasFilters = Object.keys(filters).length > 0;

  const filterContent = useMemo(() => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-zinc-100 mb-3">Categorías</h4>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('category', undefined)}
            className={cn(
              'block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
              !filters.category
                ? 'bg-[#9fab26]/10 text-[#9fab26] font-medium'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            )}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.id)}
              className={cn(
                'block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                filters.category === cat.id
                  ? 'bg-[#9fab26]/10 text-[#9fab26] font-medium'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-zinc-100 mb-3">Precio</h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Mín"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            className="h-9 text-sm"
          />
          <span className="text-zinc-500">-</span>
          <Input
            type="number"
            placeholder="Máx"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-zinc-100 mb-3">Ordenar por</h4>
        <Select
          value={filters.sortBy || 'newest'}
          onValueChange={(v) => updateFilter('sortBy', v as Filters['sortBy'])}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="price_asc">Menor precio</SelectItem>
            <SelectItem value="price_desc">Mayor precio</SelectItem>
            <SelectItem value="rating">Mejor rating</SelectItem>
            <SelectItem value="name">Nombre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-red-400 hover:text-red-300 hover:bg-zinc-800">
          <X className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
      )}
    </div>
  ), [categories, filters.category, filters.sortBy, filters.minPrice, filters.maxPrice, hasFilters, minInput, maxInput]);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
        {hasFilters && (
          <span className="w-2 h-2 rounded-full bg-[#9fab26]" />
        )}
      </button>

      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-36">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-100">Filtros</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-[#9fab26] hover:text-[#9fab26]/80">
                Limpiar
              </button>
            )}
          </div>
          {filterContent}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-[#121212] p-6 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-zinc-100">Filtros</h3>
              <button onClick={() => setMobileOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
