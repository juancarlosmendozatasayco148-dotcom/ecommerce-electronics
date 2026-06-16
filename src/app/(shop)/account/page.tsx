'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, ChevronRight, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate, getInitials, resizeImage } from '@/lib/utils';
import { toast } from 'sonner';
import type { Order } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, userData, loading, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [localPhotoURL, setLocalPhotoURL] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const photoURL = localPhotoURL || user?.photoURL || userData?.photoURL || '';

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (user) {
      const load = async () => {
        const { getUserOrders } = await import('@/lib/firebase/db');
        const o = await getUserOrders(user.uid);
        setOrders(o);
        setOrdersLoading(false);
      };
      load();
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    const { logout } = await import('@/lib/firebase/auth');
    await logout();
    toast.success('Sesión cerrada');
    router.push('/');
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar 2MB');
      return;
    }
    setPhotoUploading(true);
    try {
      const dataUrl = await resizeImage(file);
      const { updateProfilePhoto } = await import('@/lib/firebase/auth');
      await updateProfilePhoto(user.uid, dataUrl);
      setLocalPhotoURL(dataUrl);
      toast.success('Foto actualizada');
    } catch {
      toast.error('Error al subir la foto');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    try {
      const { removeProfilePhoto } = await import('@/lib/firebase/auth');
      await removeProfilePhoto(user.uid);
      setLocalPhotoURL('');
      toast.success('Foto eliminada');
    } catch {
      toast.error('Error al eliminar la foto');
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8"><Skeleton className="h-8 w-48 mb-8" /><Skeleton className="h-40 w-full rounded-xl" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Mi cuenta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="relative inline-block mb-3">
                  <Avatar className="w-20 h-20 mx-auto">
                    {photoURL ? <AvatarImage src={photoURL} /> : null}
                    <AvatarFallback className="text-xl">{getInitials(userData?.name || user?.email || 'U')}</AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={photoUploading}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#9fab26] text-black hover:bg-[#8c991f] transition-colors disabled:opacity-50"
                    title="Cambiar foto"
                  >
                    {photoUploading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
                <h2 className="font-semibold">{userData?.name || 'Usuario'}</h2>
                <p className="text-sm text-zinc-500">{user?.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {isAdmin && <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">Admin</span>}
                  {photoURL && (
                    <button onClick={handleRemovePhoto} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">
                      <X className="w-3 h-3 inline mr-0.5" />Eliminar foto
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <nav className="space-y-1">
            <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 font-medium">
              <User className="h-5 w-5" /> Perfil
            </Link>
            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors">
              <Package className="h-5 w-5" /> Mis pedidos
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 transition-colors">
              <LogOut className="h-5 w-5" /> Cerrar sesión
            </button>
          </nav>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Información personal</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-sm text-zinc-500">Nombre</label><p className="font-medium">{userData?.name || '-'}</p></div>
                <div><label className="text-sm text-zinc-500">Email</label><p className="font-medium truncate" title={user?.email || '-'}>{user?.email || '-'}</p></div>
                <div><label className="text-sm text-zinc-500">Teléfono</label><p className="font-medium">{userData?.phone || '-'}</p></div>
                <div><label className="text-sm text-zinc-500">Rol</label><p className="font-medium capitalize">{userData?.role || 'user'}</p></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pedidos recientes</CardTitle>
              <Button variant="ghost" size="sm" asChild><Link href="/account/orders">Ver todos <ChevronRight className="h-4 w-4 ml-1" /></Link></Button>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>
              ) : orders.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No tienes pedidos aún</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800">
                      <div><p className="text-sm font-medium">#{order.id.slice(-8)}</p><p className="text-xs text-zinc-500">{formatDate(order.createdAt)}</p></div>
                      <div className="text-right"><p className="text-sm font-medium">{formatPrice(order.total)}</p><p className="text-xs text-zinc-500 capitalize">{order.status}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
