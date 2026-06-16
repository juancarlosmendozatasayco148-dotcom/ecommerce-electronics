import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { MercadoPagoConfig, Preference } = await import('mercadopago');
    const body = await request.json();
    const { items, payer, orderId, paymentMethod } = body;

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken || accessToken === 'test_your_access_token') {
      return NextResponse.json({
        initPoint: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/simulate?orderId=${orderId}`,
        preferenceId: 'sandbox-simulation',
      });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const preferenceBody: any = {
      items: items.map((item: any, index: number) => ({
        id: `item-${index}`,
        title: item.name,
        quantity: Number(item.quantity),
        unit_price: Number(item.price),
        currency_id: 'PEN',
      })),
      payer: {
        name: payer?.name || 'Comprador',
        email: payer?.email || 'comprador@email.com',
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/account/orders?success=true`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?failure=true`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?pending=true`,
      },
      auto_return: 'approved',
      external_reference: orderId,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhook/mercadopago`,
    };

    if (paymentMethod === 'yape') {
      preferenceBody.payment_methods = {
        excluded_payment_types: [],
        installments: 1,
      };
    }

    const result = await preference.create({ body: preferenceBody });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point || result.sandbox_init_point,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    console.error('MercadoPago error:', err.message || err);
    return NextResponse.json(
      { error: 'Error creating payment preference', details: err.message },
      { status: err.status || 500 }
    );
  }
}
