import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }
    const { getReviews } = await import('@/lib/firebase/db');
    const reviews = await getReviews(productId);
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: 'Error fetching reviews' }, { status: 500 });
  }
}
