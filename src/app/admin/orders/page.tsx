'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import OrderTable from '@/components/admin/OrderTable';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/types';

export default function AdminOrders() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) { router.push('/'); return; }
    const load = async () => {
      const { getAllOrders } = await import('@/lib/firebase/db');
      const o = await getAllOrders();
      setOrders(o);
      setLoading(false);
    };
    load();
  }, [user, isAdmin, authLoading, router]);

  if (authLoading || loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8"><Skeleton className="h-8 w-48 mb-8" />{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg mb-3" />)}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild><a href="/admin"><ArrowLeft className="h-5 w-5" /></a></Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Pedidos ({orders.length})</h1>
      </div>
      <Card>
        <CardContent className="p-0">
          <OrderTable orders={orders} loading={false} />
        </CardContent>
      </Card>
    </div>
  );
}
