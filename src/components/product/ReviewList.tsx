'use client';

import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials, formatDate, cn } from '@/lib/utils';
import { getReviews } from '@/lib/firebase/db';
import type { Review } from '@/types';

interface ReviewListProps {
  productId: string;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews(productId).then((r) => {
      setReviews(r);
      setLoading(false);
    });
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse flex gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-32" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-24" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-400">
        <p>Aún no hay reseñas. ¡Sé el primero en opinar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
          <Avatar>
            <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{review.userName}</span>
              <span className="text-xs text-zinc-400">{formatDate(review.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3 w-3',
                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300 dark:text-zinc-600'
                  )}
                />
              ))}
            </div>
            <p className="font-medium text-sm mt-2 text-zinc-900 dark:text-zinc-100">{review.title}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
