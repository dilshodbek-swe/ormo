import { useId } from 'react'

import { cn } from '@/lib/utils'

interface DiscountBadgeProps {
	discount: number
	/** Aylana bo'ylab takrorlanadigan yozuv */
	label?: string
	className?: string
}

/**
 * Aylanib turuvchi muhr ko'rinishidagi chegirma belgisi:
 * markazda foiz, atrofida aylanma yozuv.
 */
const DiscountBadge = ({ discount, label = 'Kun taklifi', className }: DiscountBadgeProps) => {
	// Har nusxa o'z yo'liga ega bo'lishi kerak — bir sahifada bir nechta muhr bo'lishi mumkin
	const pathId = useId()

	return (
		<div
			className={cn(
				'relative flex size-28 items-center justify-center rounded-full bg-foreground text-background shadow-lg sm:size-32',
				className
			)}
		>
			<svg
				viewBox='0 0 100 100'
				aria-hidden
				className='absolute inset-0 size-full motion-safe:animate-[spin_14s_linear_infinite]'
			>
				<defs>
					<path
						id={pathId}
						d='M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0'
					/>
				</defs>
				<text
					className='fill-current font-mono text-[8.5px] font-medium tracking-[0.2em] uppercase'
					opacity={0.7}
				>
					<textPath href={`#${pathId}`} textLength='248'>
						{`${label} • Chegirma • ${label} • Chegirma •`}
					</textPath>
				</text>
			</svg>

			<div className='relative text-center leading-none'>
				<p className='font-space-grotesk text-3xl font-bold tracking-tighter sm:text-4xl'>
					-{discount}%
				</p>
			</div>
		</div>
	)
}

export default DiscountBadge
