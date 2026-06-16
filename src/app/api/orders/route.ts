import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { getAllOrders } = await import('@/lib/firebase/db');
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { createOrder } = await import('@/lib/firebase/db');
    const body = await request.json();
    const orderId = await createOrder(body);
    return NextResponse.json({ id: orderId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
