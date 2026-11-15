import { cn } from '@/lib/utils'

/**
 * Aylanib turuvchi muhr ko'rinishidagi chegirma belgisi:
 * markazda foiz, atrofida aylanma yozuv.
 */
const DiscountBadge = ({
	discount,
	className,
}: {
	discount: number
	className?: string
}) => {
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
						id='discount-ring'
						d='M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0'
					/>
				</defs>
				<text
					className='fill-current font-mono text-[8.5px] font-medium tracking-[0.2em] uppercase'
					opacity={0.7}
				>
					<textPath href='#discount-ring' textLength='248'>
						Kun taklifi • Chegirma • Kun taklifi • Chegirma •
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
