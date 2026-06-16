'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getProductImages } from '@/lib/product-images';

interface ProductGalleryProps {
  images: string[];
  name: string;
  slug?: string;
}

export default function ProductGallery({ images, name, slug }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [thumbErrors, setThumbErrors] = useState<Record<number, boolean>>({});

  const fallbackImages = slug ? getProductImages(slug) : [];
  const displayImages = images.length > 0 ? images : fallbackImages;
  const currentImage = displayImages[selectedIndex] || '';
  const hasImage = currentImage && !imgError;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-800">
        {hasImage ? (
          <Image
            src={currentImage}
            alt={`${name} - ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={() => setImgError(true)}
          />
        ) : (
                <div className="flex items-center justify-center h-full bg-zinc-800">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-zinc-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => { setSelectedIndex(i); setImgError(false); }}
              className={cn(
                'relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all',
                i === selectedIndex
                  ? 'border-[#9fab26] ring-2 ring-[#9fab26]/30'
                  : 'border-transparent hover:border-zinc-600'
              )}
            >
              {img && !thumbErrors[i] ? (
                <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" onError={() => setThumbErrors(prev => ({ ...prev, [i]: true }))} />
              ) : (
          <div className="flex items-center justify-center h-full bg-zinc-800">
                  <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
