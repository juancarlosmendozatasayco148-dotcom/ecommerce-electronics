import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-80 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
