import { type OrderStatus, STATUS_LABELS } from '@/lib/data/orders'
import { cn } from '@/lib/utils'

const tones: Record<OrderStatus, { dot: string; badge: string }> = {
	processing: {
		dot: 'bg-amber-500',
		badge: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
	},
	shipped: {
		dot: 'bg-sky-500',
		badge: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400',
	},
	delivered: {
		dot: 'bg-emerald-500',
		badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
	},
	cancelled: {
		dot: 'bg-muted-foreground',
		badge: 'text-muted-foreground',
	},
}

/** Holat belgisi; faol buyurtmalarda nuqta "pulslanadi" */
const StatusBadge = ({ status }: { status: OrderStatus }) => {
	const active = status === 'processing' || status === 'shipped'

	return (
		<span
			className={cn(
				'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
				tones[status].badge
			)}
		>
			<span className='relative flex size-1.5'>
				{active && (
					<span className={cn('absolute inset-0 animate-ping rounded-full opacity-75', tones[status].dot)} />
				)}
				<span className={cn('relative size-1.5 rounded-full', tones[status].dot)} />
			</span>
			{STATUS_LABELS[status]}
		</span>
	)
}

export default StatusBadge
