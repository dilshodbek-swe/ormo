import { type Deal, deals } from '@/lib/data/deals'

export const WEEKDAYS = [
	'Dushanba',
	'Seshanba',
	'Chorshanba',
	'Payshanba',
	'Juma',
	'Shanba',
	'Yakshanba',
] as const

const MONTHS = [
	'yanvar',
	'fevral',
	'mart',
	'aprel',
	'may',
	'iyun',
	'iyul',
	'avgust',
	'sentabr',
	'oktabr',
	'noyabr',
	'dekabr',
] as const

export type DayStatus = 'past' | 'today' | 'upcoming'

export interface WeekDay {
	index: number
	name: (typeof WEEKDAYS)[number]
	date: Date
	status: DayStatus
	deal: Deal
}

/** Haftaning har kuniga bittadan taklif (eng kattasi dushanbadan boshlab) */
const dealForDay = (index: number) => deals[index % deals.length]

/** Dushanba = 0 … Yakshanba = 6 */
const weekdayIndex = (date: Date) => (date.getDay() + 6) % 7

/** Berilgan kun joylashgan haftaning 7 kuni va har birining holati */
export const buildWeek = (today: Date): WeekDay[] => {
	const todayIndex = weekdayIndex(today)
	const monday = new Date(today)
	monday.setDate(today.getDate() - todayIndex)

	return WEEKDAYS.map((name, index) => {
		const date = new Date(monday)
		date.setDate(monday.getDate() + index)

		return {
			index,
			name,
			date,
			status: index < todayIndex ? 'past' : index === todayIndex ? 'today' : 'upcoming',
			deal: dealForDay(index),
		}
	})
}

/** "17–23 noyabr" yoki oy almashsa "28 oktabr – 3 noyabr" */
export const formatWeekRange = (week: WeekDay[]) => {
	const first = week[0].date
	const last = week[week.length - 1].date
	const month = (date: Date) => MONTHS[date.getMonth()]

	return first.getMonth() === last.getMonth()
		? `${first.getDate()}–${last.getDate()} ${month(last)}`
		: `${first.getDate()} ${month(first)} – ${last.getDate()} ${month(last)}`
}

export const weekSavings = (week: WeekDay[]) =>
	week.reduce((sum, day) => sum + day.deal.oldPrice - day.deal.price, 0)
