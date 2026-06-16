'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { getProductImages } from '@/lib/product-images';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  index?: number;
}

export default function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const images = product.images.length > 0 ? product.images : getProductImages(product.slug);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative bg-[#171717] rounded-2xl border border-zinc-800 overflow-hidden transition-all duration-500 hover:border-zinc-700 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1"
    >
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-zinc-900">
        {images[0] && !imgError ? (
          <Image
            src={images[0]}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-zinc-900">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-zinc-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
          </div>
        )}
        {product.comparePrice && product.comparePrice > product.price && (
          <Badge variant="destructive" className="absolute top-3 left-3">
            -{Math.round((1 - product.price / product.comparePrice) * 100)}%
          </Badge>
        )}
        <button
          title="Agregar a favoritos"
          onClick={(e) => { e.preventDefault(); toast.info('Función de favoritos próximamente'); }}
          className="absolute top-3 right-3 p-2.5 bg-black/60 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 hover:scale-110"
        >
          <Heart className="h-4 w-4 text-zinc-300" />
        </button>
      </Link>

      <div className="p-4 sm:p-5">
        <p className="text-xs text-zinc-500 mb-1.5 tracking-wide uppercase">{product.brand}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-sm text-zinc-100 line-clamp-2 hover:text-[#9fab26] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-3 w-3',
                i < Math.round(product.rating)
                  ? 'fill-[#f4ed0b] text-[#f4ed0b]'
                  : 'text-zinc-700'
              )}
            />
          ))}
          <span className="text-xs text-zinc-500 ml-1.5">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-[#9fab26]">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-zinc-500 line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>

        <Button
          size="sm"
          className="w-full mt-4 h-9 rounded-xl"
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0] || '',
              quantity: 1,
              stock: product.stock,
            })
          }
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Agotado' : 'Agregar'}
        </Button>
      </div>
    </motion.div>
  );
}
