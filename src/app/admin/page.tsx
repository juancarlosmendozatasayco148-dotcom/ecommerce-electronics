'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/utils';
import type { Product, Order } from '@/types';

export default function AdminDashboard() {
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
      setProducts(p);
      setOrders(o);
      setLoading(false);
    };
    load();
  }, [user, isAdmin, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  const stats = [
    { label: 'Productos', value: products.length, icon: ShoppingBag, color: 'bg-[#9fab26]', href: '/admin/products' },
    { label: 'Pedidos pendientes', value: pendingOrders, icon: Package, color: 'bg-orange-500', href: '/admin/orders' },
    { label: 'Stock bajo', value: lowStock, icon: TrendingUp, color: 'bg-red-500', href: '/admin/products' },
    { label: 'Ingresos totales', value: formatPrice(totalRevenue), icon: Users, color: 'bg-green-500', href: '/admin/orders' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl text-white" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>Panel de administración</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-lg hover:shadow-[#9fab26]/5 transition-all duration-300 cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Últimos pedidos</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">Ver todo <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                <div>
                  <p className="text-sm font-medium">#{order.id.slice(-8)}</p>
                  <p className="text-xs text-zinc-500">{order.shippingAddress.fullName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                  <p className="text-xs text-zinc-500 capitalize">{order.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-between h-12">
              <Link href="/admin/products">Gestionar productos <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between h-12">
              <Link href="/admin/orders">Gestionar pedidos <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="secondary" className="w-full justify-between h-12">
              <Link href="/">Ver tienda <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
