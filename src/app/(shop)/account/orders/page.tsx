'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order } from '@/types';

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  pending: 'warning', confirmed: 'secondary', processing: 'default', shipped: 'default', delivered: 'success', cancelled: 'destructive',
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) {
      const load = async () => {
        const { getUserOrders } = await import('@/lib/firebase/db');
        const o = await getUserOrders(user.uid);
        setOrders(o);
        setLoading(false);
      };
      load();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8"><Skeleton className="h-8 w-48 mb-8" />{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl mb-4" />)}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild><Link href="/account"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Mis pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-20 w-20 mx-auto text-zinc-300 dark:text-zinc-600 mb-6" />
          <h2 className="text-xl font-semibold mb-2">No tienes pedidos</h2>
          <p className="text-zinc-500 mb-6">Realiza tu primera compra</p>
          <Button asChild><Link href="/products">Ver productos</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">#{order.id.slice(-8)}</p>
                      <Badge variant={statusColors[order.status] || 'secondary'}>
                        {order.status === 'pending' ? 'Pendiente' : order.status === 'confirmed' ? 'Confirmado' : order.status === 'processing' ? 'Procesando' : order.status === 'shipped' ? 'Enviado' : order.status === 'delivered' ? 'Entregado' : 'Cancelado'}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">{formatDate(order.createdAt)}</p>
                    <p className="text-sm text-zinc-500">{order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl font-bold text-blue-600">{formatPrice(order.total)}</p>
                    <p className="text-xs text-zinc-400">Pago con {order.paymentMethod === 'yape' ? 'Yape' : order.paymentMethod === 'credit_card' ? 'Tarjeta' : order.paymentMethod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
