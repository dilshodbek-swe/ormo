import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface ProductGridProps {
	children: ReactNode
	/** Tashqi ramka uchun (masalan, animatsiya) */
	className?: string
	/** Ustunlar soni: `md:grid-cols-3 lg:grid-cols-4` kabi */
	gridClassName?: string
}

/**
 * Kartalar orasida 1px chiziqli grid.
 * Chiziqlar har bir katakning o'ng/pastki chegarasidan chiziladi,
 * chetdagilari -mr-px/-mb-px bilan yashiriladi — oxirgi qatordagi bo'sh joy oq qoladi.
 */
const ProductGrid = ({ children, className, gridClassName }: ProductGridProps) => {
	return (
		<div className={cn('overflow-hidden rounded-xl border bg-background', className)}>
			<div
				className={cn(
					'-mr-px -mb-px grid grid-cols-2 *:border-r *:border-b',
					gridClassName
				)}
			>
				{children}
			</div>
		</div>
	)
}

export default ProductGrid
