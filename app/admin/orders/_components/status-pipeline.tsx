import { type OrderStatus, STATUS_LABELS } from '@/lib/data/orders'
import { cn } from '@/lib/utils'
import { STATUS_COLORS, STATUS_ORDER, type StatusFilter } from '../_lib/order-utils'

interface StatusPipelineProps {
	counts: Record<OrderStatus, number>
	value: StatusFilter
	onChange: (value: StatusFilter) => void
}

/**
 * Buyurtmalar "quvuri": holatlar ulushi bitta chiziqda. Har bir bo'lak — filtr tugmasi,
 * tanlanmaganlari xiralashadi. Vercel'ning build-vaqt chizig'idan ilhomlangan.
 */
const StatusPipeline = ({ counts, value, onChange }: StatusPipelineProps) => {
	const total = STATUS_ORDER.reduce((sum, status) => sum + counts[status], 0) || 1

	return (
		<div className='space-y-3'>
			<div className='flex h-2.5 gap-0.5 overflow-hidden rounded-full'>
				{STATUS_ORDER.map(status =>
					counts[status] ? (
						<button
							key={status}
							type='button'
							aria-label={`${STATUS_LABELS[status]}: ${counts[status]}`}
							onClick={() => onChange(value === status ? 'all' : status)}
							className={cn(
								'h-full transition-[opacity,flex-grow] duration-500 first:rounded-l-full last:rounded-r-full hover:opacity-100',
								STATUS_COLORS[status],
								value !== 'all' && value !== status && 'opacity-25'
							)}
							style={{ flexGrow: counts[status] / total }}
						/>
					) : null
				)}
			</div>
			<div className='flex flex-wrap gap-x-5 gap-y-1.5'>
				{STATUS_ORDER.map(status => (
					<button
						key={status}
						type='button'
						onClick={() => onChange(value === status ? 'all' : status)}
						className={cn(
							'flex items-center gap-2 text-xs transition-colors',
							value === status ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
						)}
					>
						<span className={cn('size-2 rounded-[2px]', STATUS_COLORS[status])} />
						{STATUS_LABELS[status]}
						<span className='font-mono tabular-nums'>{Math.round((counts[status] / total) * 100)}%</span>
					</button>
				))}
			</div>
		</div>
	)
}

export default StatusPipeline
