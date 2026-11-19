import { Lock } from 'lucide-react'
import Image from 'next/image'

import { cn, formatPrice } from '@/lib/utils'
import type { WeekDay } from './week-days'

/** O'tgan kun — "Tugadi" muhri; kelayotgan kun — sir: xira rasm, faqat foiz ko'rinadi */
const DayTile = ({ day }: { day: WeekDay }) => {
	const { deal, status } = day
	const isPast = status === 'past'
	const isUpcoming = status === 'upcoming'

	return (
		<article
			className={cn(
				'group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-background p-4 transition-colors',
				isUpcoming && 'border-dashed hover:border-orange-500/50'
			)}
		>
			{/* Kun va sana */}
			<div className='flex items-start justify-between gap-2'>
				<p className='font-mono text-[11px] tracking-widest text-muted-foreground uppercase'>
					{day.name}
				</p>
				<p
					className={cn(
						'font-space-grotesk text-2xl leading-none font-bold tabular-nums',
						isPast && 'text-muted-foreground/50'
					)}
				>
					{day.date.getDate()}
				</p>
			</div>

			<div className='relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl bg-white'>
				{/* absolute — tik rasmlar ham katakchani cho'zmasdan sig'adi */}
				<div className='absolute inset-0 flex items-center justify-center p-4'>
					<Image
						src={deal.image}
						alt={isUpcoming ? '' : `${deal.brand} ${deal.name}`}
						width={600}
						height={600}
						sizes='(min-width: 1024px) 20vw, 45vw'
						className={cn(
							'h-full w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain transition-all duration-500',
							isPast && 'opacity-50 grayscale',
							isUpcoming && 'scale-90 blur-md group-hover:blur-sm'
						)}
					/>
				</div>

				{isPast && (
					<span className='absolute rotate-[-14deg] rounded-md border-2 border-rose-500 px-2.5 py-0.5 font-mono text-sm font-bold tracking-[0.25em] text-rose-500 uppercase'>
						Tugadi
					</span>
				)}

				{isUpcoming && (
					<span className='absolute flex size-10 items-center justify-center rounded-full bg-foreground text-background shadow-lg'>
						<Lock className='size-4' />
					</span>
				)}
			</div>

			{/* Ma'lumot: kelayotgan kunda faqat chegirma foizi oshkor */}
			{isUpcoming ? (
				<div className='space-y-1'>
					<p className='text-sm text-muted-foreground'>{day.name} ochiladi</p>
					<p className='bg-linear-to-r from-orange-500 to-rose-500 bg-clip-text font-mono text-lg font-bold text-transparent'>
						-{deal.discount}% gacha
					</p>
				</div>
			) : (
				<div className={cn('space-y-1', isPast && 'opacity-60')}>
					<p className='truncate text-sm font-medium'>{deal.name}</p>
					<p className='font-mono text-sm'>
						<span className={cn(isPast && 'line-through')}>{formatPrice(deal.price)}</span>
					</p>
				</div>
			)}
		</article>
	)
}

export default DayTile
