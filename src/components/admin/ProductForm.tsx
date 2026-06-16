'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productSchema, type ProductInput } from '@/lib/validations';
import { createProduct, updateProduct } from '@/lib/firebase/db';
import { generateSlug } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      categoryId: product.categoryId,
      brand: product.brand,
      stock: product.stock,
      specs: product.specs,
      featured: product.featured,
    } : undefined,
  });

  const onSubmit = async (data: ProductInput) => {
    setSubmitting(true);
    try {
      const slug = generateSlug(data.name);
      if (product) {
        await updateProduct(product.id, { ...data, slug });
        toast.success('Producto actualizado');
      } else {
        await createProduct({ ...data, slug });
        toast.success('Producto creado');
      }
      onSuccess?.();
    } catch (error) {
      toast.error('Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Input id="name" label="Nombre del producto" error={errors.name?.message} {...register('name')} />
        </div>
        <div className="space-y-1">
          <Input id="brand" label="Marca" error={errors.brand?.message} {...register('brand')} />
        </div>
        <div className="space-y-1">
          <Input id="price" type="number" step="0.01" label="Precio (S/)" error={errors.price?.message} {...register('price', { valueAsNumber: true })} />
        </div>
        <div className="space-y-1">
          <Input id="comparePrice" type="number" step="0.01" label="Precio comparativo (S/)" {...register('comparePrice', { valueAsNumber: true })} />
        </div>
        <div className="space-y-1">
          <Input id="categoryId" label="ID de categoría" error={errors.categoryId?.message} {...register('categoryId')} />
        </div>
        <div className="space-y-1">
          <Input id="stock" type="number" label="Stock" error={errors.stock?.message} {...register('stock', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Descripción</label>
        <textarea
          id="description"
          rows={4}
          className="flex w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('featured')} className="rounded border-zinc-300" />
          Producto destacado
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : product ? 'Actualizar producto' : 'Crear producto'}
        </Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
      </div>
    </form>
  );
}
