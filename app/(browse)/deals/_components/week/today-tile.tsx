'use client'

import { Flame, ShoppingBag } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import useDayCountdown from '@/lib/hooks/use-day-countdown'
import { cn, formatPrice } from '@/lib/utils'
import BurningBorder from './burning-border'
import type { WeekDay } from './week-days'

const pad = (n: number | null) => (n === null ? '--' : String(n).padStart(2, '0'))

/** Bugungi taklif — katta, qorong'i va olov ramkali plitka */
const TodayTile = ({ day, className }: { day: WeekDay; className?: string }) => {
	const { deal } = day
	const { hours, minutes, seconds } = useDayCountdown()

	return (
		<BurningBorder className={cn('shadow-2xl shadow-orange-500/20', className)}>
			<article className='group flex h-full flex-col gap-6 p-6 sm:p-8'>
				<div className='flex flex-wrap items-center justify-between gap-3'>
					<p className='flex items-center gap-2 font-mono text-xs tracking-widest uppercase'>
						<Flame className='size-4 text-orange-400' />
						Bugun · {day.name}
					</p>
					<p className='rounded-full border border-background/15 px-3 py-1 font-mono text-xs tabular-nums'>
						<span className='text-background/60'>Tugashiga </span>
						{pad(hours)}:{pad(minutes)}:{pad(seconds)}
					</p>
				</div>

				{/* Rasm — orqasida ulkan foiz */}
				<div className='relative flex flex-1 items-center justify-center py-4'>
					<span
						aria-hidden
						className='pointer-events-none absolute inset-0 flex items-center justify-center bg-linear-to-br from-amber-300 via-orange-500 to-rose-500 bg-clip-text font-space-grotesk text-[7rem] leading-none font-bold tracking-tighter text-transparent opacity-30 select-none sm:text-[10rem]'
					>
						-{deal.discount}%
					</span>
					<div className='relative flex aspect-square w-1/2 max-w-64 items-center justify-center rounded-full bg-white p-[10%] transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-3'>
						<Image
							src={deal.image}
							alt={`${deal.brand} ${deal.name}`}
							width={1200}
							height={1200}
							sizes='(min-width: 1024px) 25vw, 50vw'
							className='h-full w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain'
						/>
					</div>
				</div>

				<div className='flex flex-wrap items-end justify-between gap-4'>
					<div className='space-y-2'>
						<p className='font-mono text-xs tracking-widest uppercase opacity-60'>{deal.brand}</p>
						<h3 className='font-space-grotesk text-2xl font-bold tracking-tight sm:text-3xl'>
							{deal.name}
						</h3>
						<div className='flex flex-wrap items-baseline gap-x-3'>
							<p className='font-mono text-2xl font-bold tracking-tight'>{formatPrice(deal.price)}</p>
							<p className='font-mono text-sm text-background/50 line-through decoration-rose-500'>
								{formatPrice(deal.oldPrice)}
							</p>
						</div>
					</div>

					<Button
						size='lg'
						className='h-11 bg-linear-to-r from-orange-500 to-rose-500 px-6 text-white hover:opacity-90'
					>
						<ShoppingBag />
						Savatga
					</Button>
				</div>
			</article>
		</BurningBorder>
	)
}

export default TodayTile
