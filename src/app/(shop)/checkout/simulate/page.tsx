'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

function SimulatePaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setProcessing(false);
      return;
    }

    const simulatePayment = async () => {
      try {
        const { updatePaymentStatus, updateOrderStatus } = await import('@/lib/firebase/db');
        await updatePaymentStatus(orderId, 'paid', 'simulated-payment');
        await updateOrderStatus(orderId, 'confirmed');
        toast.success('¡Pago simulado exitosamente!');
      } catch {
        toast.error('Error al simular el pago');
      } finally {
        setProcessing(false);
      }
    };

    const timer = setTimeout(simulatePayment, 2000);
    return () => clearTimeout(timer);
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-20">
          <p className="text-zinc-500">No se encontró la orden</p>
          <Button asChild className="mt-4"><Link href="/checkout">Volver</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-md mx-auto text-center py-20">
        {processing ? (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center animate-pulse">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Simulando pago...</h2>
            <p className="text-zinc-500">Modo demostración - el pago se procesará automáticamente</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Pago exitoso!</h2>
            <p className="text-zinc-500 mb-2">Tu pedido ha sido confirmado</p>
            <p className="text-sm text-zinc-400 mb-8">Orden: {orderId.slice(0, 8)}...</p>
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/account/orders">Ver mis pedidos</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/products">Seguir comprando</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SimulatePaymentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-20">
          <Loader2 className="w-10 h-10 mx-auto animate-spin text-blue-600" />
        </div>
      </div>
    }>
      <SimulatePaymentContent />
    </Suspense>
  );
}
