'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';

export default function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const getItemCount = useCartStore((s) => s.getItemCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const count = getItemCount();
  if (count === 0) return null;

  return (
    <Badge
      variant="default"
      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold"
    >
      {count > 9 ? '9+' : count}
    </Badge>
  );
}
