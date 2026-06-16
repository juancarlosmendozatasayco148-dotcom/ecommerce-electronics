import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#9fab26]/15 text-[#9fab26]',
        secondary: 'bg-zinc-800 text-zinc-300',
        destructive: 'bg-red-900/50 text-red-300',
        success: 'bg-green-900/50 text-green-300',
        warning: 'bg-yellow-900/50 text-yellow-300',
        outline: 'border border-zinc-700 text-zinc-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
