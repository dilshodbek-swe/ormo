import Image from 'next/image'

import DiscountBadge from '@/components/shared/discount-badge'
import type { Deal } from '@/lib/data/deals'
import { cn } from '@/lib/utils'

/** Karusel slaydi: orqada ulkan konturli foiz, oldinda mahsulot va aylanuvchi muhr */
type Props = {
	deal: Deal
	isActive: boolean
	className?: string
}

const DealStage = ({ deal, isActive, className }: Props) => {
	return (
		<div
			aria-hidden={!isActive}
			className={cn(
				'relative flex aspect-square items-center justify-center sm:aspect-5/4',
				!isActive && 'pointer-events-none',
				className
			)}
		>
			{/* Orqa fondagi ulkan foiz — faqat kontur */}
			<span
				aria-hidden
				className={cn(
					'pointer-events-none absolute inset-0 flex items-center justify-center font-space-grotesk text-[9rem] leading-none font-bold tracking-tighter text-transparent transition-all duration-700 select-none [-webkit-text-stroke:1.5px_var(--background)] sm:text-[13rem] lg:text-[15rem]',
					isActive ? 'scale-100 opacity-25' : 'scale-90 opacity-0'
				)}
			>
				-{deal.discount}%
			</span>

			{/* Mahsulot plitasi */}
			<div
				className={cn(
					'relative flex aspect-square h-[78%] items-center justify-center rounded-full bg-white p-[12%] shadow-2xl shadow-black/40 transition-all duration-700',
					isActive ? 'scale-100 rotate-0' : 'scale-75 -rotate-12 opacity-0'
				)}
			>
				<Image
					src={deal.image}
					alt={`${deal.brand} ${deal.name}`}
					width={1200}
					height={1200}
					sizes='(min-width: 1024px) 35vw, 70vw'
					loading='eager'
					className='h-full w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain motion-safe:animate-float'
				/>
			</div>

			<DiscountBadge
				discount={deal.discount}
				label='Chegirma'
				className={cn(
					'absolute top-[6%] right-[4%] bg-rose-500 text-white transition-all delay-200 duration-500 sm:right-[10%]',
					isActive ? 'scale-100 rotate-12' : 'scale-0 rotate-90'
				)}
			/>
		</div>
	)
}

export default DealStage
