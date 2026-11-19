'use client'

import DayTile from './day-tile'
import TodayTile from './today-tile'
import useWeek from './use-week'
import { formatWeekRange } from './week-days'
import WeekHeader from './week-header'
import WeekSkeleton from './week-skeleton'
import WeekSummaryTile from './week-summary-tile'

/**
 * Bento grid (lg, 4 ustun):
 * ┌─────────┬────┬────┐
 * │  bugun  │ d1 │ d2 │
 * │         ├────┼────┤
 * │         │ d3 │ d4 │
 * ├────┬────┼────┴────┤
 * │ d5 │ d6 │ hafta   │
 * └────┴────┴─────────┘
 */
const WeekOffers = () => {
	const week = useWeek()
	const today = week?.find(day => day.status === 'today')
	const others = week?.filter(day => day.status !== 'today') ?? []

	return (
		<section className='mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 md:py-24'>
			<WeekHeader range={week && formatWeekRange(week)} />

			{week && today ? (
				<div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
					<TodayTile day={today} className='col-span-2 lg:row-span-2' />
					{others.map(day => (
						<DayTile key={day.index} day={day} />
					))}
					<WeekSummaryTile week={week} className='col-span-2' />
				</div>
			) : (
				<WeekSkeleton />
			)}
		</section>
	)
}

export default WeekOffers
