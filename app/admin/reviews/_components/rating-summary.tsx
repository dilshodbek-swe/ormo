import { cn } from '@/lib/utils'
import type { ratingStats } from '../_lib/reviews'
import Stars from './stars'

type Stats = ReturnType<typeof ratingStats>

interface RatingSummaryProps {
	stats: Stats
	ratingFilter: number | null
	onRatingFilter: (stars: number | null) => void
}

/**
 * O'rtacha baho + taqsimot (5★ → 1★): har bir qator — filtr tugmasi, son har doim yozilgan.
 * Yonida moderatsiya ko'rsatkichlari: navbat, javob darajasi, tasdiqlangan xaridlar.
 */
const RatingSummary = ({ stats, ratingFilter, onRatingFilter }: RatingSummaryProps) => {
	const max = Math.max(...stats.distribution.map(row => row.count), 1)

	return (
		<div className='grid gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
			<div className='grid gap-6 bg-background p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center'>
				<div>
					<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>O&apos;rtacha baho</p>
					<p className='mt-1 font-space-grotesk text-6xl leading-none font-bold tracking-tighter tabular-nums'>{stats.average.toFixed(1)}</p>
					<Stars value={stats.average} className='mt-2' />
					<p className='mt-1 text-xs text-muted-foreground'>{stats.total} ta sharh (yashirilganlarsiz)</p>
				</div>
				<ul className='space-y-1'>
					{stats.distribution.map(row => {
						const active = ratingFilter === row.stars
						return (
							<li key={row.stars}>
								<button
									type='button'
									aria-pressed={active}
									onClick={() => onRatingFilter(active ? null : row.stars)}
									className={cn(
										'grid w-full grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-2 rounded-md px-1.5 py-1 text-xs transition-colors hover:bg-muted',
										active && 'bg-muted ring-1 ring-foreground/15',
										ratingFilter !== null && !active && 'opacity-50'
									)}
								>
									<span className='font-mono text-muted-foreground'>{row.stars}★</span>
									<span className='h-2 overflow-hidden rounded-full bg-muted'>
										<span className='block h-full rounded-full bg-amber-400 transition-[width] duration-700' style={{ width: `${(row.count / max) * 100}%` }} />
									</span>
									<span className='text-right font-mono tabular-nums'>{row.count}</span>
								</button>
							</li>
						)
					})}
				</ul>
			</div>
			<div className='grid grid-cols-3 gap-px bg-border lg:grid-cols-1'>
				<Mini label='Navbatda' value={stats.pending} hint='moderatsiya kutmoqda' pulse={stats.pending > 0} />
				<Mini label='Javob darajasi' value={`${Math.round(stats.responseRate * 100)}%`} hint='1–2★ sharhlarga' />
				<Mini label='Tasdiqlangan xarid' value={`${Math.round(stats.verifiedRate * 100)}%`} hint='bizdan sotib olganlar' />
			</div>
		</div>
	)
}

const Mini = ({ label, value, hint, pulse = false }: { label: string; value: string | number; hint: string; pulse?: boolean }) => (
	<div className='flex min-w-0 flex-col justify-center bg-background px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-3'>
		<div className='min-w-0'>
			<p className='truncate font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{label}</p>
			<p className='hidden truncate text-xs text-muted-foreground lg:block'>{hint}</p>
		</div>
		<p className='flex items-center gap-2 font-space-grotesk text-2xl font-bold tracking-tight tabular-nums'>
			{value}
			{pulse && (
				<span className='relative flex size-2'>
					<span className='absolute inset-0 animate-ping rounded-full bg-amber-500 opacity-70' />
					<span className='relative size-2 rounded-full bg-amber-500' />
				</span>
			)}
		</p>
	</div>
)

export default RatingSummary
