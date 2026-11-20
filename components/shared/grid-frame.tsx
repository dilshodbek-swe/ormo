import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

const Crosshair = ({ className }: { className: string }) => (
	<svg
		aria-hidden
		viewBox='0 0 16 16'
		className={cn('pointer-events-none absolute z-10 size-4 text-muted-foreground/60', className)}
	>
		<path d='M8 0v16M0 8h16' stroke='currentColor' strokeWidth='1' />
	</svg>
)

interface GridFrameProps {
	children: ReactNode
	className?: string
	as?: 'div' | 'section'
}

/**
 * Vercel uslubidagi ramka: ingichka chegara va burchaklarda "+" belgilari.
 * Ichki bo'linishlar uchun `divide-x` / `divide-y` dan foydalaning.
 */
const GridFrame = ({ children, className, as: Tag = 'div' }: GridFrameProps) => {
	return (
		<Tag className={cn('relative border', className)}>
			<Crosshair className='-top-2 -left-2' />
			<Crosshair className='-top-2 -right-2' />
			<Crosshair className='-bottom-2 -left-2' />
			<Crosshair className='-right-2 -bottom-2' />
			{children}
		</Tag>
	)
}

export default GridFrame
