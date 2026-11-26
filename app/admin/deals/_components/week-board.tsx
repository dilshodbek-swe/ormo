'use client'

import { Flame, GripHorizontal, Plus } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { cn, formatPrice } from '@/lib/utils'
import { discountOf, getProduct, WEEKDAYS, type WeekSlot } from '../_lib/deals'
import { useMidnightCountdown } from './use-today'

interface WeekBoardProps {
	week: WeekSlot[]
	dates: Date[] | null
	todayIndex: number | null
	onEdit: (day: number) => void
	onSwap: (from: number, to: number) => void
}

const MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek']

/**
 * Hafta jadvali — 7 ta "slot". Bugungi kun ajralib turadi (yarim tungacha jonli taymer),
 * o'tgan kunlar xiralashadi. Kartani boshqa kunga sudrab tashlasangiz — joylari almashadi.
 */
const WeekBoard = ({ week, dates, todayIndex, onEdit, onSwap }: WeekBoardProps) => {
	const [dragDay, setDragDay] = useState<number | null>(null)
	const [overDay, setOverDay] = useState<number | null>(null)

	return (
		<ol className='grid grid-cols-2 gap-3 md:grid-cols-4 2xl:grid-cols-7'>
			{week.map(slot => {
				const state = todayIndex === null ? 'upcoming' : slot.day < todayIndex ? 'past' : slot.day === todayIndex ? 'today' : 'upcoming'
				return (
					<li
						key={slot.day}
						draggable={Boolean(slot.productId)}
						onDragStart={event => {
							setDragDay(slot.day)
							event.dataTransfer.effectAllowed = 'move'
						}}
						onDragOver={event => {
							if (dragDay === null) return
							event.preventDefault()
							setOverDay(slot.day)
						}}
						onDragLeave={() => setOverDay(current => (current === slot.day ? null : current))}
						onDrop={event => {
							event.preventDefault()
							if (dragDay !== null && dragDay !== slot.day) onSwap(dragDay, slot.day)
						}}
						onDragEnd={() => {
							setDragDay(null)
							setOverDay(null)
						}}
						className={cn(
							'min-w-0 transition-all',
							dragDay === slot.day && 'scale-95 opacity-40',
							overDay === slot.day && dragDay !== slot.day && 'scale-[1.02]',
							state === 'today' && 'md:col-span-2 2xl:col-span-1'
						)}
					>
						<Slot slot={slot} state={state} date={dates?.[slot.day] ?? null} highlighted={overDay === slot.day && dragDay !== slot.day} onEdit={() => onEdit(slot.day)} />
					</li>
				)
			})}
		</ol>
	)
}

interface SlotProps {
	slot: WeekSlot
	state: 'past' | 'today' | 'upcoming'
	date: Date | null
	highlighted: boolean
	onEdit: () => void
}

