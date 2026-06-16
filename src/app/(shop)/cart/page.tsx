'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CartItemRow from '@/components/cart/CartItemRow';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const { items } = useCartStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild><Link href="/products"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <h1 className="text-2xl sm:text-3xl text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>Carrito de compras</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-20 w-20 mx-auto text-zinc-600 mb-6" />
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">Tu carrito está vacío</h2>
          <p className="text-zinc-500 mb-8">Agrega productos para empezar a comprar</p>
          <Button asChild size="lg"><Link href="/products">Ver productos</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>{items.length} {items.length === 1 ? 'producto' : 'productos'}</CardTitle></CardHeader>
              <CardContent className="divide-y divide-zinc-800">
                {items.map((item) => <CartItemRow key={item.productId} item={item} />)}
              </CardContent>
            </Card>
          </div>
          <div>
            <OrderSummary />
            <Button asChild className="w-full mt-4 h-12 text-base"><Link href="/checkout">Proceder al pago</Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
