'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Eye, X } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { updateOrderStatus, updatePaymentStatus } from '@/lib/firebase/db';
import { toast } from 'sonner';
import type { Order } from '@/types';

interface OrderTableProps {
  orders: Order[];
  loading?: boolean;
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  pending: 'warning',
  confirmed: 'secondary',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
};

export default function OrderTable({ orders, loading }: OrderTableProps) {
  const [previewOrder, setPreviewOrder] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Estado actualizado');
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const handleVerifyYape = async (orderId: string) => {
    try {
      await updatePaymentStatus(orderId, 'paid');
      await updateOrderStatus(orderId, 'confirmed');
      toast.success('Pago Yape verificado y pedido confirmado');
    } catch {
      toast.error('Error al verificar el pago');
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const preview = orders.find((o) => o.id === previewOrder);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="text-left py-3 px-4 font-medium text-zinc-500">Orden</th>
              <th className="text-left py-3 px-4 font-medium text-zinc-500">Cliente</th>
              <th className="text-left py-3 px-4 font-medium text-zinc-500">Total</th>
              <th className="text-left py-3 px-4 font-medium text-zinc-500">Método</th>
              <th className="text-left py-3 px-4 font-medium text-zinc-500">Pago</th>
              <th className="text-left py-3 px-4 font-medium text-zinc-500">Estado</th>
              <th className="text-left py-3 px-4 font-medium text-zinc-500">Fecha</th>
              <th className="text-left py-3 px-4 font-medium text-zinc-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="py-3 px-4 font-medium">#{order.id.slice(-6)}</td>
                <td className="py-3 px-4 text-zinc-500">{order.shippingAddress.fullName}</td>
                <td className="py-3 px-4 font-medium">{formatPrice(order.total)}</td>
                <td className="py-3 px-4">
                  <Badge variant="secondary">{order.paymentMethod === 'yape' ? 'Yape' : order.paymentMethod === 'credit_card' ? 'Tarjeta' : order.paymentMethod === 'bank_transfer' ? 'Transferencia' : order.paymentMethod}</Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'destructive' : 'warning'}>
                    {order.paymentStatus === 'paid' ? 'Pagado' : order.paymentStatus === 'pending' ? 'Pendiente' : 'Fallido'}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={statusColors[order.status] || 'default'}>
                    {order.status === 'pending' ? 'Pendiente' : order.status === 'confirmed' ? 'Confirmado' : order.status === 'processing' ? 'Procesando' : order.status === 'shipped' ? 'Enviado' : order.status === 'delivered' ? 'Entregado' : 'Cancelado'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-zinc-500">{formatDate(order.createdAt)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {order.paymentMethod === 'yape' && order.paymentProof && order.paymentStatus === 'pending' && (
                      <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700" onClick={() => handleVerifyYape(order.id)}>
                        <CheckCircle2 className="h-3 w-3 mr-1" />Verificar Yape
                      </Button>
                    )}
                    {order.paymentMethod === 'yape' && order.paymentProof && (
                      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setPreviewOrder(order.id)}>
                        <Eye className="h-3 w-3 mr-1" />Ver comprobante
                      </Button>
                    )}
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="text-xs rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent px-2 py-1"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="processing">Procesando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setPreviewOrder(null)}>
          <Card className="max-w-lg mx-4 bg-[#171717] border-zinc-800" onClick={(e) => e.stopPropagation()}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-zinc-100">Comprobante Yape — #{preview.id.slice(-6)}</h3>
                <button onClick={() => setPreviewOrder(null)} className="text-zinc-500 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <img
                src={preview.paymentProof || ''}
                alt="Comprobante Yape"
                className="w-full rounded-lg"
              />
              <div className="flex gap-2 mt-4">
                {preview.paymentStatus === 'pending' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => { handleVerifyYape(preview.id); setPreviewOrder(null); }}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />Verificar pago
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setPreviewOrder(null)}>
                  Cerrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
