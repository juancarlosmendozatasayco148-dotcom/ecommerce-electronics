'use client';

import { CreditCard, Smartphone, Building2, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'yape',
    name: 'Yape',
    description: 'Paga desde tu app Yape',
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    id: 'credit_card',
    name: 'Tarjeta de crédito',
    description: 'Visa, Mastercard, American Express',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'debit_card',
    name: 'Tarjeta de débito',
    description: 'Visa débito, Mastercard débito',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'bank_transfer',
    name: 'Transferencia bancaria',
    description: 'BCP, Interbank, BBVA, Scotiabank',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: 'cash',
    name: 'Pago en efectivo',
    description: 'Paga en agentes autorizados',
    icon: <Banknote className="h-5 w-5" />,
  },
];

interface PaymentMethodsProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function PaymentMethods({ selected, onSelect }: PaymentMethodsProps) {
  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <button
          key={method.id}
          type="button"
          onClick={() => onSelect(method.id)}
          className={cn(
            'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
            selected === method.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
          )}
        >
          <div className={cn(
            'p-2 rounded-lg',
            selected === method.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
          )}>
            {method.icon}
          </div>
          <div>
            <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{method.name}</p>
            <p className="text-xs text-zinc-500">{method.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
