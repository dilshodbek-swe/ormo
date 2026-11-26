'use client'

import { ArrowUpRight, Check } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import PageHeader from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { discountOf, getProduct, HERO_LIMIT, sampleHero, sampleWeek, WEEKDAYS, weekDates, weekdayIndex, type WeekSlot } from '../_lib/deals'
import DiscountMap from './discount-map'
import HeroLineup from './hero-lineup'
import SlotEditor from './slot-editor'
import { useToday } from './use-today'
import WeekBoard from './week-board'

const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']

const compact = (value: number) => (value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)} mln` : formatPrice(value))

/**
 * Aksiyalar (namunaviy rejim): hafta jadvali va hero karuseli shu sahifa xotirasida.
 * Backend ulanganda saqlash — `requireAdmin()` bilan himoyalangan Server Action, /deals esa shu jadvaldan o'qiydi.
 */
const DealsView = () => {
	const [week, setWeek] = useState(sampleWeek)
	const [hero, setHero] = useState(sampleHero)
	const [editingDay, setEditingDay] = useState<number | null>(null)
	const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
	const today = useToday()

	useEffect(() => {
		if (!toast) return
		const timer = setTimeout(() => setToast(null), 3200)
		return () => clearTimeout(timer)
	}, [toast])
	const notify = (text: string) => setToast({ id: Date.now(), text })

	const dates = today ? weekDates(today) : null
	const todayIndex = today ? weekdayIndex(today) : null
	const range = dates
		? dates[0].getMonth() === dates[6].getMonth()
			? `${dates[0].getDate()}–${dates[6].getDate()} ${MONTHS[dates[6].getMonth()]}`
			: `${dates[0].getDate()} ${MONTHS[dates[0].getMonth()]} – ${dates[6].getDate()} ${MONTHS[dates[6].getMonth()]}`
		: ''

	const filled = week.filter(slot => getProduct(slot.productId))
	const savings = filled.reduce((sum, slot) => sum + (getProduct(slot.productId)!.oldPrice - slot.dealPrice), 0)
	const averageDiscount = filled.length ? Math.round(filled.reduce((sum, slot) => sum + discountOf(getProduct(slot.productId)!, slot.dealPrice), 0) / filled.length) : 0
	const sold = week.filter(slot => todayIndex !== null && slot.day <= todayIndex).reduce((sum, slot) => sum + slot.sold, 0)
	const todaySlot = todayIndex !== null ? week[todayIndex] : null
	const todayProduct = getProduct(todaySlot?.productId ?? null)

	const swap = (from: number, to: number) => {
		setWeek(list => {
			const next = [...list]
			const a = next[from]
			const b = next[to]
			next[from] = { ...b, day: from }
			next[to] = { ...a, day: to }
			return next
		})
		notify(`${WEEKDAYS[from]} ↔ ${WEEKDAYS[to]} almashtirildi`)
	}

	const usedElsewhere = (day: number) =>
		new Map(week.filter(slot => slot.day !== day && slot.productId).map(slot => [slot.productId!, WEEKDAYS[slot.day]]))

	return (
		<>
			<PageHeader
				eyebrow={`Admin · Katalog${range ? ` · ${range}` : ''}`}
				title={
					<>
						Aksiyalar <span className='text-muted-foreground'>· {filled.length}/7 kun</span>
					</>
				}
				description='Har kunga bitta "kun taklifi" va /deals tepasidagi karusel. Kartalarni sudrab kunlarini almashtiring.'
				action={
					<Button variant='outline' className='h-9' nativeButton={false} render={<Link href='/deals' target='_blank' />}>
						Do&apos;konda ko&apos;rish
						<ArrowUpRight />
					</Button>
				}
			/>

			<div className='space-y-6'>
				<div className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border xl:grid-cols-4'>
					<Stat label='Bugun' value={todayProduct ? `−${discountOf(todayProduct, todaySlot!.dealPrice)}%` : '—'} hint={todayProduct?.name ?? "Bugun taklif yo'q"} />
					<Stat label="O'rtacha chegirma" value={`${averageDiscount}%`} hint={`${filled.length} ta kun taklifi`} />
					<Stat label='Hafta tejami' value={`${compact(savings)} so'm`} hint='har kunga bittadan olsa' />
					<Stat label='Sotilgan' value={sold} hint='hafta boshidan bugungacha' />
				</div>

				<section className='space-y-3'>
					<div className='flex items-baseline justify-between gap-3'>
						<h2 className='font-medium'>Hafta jadvali</h2>
						<p className='hidden text-xs text-muted-foreground sm:block'>Bosing — tahrirlash · sudrang — kunni almashtirish</p>
					</div>
					<WeekBoard week={week} dates={dates} todayIndex={todayIndex} onEdit={setEditingDay} onSwap={swap} />
				</section>

				<div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-start'>
					<HeroLineup
						hero={hero}
						onChange={next => {
							setHero(next)
							if (next.mode !== hero.mode) notify(next.mode === 'auto' ? 'Karusel avtomatik rejimda' : "Karusel qo'lda boshqariladi")
						}}
					/>
					<DiscountMap
						hero={hero}
						scheduledIds={new Set(filled.map(slot => slot.productId!))}
						onAddToHero={id => {
							if (hero.productIds.length >= HERO_LIMIT) return
							setHero({ ...hero, productIds: [...hero.productIds, id] })
							notify(`${getProduct(id)?.name} karuselga qo'shildi`)
						}}
					/>
				</div>

				<p className='px-1 font-mono text-[11px] text-muted-foreground'>
					namunaviy rejim — o&apos;zgarishlar sahifa yangilanguncha saqlanadi · do&apos;kondagi /deals hozircha o&apos;z mantig&apos;idan foydalanadi
				</p>
			</div>

			<SlotEditor
				slot={editingDay === null ? null : week[editingDay]}
				usedElsewhere={usedElsewhere}
				todayIndex={todayIndex}
				onClose={() => setEditingDay(null)}
				onSave={(slot: WeekSlot) => {
					setWeek(list => list.map(item => (item.day === slot.day ? slot : item)))
					setEditingDay(null)
					notify(`${WEEKDAYS[slot.day]}: ${getProduct(slot.productId)?.name}`)
				}}
				onClear={day => {
					setWeek(list => list.map(item => (item.day === day ? { ...item, productId: null, dealPrice: 0, limit: null, sold: 0 } : item)))
					setEditingDay(null)
					notify(`${WEEKDAYS[day]} bo'shatildi`)
				}}
			/>

			{toast && (
				<div
					key={toast.id}
					role='status'
					className='fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm animate-in items-center gap-2.5 rounded-xl border bg-foreground px-4 py-3 text-sm text-background shadow-2xl fade-in slide-in-from-bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6'
				>
					<span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white'>
						<Check className='size-3' />
					</span>
					<span className='min-w-0 truncate'>{toast.text}</span>
				</div>
			)}
		</>
	)
}

const Stat = ({ label, value, hint }: { label: string; value: string | number; hint: string }) => (
	<div className='min-w-0 bg-background p-4 sm:p-5'>
		<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{label}</p>
		<p className='mt-2 font-space-grotesk text-2xl font-bold tracking-tight whitespace-nowrap tabular-nums sm:text-3xl'>{value}</p>
		<p className='mt-1 truncate text-xs text-muted-foreground'>{hint}</p>
	</div>
)

export default DealsView
