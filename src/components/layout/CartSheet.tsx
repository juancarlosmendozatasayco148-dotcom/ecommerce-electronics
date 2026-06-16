'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatPrice } from '@/lib/utils';

export default function CartSheet() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = subtotal >= 200 ? 0 : 15;

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrito ({items.length} {items.length === 1 ? 'producto' : 'productos'})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
            <ShoppingBag className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Tu carrito está vacío</p>
            <p className="text-sm mt-1">Agrega productos para empezar a comprar</p>
            <Button asChild className="mt-6" onClick={closeCart}>
              <Link href="/products">Ver productos</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-180px)]">
            <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 py-4 border-b border-zinc-800">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-300">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">{item.name}</p>
                    <p className="text-sm font-semibold text-[#9fab26] mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto p-1 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Envío</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-zinc-800">
                <span>Total</span>
                <span>{formatPrice(subtotal + shipping)}</span>
              </div>
              <Button asChild className="w-full h-12 text-base" onClick={closeCart}>
                <Link href="/checkout">Ir a pagar</Link>
              </Button>
              <Button variant="outline" asChild className="w-full" onClick={closeCart}>
                <Link href="/products">Seguir comprando</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
