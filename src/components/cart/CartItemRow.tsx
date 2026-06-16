'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-300"><ShoppingBag className="h-8 w-8" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{item.name}</h3>
        <p className="text-lg font-bold text-blue-600 mt-1">{formatPrice(item.price)}</p>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-zinc-300 dark:border-zinc-600 rounded-lg">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-3 text-sm font-medium min-w-[24px] text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <button
            onClick={() => removeItem(item.productId)}
            className="p-2 text-zinc-400 hover:text-red-500 transition-colors ml-auto"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
