'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, DollarSign, ShoppingBag, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/utils';
import type { Product, Order } from '@/types';

export default function AdminAnalytics() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) { router.push('/'); return; }
    const load = async () => {
      const { getAllProducts, getAllOrders } = await import('@/lib/firebase/db');
      const [p, o] = await Promise.all([getAllProducts(), getAllOrders()]);
      setProducts(p); setOrders(o); setLoading(false);
    };
    load();
  }, [user, isAdmin, authLoading, router]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><Skeleton className="h-8 w-48 mb-8" /><div className="grid grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div></div>;

  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild><a href="/admin"><ArrowLeft className="h-5 w-5" /></a></Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Analíticas</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center"><DollarSign className="h-6 w-6 text-white" /></div><div><p className="text-sm text-zinc-500">Ingresos totales</p><p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center"><ShoppingBag className="h-6 w-6 text-white" /></div><div><p className="text-sm text-zinc-500">Pedidos pagados</p><p className="text-2xl font-bold">{paidOrders.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center"><TrendingUp className="h-6 w-6 text-white" /></div><div><p className="text-sm text-zinc-500">Ticket promedio</p><p className="text-2xl font-bold">{formatPrice(avgOrderValue)}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center"><Package className="h-6 w-6 text-white" /></div><div><p className="text-sm text-zinc-500">Productos agotados</p><p className="text-2xl font-bold">{outOfStock}</p></div></div></CardContent></Card>
      </div>
    </div>
  );
}
