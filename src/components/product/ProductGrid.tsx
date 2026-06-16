import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  const initialLoad = loading && products.length === 0;

  return (
    <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 min-h-[500px]">
      {initialLoad ? (
        Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-700 overflow-hidden">
            <Skeleton className="aspect-square" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>
        ))
      ) : products.length === 0 ? (
        <div className="col-span-full min-h-[500px] flex items-center justify-center">
          <div className="text-center py-20">
            <p className="text-lg text-zinc-500">No se encontraron productos</p>
          </div>
        </div>
      ) : (
        products.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 4} index={i} />
        ))
      )}
      {loading && products.length > 0 && (
        <div className="absolute inset-0 bg-black/20 rounded-xl z-10 flex items-start justify-center pt-8">
          <div className="w-6 h-6 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
