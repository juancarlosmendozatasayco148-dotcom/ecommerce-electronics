import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, action, data } = body;

    if (type === 'payment' && action === 'payment.created' && data?.id) {
      const { MercadoPagoConfig, Payment } = await import('mercadopago');
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

      if (accessToken && accessToken !== 'test_your_access_token') {
        const client = new MercadoPagoConfig({ accessToken });
        const paymentAPI = new Payment(client);
        const payment = await paymentAPI.get({ id: data.id });

        const orderId = payment.external_reference;
        const status = payment.status;

        if (orderId) {
          const { updatePaymentStatus, updateOrderStatus } = await import('@/lib/firebase/db');
          const paymentStatus = status === 'approved' ? 'paid' : status === 'rejected' ? 'failed' : 'pending';
          const orderStatus = status === 'approved' ? 'confirmed' : 'pending';

          await updatePaymentStatus(orderId, paymentStatus, data.id);
          if (status === 'approved') {
            await updateOrderStatus(orderId, orderStatus);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: true });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint active' });
}
