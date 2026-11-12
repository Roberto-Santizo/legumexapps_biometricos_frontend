import { discountAmountParts, formatDiscountAmount } from "@/features/employee-discounts/employee-discounts";

const sizes = {
  sm: { value: 'text-base', symbol: 'text-xs' },
  md: { value: 'text-2xl', symbol: 'text-sm' },
  lg: { value: 'text-5xl sm:text-6xl', symbol: 'text-xl sm:text-2xl' }
};

type Props = {
  amount: number;
  size?: keyof typeof sizes;
  className?: string;
}

// El monto es el dato principal que ve el empleado: signo de resta, símbolo pequeño y cifra destacada
export function DiscountAmount({ amount, size = 'sm', className = '' }: Props) {
  const { symbol, value } = discountAmountParts(amount);

  return (
    <span className={`inline-flex items-baseline gap-0.5 font-bold tabular-nums whitespace-nowrap text-rose-700 dark:text-rose-400 ${className}`}>
      <span className="sr-only">Descuento de {formatDiscountAmount(amount)}</span>
      <span aria-hidden className={`${sizes[size].symbol} font-semibold`}>−{symbol}</span>
      <span aria-hidden className={`${sizes[size].value} tracking-tight`}>{value}</span>
    </span>
  )
}
