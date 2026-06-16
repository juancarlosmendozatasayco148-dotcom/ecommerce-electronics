import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

function serializeProduct(p: any) {
  return {
    ...p,
    createdAt: p.createdAt?.toDate?.()?.toISOString() || p.createdAt,
    updatedAt: p.updatedAt?.toDate?.()?.toISOString() || p.updatedAt,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { getProduct } = await import('@/lib/firebase/db');
  const product = await getProduct(id);
  if (!product) notFound();
  return <ProductDetailClient product={serializeProduct(product)} />;
}
