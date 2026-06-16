'use client';

import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderSummary() {
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 200 ? 0 : 15;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resumen de compra</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-zinc-500 truncate max-w-[200px]">
                {item.name} x{item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Envío</span>
            <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
              {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">IGV (18%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-200 dark:border-zinc-700">
            <span>Total</span>
            <span className="text-blue-600">{formatPrice(total)}</span>
          </div>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-zinc-400 text-center pt-2">
            Agrega S/ {formatPrice(200 - subtotal).replace('S/ ', '')} más para envío gratis
          </p>
        )}
      </CardContent>
    </Card>
  );
}
