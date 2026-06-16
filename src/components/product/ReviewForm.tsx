'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { reviewSchema, type ReviewInput } from '@/lib/validations';
import { createReview } from '@/lib/firebase/db';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { user, userData } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewInput) => {
    if (!user || rating === 0) return;
    setSubmitting(true);
    try {
      await createReview({
        productId,
        userId: user.uid,
        userName: userData?.name || user.email || 'Usuario',
        userPhoto: user.photoURL || '',
        rating,
        title: data.title,
        comment: data.comment,
      });
      toast.success('Reseña publicada con éxito');
      reset();
      setRating(0);
      onSuccess?.();
    } catch (error) {
      toast.error('Error al publicar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
        <p className="text-zinc-500">Inicia sesión para dejar una reseña</p>
        <Button asChild className="mt-3">
          <a href="/login">Iniciar sesión</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">Tu puntuación</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  'h-6 w-6 transition-colors',
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-zinc-300 dark:text-zinc-600'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <Input
        id="title"
        placeholder="Título de tu reseña"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="space-y-1">
        <textarea
          id="comment"
          placeholder="Cuenta tu experiencia con este producto..."
          className="flex min-h-[100px] w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          {...register('comment')}
        />
        {errors.comment && <p className="text-xs text-red-500">{errors.comment.message}</p>}
      </div>

      <Button type="submit" disabled={submitting || rating === 0}>
        {submitting ? 'Publicando...' : 'Publicar reseña'}
      </Button>
    </form>
  );
}