const Slot = ({ slot, state, date, highlighted, onEdit }: SlotProps) => {
	const product = getProduct(slot.productId)
	const today = state === 'today'
	const soldOut = state !== 'upcoming' && slot.limit !== null && slot.sold >= slot.limit

	const header = (
		<div className={cn('flex items-center justify-between gap-2 px-3 pt-3 text-xs', today ? 'text-background' : 'text-muted-foreground')}>
			<span className='flex items-center gap-1.5 font-medium'>
				{today && <Flame className='size-3.5 text-orange-400' />}
				{WEEKDAYS[slot.day]}
			</span>
			<span className='font-mono text-[10px]'>{date ? `${date.getDate()}-${MONTHS[date.getMonth()]}` : ''}</span>
		</div>
	)

	if (!product) {
		return (
			<button
				type='button'
				onClick={onEdit}
				className={cn(
					'flex h-full min-h-72 w-full flex-col rounded-xl border border-dashed text-left transition-colors hover:border-foreground/40 hover:bg-muted/30',
					today && 'border-foreground bg-foreground',
					highlighted && 'border-foreground bg-muted/50'
				)}
			>
				{header}
				<span className={cn('m-auto flex flex-col items-center gap-2 text-sm', today ? 'text-background/70' : 'text-muted-foreground')}>
					<span className='flex size-9 items-center justify-center rounded-full border border-dashed'>
						<Plus className='size-4' />
					</span>
					Taklif qo&apos;shish
				</span>
			</button>
		)
	}

	const discount = discountOf(product, slot.dealPrice)

	return (
		<button
			type='button'
			onClick={onEdit}
			className={cn(
				'group relative flex h-full min-h-72 w-full cursor-grab flex-col overflow-hidden rounded-xl border text-left transition-all active:cursor-grabbing',
				today
					? 'border-foreground bg-foreground text-background shadow-[0_16px_40px_-18px_rgb(0_0_0/0.6)]'
					: 'bg-background hover:-translate-y-0.5 hover:border-foreground/25',
				state === 'past' && 'opacity-55 hover:opacity-100',
				highlighted && 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
			)}
		>
			{header}
			<GripHorizontal
				className={cn('absolute top-3 left-1/2 size-3.5 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-60', today && 'text-background')}
			/>

			<div className='relative mx-3 mt-3 aspect-square overflow-hidden rounded-lg bg-white'>
				<Image
					src={product.image}
					alt=''
					fill
					sizes='200px'
					className='object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105'
				/>
				<span className='absolute top-2 left-2 rounded-md bg-foreground px-1.5 py-0.5 font-mono text-[11px] font-semibold text-background'>
					−{discount}%
				</span>
				{soldOut && (
					<span className='absolute inset-0 flex items-center justify-center bg-background/70 font-mono text-xs font-semibold tracking-widest text-foreground uppercase backdrop-blur-[1px]'>
						Tugadi
					</span>
				)}
			</div>

			<div className='flex flex-1 flex-col gap-2 p-3'>
				<div className='min-w-0'>
					<p className={cn('font-mono text-[10px] tracking-widest uppercase', today ? 'text-background/60' : 'text-muted-foreground')}>{product.brand}</p>
					<p className='line-clamp-2 text-sm leading-snug font-medium'>{product.name}</p>
				</div>
				<div className='mt-auto'>
					<p className='font-mono text-sm font-semibold tabular-nums'>{formatPrice(slot.dealPrice)}</p>
					<p className={cn('font-mono text-[11px] tabular-nums line-through', today ? 'text-background/50' : 'text-muted-foreground')}>
						{formatPrice(product.oldPrice)}
					</p>
				</div>
				<LimitMeter slot={slot} inverted={today} upcoming={state === 'upcoming'} />
				{today && <Countdown />}
			</div>
		</button>
	)
}

const LimitMeter = ({ slot, inverted, upcoming }: { slot: WeekSlot; inverted: boolean; upcoming: boolean }) => {
	// Hali boshlanmagan kun — faqat ajratilgan miqdor
	if (upcoming) {
		return (
			<p className='font-mono text-[10px] text-muted-foreground'>
				{slot.limit === null ? 'limitsiz' : `${slot.limit} dona ajratilgan`} · boshlanmagan
			</p>
		)
	}
	if (slot.limit === null) {
		return <p className={cn('font-mono text-[10px]', inverted ? 'text-background/60' : 'text-muted-foreground')}>{slot.sold} sotildi · limitsiz</p>
	}
	const ratio = Math.min(slot.sold / slot.limit, 1)
	return (
		<div className='space-y-1'>
			<div className={cn('h-1 overflow-hidden rounded-full', inverted ? 'bg-background/20' : 'bg-muted')}>
				<div
					className={cn('h-full rounded-full transition-[width] duration-700', ratio >= 1 ? 'bg-rose-500' : inverted ? 'bg-orange-400' : 'bg-foreground/70')}
					style={{ width: `${ratio * 100}%` }}
				/>
			</div>
			<p className={cn('font-mono text-[10px] tabular-nums', inverted ? 'text-background/60' : 'text-muted-foreground')}>
				{slot.sold}/{slot.limit} sotildi
			</p>
		</div>
	)
}

const Countdown = () => {
	const left = useMidnightCountdown()
	return (
		<p className='flex items-center justify-between rounded-md bg-background/10 px-2 py-1.5 font-mono text-[11px]'>
			<span className='text-background/60'>tugashiga</span>
			<span className='font-semibold tabular-nums'>{left ?? '--:--:--'}</span>
		</p>
	)
}

export default WeekBoard
