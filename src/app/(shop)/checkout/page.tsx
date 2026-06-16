'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Loader2, ExternalLink, Camera, CheckCircle2, Smartphone, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentMethods from '@/components/checkout/PaymentMethods';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { addressSchema } from '@/lib/validations';
import type { AddressInput } from '@/lib/validations';
import { toast } from 'sonner';
import { formatPrice, resizeImage } from '@/lib/utils';

type CheckoutStep = 'form' | 'processing' | 'yape' | 'redirect' | 'complete';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('yape');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('form');
  const [initPoint, setInitPoint] = useState('');
  const [orderId, setOrderId] = useState('');
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofUploading, setProofUploading] = useState(false);
  const proofRef = useRef<HTMLInputElement>(null);
  const prevStep = useRef(step);

  const { register, handleSubmit, formState: { errors } } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'Perú' },
  });

  useEffect(() => {
    if (step === 'redirect' && prevStep.current === 'processing') {
      const timer = setTimeout(() => {
        if (initPoint) {
          window.location.href = initPoint;
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
    prevStep.current = step;
  }, [step, initPoint]);

  if (items.length === 0 && !submitting) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
          </div>
          <p className="text-lg text-zinc-500">Tu carrito está vacío</p>
          <Button asChild className="mt-4"><Link href="/products">Ir a comprar</Link></Button>
        </div>
      </div>
    );
  }

  const handleProofSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar 2MB');
      return;
    }
    const dataUrl = await resizeImage(file);
    setProofPreview(dataUrl);
  };

  const submitProof = async () => {
    if (!proofPreview || !orderId) return;
    setProofUploading(true);
    try {
      const { updatePaymentProof } = await import('@/lib/firebase/db');
      await updatePaymentProof(orderId, proofPreview);
      toast.success('Comprobante enviado. Tu pedido está en revisión.');
      clearCart();
      setStep('complete');
    } catch {
      toast.error('Error al subir el comprobante');
    } finally {
      setProofUploading(false);
    }
  };

  const onSubmit = async (data: AddressInput) => {
    if (!user) { toast.error('Debes iniciar sesión'); router.push('/login'); return; }
    setSubmitting(true);
    setStep('processing');

    try {
      const { createOrder } = await import('@/lib/firebase/db');
      const subtotal = getSubtotal();
      const shipping = subtotal >= 200 ? 0 : 15;
      const tax = subtotal * 0.18;
      const total = subtotal + shipping + tax;

      const newOrderId = await createOrder({
        userId: user.uid,
        items: items.map(i => ({ ...i, image: i.image || '' })),
        subtotal,
        shipping,
        tax,
        total,
        status: 'pending',
        paymentMethod,
        paymentStatus: 'pending',
        shippingAddress: data,
      });
      setOrderId(newOrderId);

      if (paymentMethod === 'yape') {
        setStep('yape');
        setSubmitting(false);
        return;
      }

      const { updatePaymentStatus } = await import('@/lib/firebase/db');
      const mpResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
          payer: { name: data.fullName, email: user.email },
          orderId: newOrderId,
          paymentMethod,
        }),
      });

      if (!mpResponse.ok) {
        await updatePaymentStatus(newOrderId, 'failed');
        toast.error('Error al procesar el pago. Tu pedido está pendiente.');
        setStep('form');
        setSubmitting(false);
        return;
      }

      const result = await mpResponse.json();

      if (result.initPoint) {
        setInitPoint(result.initPoint);
        setStep('redirect');
      }
    } catch {
      toast.error('Error al procesar el pedido');
      setStep('form');
      setSubmitting(false);
    }
  };

  const total = (() => { const s = getSubtotal(); const ship = s >= 200 ? 0 : 15; return s + ship + s * 0.18; })();

  if (step === 'processing') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center animate-pulse">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Procesando tu pedido</h2>
          <p className="text-zinc-500">Estamos preparando todo para tu pago...</p>
        </div>
      </div>
    );
  }

  if (step === 'yape') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#9fab26]/10 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-[#9fab26]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Paga con Yape</h2>
            <p className="text-zinc-500">Escanea el código QR desde tu app Yape</p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6 text-center">
              <div className="w-64 h-64 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center p-4">
                <img
                  src="/yape-qr.jpeg"
                  alt="Código QR Yape"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm text-zinc-400 mb-1">Número Yape</p>
              <p className="text-xl font-bold text-[#9fab26]">937 480 630</p>
              <p className="text-xs text-zinc-500 mt-1">TechStore EIRL</p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader><CardTitle className="text-base">Sube tu comprobante</CardTitle></CardHeader>
            <CardContent>
              <input ref={proofRef} type="file" accept="image/*" className="hidden" onChange={handleProofSelect} />
              {proofPreview ? (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden border border-zinc-700">
                    <img src={proofPreview} alt="Comprobante" className="w-full h-64 object-contain bg-zinc-900" />
                    <button
                      type="button"
                      onClick={() => { setProofPreview(null); if (proofRef.current) proofRef.current.value = ''; }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => proofRef.current?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" /> Cambiar imagen
                  </Button>
                  <Button
                    type="button"
                    className="w-full bg-[#9fab26] hover:bg-[#8c991f] text-black"
                    onClick={submitProof}
                    disabled={proofUploading}
                  >
                    {proofUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <><CheckCircle2 className="h-5 w-5 mr-2" /> Enviar comprobante</>
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-20 border-dashed border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-500"
                    onClick={() => proofRef.current?.click()}
                  >
                    <Camera className="h-5 w-5 mr-2" /> Subir captura de Yape
                  </Button>
                  <p className="text-xs text-zinc-500 text-center mt-2">Máximo 2MB · Formato imagen</p>
                </>
              )}
            </CardContent>
          </Card>

          {!proofPreview && (
            <Link href="/account/orders" className="block text-center text-sm text-zinc-500 hover:text-zinc-300">
              Ver mis pedidos
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Comprobante enviado!</h2>
          <p className="text-zinc-500 mb-2">Tu pedido está en revisión</p>
          <p className="text-sm text-zinc-400 mb-8">Te notificaremos cuando se confirme el pago</p>
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/account/orders">Ver mis pedidos</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/products">Seguir comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'redirect') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Pedido creado</h2>
          <p className="text-zinc-500 mb-8">Serás redirigido a MercadoPago para completar el pago</p>
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <a href={initPoint} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-5 w-5 mr-2" />
                Ir a MercadoPago
              </a>
            </Button>
            <p className="text-sm text-zinc-400">
              ¿No funcionó?{' '}
              <Link href={`/account/orders`} className="text-blue-600 hover:underline">
                Ver mis pedidos
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild><Link href="/cart"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Dirección de envío</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="fullName" label="Nombre completo" error={errors.fullName?.message} {...register('fullName')} />
                  <Input id="phone" label="Teléfono" error={errors.phone?.message} {...register('phone')} />
                </div>
                <Input id="street" label="Dirección" error={errors.street?.message} {...register('street')} />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Input id="city" label="Ciudad" error={errors.city?.message} {...register('city')} />
                  <Input id="state" label="Departamento" error={errors.state?.message} {...register('state')} />
                  <Input id="zipCode" label="Código postal" error={errors.zipCode?.message} {...register('zipCode')} />
                </div>
                <Input id="reference" label="Referencia (opcional)" {...register('reference')} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Método de pago</CardTitle></CardHeader>
              <CardContent><PaymentMethods selected={paymentMethod} onSelect={setPaymentMethod} /></CardContent>
            </Card>
          </div>

          <div>
            <OrderSummary />
            <Button type="submit" size="lg" className="w-full mt-4 h-14 text-base" disabled={submitting || !user || items.length === 0}>
              {submitting ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Procesando...</>
              ) : (
                <><Lock className="h-5 w-5 mr-2" /> Pagar {formatPrice(total)}</>
              )}
            </Button>
            <p className="text-xs text-zinc-400 text-center mt-3">
              {paymentMethod === 'yape' ? 'Paga con Yape desde tu celular' : 'Pagos procesados por MercadoPago'}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
