'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProductForm from '@/components/admin/ProductForm';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product } from '@/types';

export default function AdminProducts() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetch = async () => {
    const { getAllProducts } = await import('@/lib/firebase/db');
    const p = await getAllProducts();
    setProducts(p);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) { router.push('/'); return; }
    fetch();
  }, [user, isAdmin, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      const { deleteProduct } = await import('@/lib/firebase/db');
      await deleteProduct(id);
      toast.success('Producto eliminado');
      fetch();
    } catch { toast.error('Error al eliminar'); }
  };

  if (authLoading || loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8"><Skeleton className="h-8 w-64 mb-8" />{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg mb-3" />)}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><a href="/admin"><ArrowLeft className="h-5 w-5" /></a></Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Productos ({products.length})</h1>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(undefined)}><Plus className="h-4 w-4 mr-2" />Nuevo producto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</DialogTitle></DialogHeader>
            <ProductForm product={editingProduct} onSuccess={() => { setDialogOpen(false); fetch(); }} onCancel={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Producto</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Precio</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Categoría</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="py-3 px-4">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-zinc-500">{p.brand}</p>
                    </td>
                    <td className="py-3 px-4 font-medium">{formatPrice(p.price)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={p.stock === 0 ? 'destructive' : p.stock <= 5 ? 'warning' : 'success'}>
                        {p.stock === 0 ? 'Agotado' : p.stock}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">{p.categoryName || p.categoryId}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingProduct(p); setDialogOpen(true); }}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
