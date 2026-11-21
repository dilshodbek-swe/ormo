import { Check } from 'lucide-react'

import { type Order, ORDER_STEPS, STEP_LABELS } from '@/lib/data/orders'
import { cn, formatDate } from '@/lib/utils'

/** Yetkazib berish bosqichlari: bajarilganlari to'ldirilgan, joriysi pulslanadi */
const OrderTracker = ({ order }: { order: Order }) => {
	const doneCount = ORDER_STEPS.filter(step => order.events[step]).length
	const progress = ((doneCount - 1) / (ORDER_STEPS.length - 1)) * 100

	return (
		<ol className='relative grid grid-cols-4'>
			{/* Fon chizig'i va to'lgan qismi */}
			<span aria-hidden className='absolute top-3 right-[12.5%] left-[12.5%] h-px bg-border' />
			<span
				aria-hidden
				className='absolute top-3 left-[12.5%] h-px bg-foreground transition-all duration-700'
				style={{ width: `${(progress * 75) / 100}%` }}
			/>

			{ORDER_STEPS.map((step, index) => {
				const at = order.events[step]
				const current = index === doneCount - 1 && order.status !== 'delivered'

				return (
					<li key={step} className='relative flex flex-col items-center gap-2 text-center'>
						<span
							className={cn(
								'relative z-10 flex size-6 items-center justify-center rounded-full border bg-background text-[10px] font-mono',
								at && 'border-foreground bg-foreground text-background'
							)}
						>
							{current && (
								<span className='absolute inset-0 animate-ping rounded-full bg-foreground/30' />
							)}
							{at ? <Check className='size-3' /> : index + 1}
						</span>
						<div className='space-y-0.5'>
							<p className={cn('text-xs font-medium', !at && 'text-muted-foreground')}>
								{STEP_LABELS[step]}
							</p>
							<p className='font-mono text-[10px] text-muted-foreground'>
								{at ? formatDate(at, { time: true, year: false }) : '—'}
							</p>
						</div>
					</li>
				)
			})}
		</ol>
	)
}

export default OrderTracker
