import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

/** 1–5 yulduz; o'qish uchun aria-label (rang yagona belgi emas) */
const Stars = ({ value, className }: { value: number; className?: string }) => (
	<span className={cn('inline-flex items-center gap-0.5', className)} role='img' aria-label={`${value} / 5 yulduz`}>
		{[1, 2, 3, 4, 5].map(star => (
			<Star
				key={star}
				className={cn('size-3.5', star <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-muted-foreground/30')}
				strokeWidth={1.5}
			/>
		))}
	</span>
)

export default Stars
