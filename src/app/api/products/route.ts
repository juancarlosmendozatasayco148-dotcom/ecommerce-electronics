import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { getProducts } = await import('@/lib/firebase/db');
    const { searchParams } = new URL(request.url);
    const filters = {
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sortBy: searchParams.get('sortBy') as any || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };
    const result = await getProducts(filters);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { createProduct } = await import('@/lib/firebase/db');
    const body = await request.json();
    const id = await createProduct(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}
