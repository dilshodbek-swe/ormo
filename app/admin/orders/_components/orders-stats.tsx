import type { ReactNode } from 'react'

import { formatPrice } from '@/lib/utils'
import type { getOrdersSummary } from '../_lib/order-utils'

type Summary = ReturnType<typeof getOrdersSummary>

const compact = (value: number) =>
	value >= 1_000_000_000
		? `${(value / 1_000_000_000).toFixed(1)} mlrd`
		: value >= 1_000_000
			? `${(value / 1_000_000).toFixed(1)} mln`
			: formatPrice(value)

/** Vercel "Usage" uslubidagi KPI qatori: kataklar orasida 1px chiziq, birinchisida 14 kunlik grafik */
const OrdersStats = ({ summary }: { summary: Summary }) => {
	const max = Math.max(...summary.days.map(day => day.value), 1)

	return (
		<div className='grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4'>
			<Stat label='Daromad' value={`${compact(summary.revenue)} so'm`} hint='bekor qilinganlarsiz' className='sm:col-span-2 lg:col-span-1'>
				<div className='mt-4 flex h-10 items-end gap-0.75' aria-label="So'nggi 14 kun daromadi">
					{summary.days.map((day, index) => (
						<span
							key={day.key}
							title={`${day.key}: ${formatPrice(day.value)}`}
							className={`flex-1 origin-bottom animate-in rounded-[2px] fade-in slide-in-from-bottom-1 fill-mode-backwards ${
								day.value ? (index === summary.days.length - 1 ? 'bg-foreground' : 'bg-foreground/25 hover:bg-foreground/60') : 'bg-border'
							}`}
							style={{ height: `${Math.max((day.value / max) * 100, 6)}%`, animationDelay: `${index * 30}ms` }}
						/>
					))}
				</div>
			</Stat>
			<Stat label='Buyurtmalar' value={summary.count} hint={`${summary.units} dona mahsulot`} />
			<Stat label="O'rtacha chek" value={`${compact(summary.average)} so'm`} hint='bitta buyurtmaga' />
			<Stat
				label="Jo'natishni kutmoqda"
				value={
					<span className='flex items-center gap-2.5'>
						{summary.waiting}
						{summary.waiting > 0 && (
							<span className='relative flex size-2'>
								<span className='absolute inset-0 animate-ping rounded-full bg-amber-500 opacity-70' />
								<span className='relative size-2 rounded-full bg-amber-500' />
							</span>
						)}
					</span>
				}
				hint={`${summary.cancelled} ta bekor qilingan`}
			/>
		</div>
	)
}

const Stat = ({
	label,
	value,
	hint,
	children,
	className = '',
}: {
	label: string
	value: ReactNode
	hint: string
	children?: ReactNode
	className?: string
}) => (
	<div className={`flex flex-col bg-background p-5 ${className}`}>
		<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{label}</p>
		<p className='mt-2 font-space-grotesk text-3xl font-bold tracking-tight tabular-nums'>{value}</p>
		<p className='mt-1 text-xs text-muted-foreground'>{hint}</p>
		{children}
	</div>
)

export default OrdersStats
