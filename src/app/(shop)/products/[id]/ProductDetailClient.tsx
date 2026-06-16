'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Truck, Shield, Check, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProductGallery from '@/components/product/ProductGallery';
import ReviewList from '@/components/product/ReviewList';
import ReviewForm from '@/components/product/ReviewForm';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, cn } from '@/lib/utils';
import { getProductImages } from '@/lib/product-images';
import type { Product } from '@/types';

export default function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
        <Link href="/" className="hover:text-zinc-300">Inicio</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-zinc-300">Productos</Link>
        <span>/</span>
        <span className="text-zinc-300">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} slug={product.slug} />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{product.brand}</Badge>
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="warning">Últimas {product.stock} unidades</Badge>
            )}
            {product.stock === 0 && <Badge variant="destructive">Agotado</Badge>}
          </div>

          <h1 className="text-2xl sm:text-3xl text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>{product.name}</h1>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn('h-4 w-4', i < Math.round(product.rating) ? 'fill-[#f4ed0b] text-[#f4ed0b]' : 'text-zinc-700 dark:text-zinc-600')} />
              ))}
            </div>
            <span className="text-sm text-zinc-500">({product.reviewCount} reseñas)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-3xl font-bold text-[#9fab26]">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-lg text-zinc-500 line-through">{formatPrice(product.comparePrice)}</span>
                <Badge variant="destructive">-{Math.round((1 - product.price / product.comparePrice) * 100)}%</Badge>
              </>
            )}
          </div>

          <p className="mt-6 text-zinc-400 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border border-zinc-700 rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-zinc-800 transition-colors rounded-l-xl">
                <Minus className="h-4 w-4 text-zinc-300" />
              </button>
              <span className="px-4 font-medium min-w-[40px] text-center text-zinc-100">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-zinc-800 transition-colors rounded-r-xl">
                <Plus className="h-4 w-4 text-zinc-300" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 h-14 text-base rounded-xl shadow-lg shadow-[#9fab26]/20"
              disabled={product.stock === 0}
              onClick={() => {
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0] || getProductImages(product.slug)[0],
                  quantity,
                  stock: product.stock,
                });
              }}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </Button>
          </div>

          <div className="mt-8 space-y-3 p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-[#9fab26]" />
              <span className="text-zinc-300">Envío gratis en compras mayores a S/200</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-[#9fab26]" />
              <span className="text-zinc-300">Compra segura con datos protegidos</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="h-5 w-5 text-[#9fab26]" />
              <span className="text-zinc-300">1 año de garantía en todos los productos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="details">
          <TabsList className="bg-zinc-800/50 border border-zinc-800">
            <TabsTrigger value="details" className="data-[state=active]:bg-[#9fab26]/10 data-[state=active]:text-[#9fab26]">Detalles</TabsTrigger>
            <TabsTrigger value="specs" className="data-[state=active]:bg-[#9fab26]/10 data-[state=active]:text-[#9fab26]">Especificaciones</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#9fab26]/10 data-[state=active]:text-[#9fab26]">Reseñas ({product.reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-6">
            <div className="text-zinc-400 leading-relaxed">
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="specs" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between p-3 bg-zinc-800/30 rounded-lg border border-zinc-800">
                  <span className="text-sm text-zinc-500">{key}</span>
                  <span className="text-sm font-medium text-zinc-200">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ReviewList productId={product.id} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-zinc-100 mb-4">Escribe tu reseña</h3>
                <ReviewForm productId={product.id} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
