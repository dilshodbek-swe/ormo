import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Atrofida olov gradienti aylanib turadigan ramka.
 * Ichidagi aylanuvchi konik gradient faqat 2px "tirqish"dan ko'rinadi.
 */
const BurningBorder = ({ children, className }: { children: ReactNode; className?: string }) => {
	return (
		<div className={cn('relative overflow-hidden rounded-2xl p-0.5', className)}>
			<span
				aria-hidden
				className='absolute top-1/2 left-1/2 aspect-square w-[150%] -translate-1/2 motion-safe:animate-[spin_5s_linear_infinite]'
				style={{
					background:
						'conic-gradient(from 0deg, var(--color-amber-300), var(--color-orange-500), var(--color-rose-500), transparent 55%, transparent 80%, var(--color-amber-300))',
				}}
			/>
			<div className='relative h-full rounded-[calc(var(--radius-2xl)-2px)] bg-foreground text-background'>
				{children}
			</div>
		</div>
	)
}

export default BurningBorder
