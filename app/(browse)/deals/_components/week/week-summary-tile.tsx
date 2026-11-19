import { cn, formatPrice } from '@/lib/utils'
import { type WeekDay, weekSavings } from './week-days'

/** "Hafta yo'li": 7 bo'lakli progress va hafta bo'yi jami tejash */
const WeekSummaryTile = ({ week, className }: { week: WeekDay[]; className?: string }) => {
	const todayIndex = week.findIndex(day => day.status === 'today')
	const left = week.length - todayIndex - 1

	return (
		<article
			className={cn(
				'flex flex-col justify-between gap-8 rounded-2xl border bg-muted/40 p-6 sm:p-8',
				className
			)}
		>
			<div className='space-y-2'>
				<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
					Hafta yo&apos;li · {todayIndex + 1}/{week.length}
				</p>
				<p className='font-space-grotesk text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl'>
					Hafta bo&apos;yi jami{' '}
					<span className='whitespace-nowrap text-emerald-600 dark:text-emerald-400'>
						{formatPrice(weekSavings(week))}
					</span>{' '}
					tejash imkoni.
				</p>
				<p className='text-sm text-muted-foreground'>
					{left > 0
						? `Yana ${left} ta taklif ochilishi kutilmoqda.`
						: 'Bugun — haftaning so\'nggi taklifi.'}
				</p>
			</div>

			{/* Har kun — bitta bo'lak: o'tgani to'la, bugungisi yonmoqda, kelayotgani bo'sh */}
			<ol className='grid grid-cols-7 gap-1.5'>
				{week.map(day => (
					<li key={day.index} className='space-y-2'>
						<span
							className={cn(
								'block h-1.5 rounded-full',
								day.status === 'past' && 'bg-foreground/80',
								day.status === 'today' &&
									'bg-linear-to-r from-amber-300 via-orange-500 to-rose-500 motion-safe:animate-pulse',
								day.status === 'upcoming' && 'bg-border'
							)}
						/>
						<span
							className={cn(
								'block text-center font-mono text-[10px] uppercase',
								day.status === 'today' ? 'font-bold text-orange-600' : 'text-muted-foreground'
							)}
						>
							{day.name.slice(0, 2)}
						</span>
					</li>
				))}
			</ol>
		</article>
	)
}

export default WeekSummaryTile
