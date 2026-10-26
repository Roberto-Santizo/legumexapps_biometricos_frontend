type Props = {
  resign: boolean;
}

export function ResignBadge({ resign }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${resign ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${resign ? 'bg-red-500' : 'bg-emerald-500'}`} aria-hidden="true" />
      {resign ? 'De baja' : 'Activo'}
    </span>
  )
}
