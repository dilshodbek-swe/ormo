'use client'

import { Check, Copy, Copy as Duplicate, MoreHorizontal, Pause, Pencil, Play, Trash2 } from 'lucide-react'
import { type ReactNode, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, formatPrice } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '../../products/_lib/types'
import { type Coupon, type CouponStatus, formatValue, STATUS_META, timeHint, timeProgress } from '../_lib/types'

export interface CouponActions {
	onEdit: (coupon: Coupon) => void
	onDuplicate: (coupon: Coupon) => void
	onTogglePause: (coupon: Coupon) => void
	onDelete: (coupon: Coupon) => void
}

interface CouponTicketProps {
	coupon: Coupon
	status: CouponStatus
	today: string
	/** Tahrirlagichdagi jonli ko'rinish — menyu va nusxa tugmasisiz */
	preview?: boolean
	actions?: CouponActions
}

/** Holatga qarab chap "qirqim" (stub) ko'rinishi */
const STUB: Record<CouponStatus, string> = {
	active: 'bg-foreground text-background',
	scheduled: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
	paused: 'bg-[repeating-linear-gradient(-45deg,var(--color-amber-500)_0_6px,transparent_6px_12px)] bg-amber-500/10 text-amber-900 dark:text-amber-200 [&_.stub-value]:bg-background/85 [&_.stub-value]:rounded-md [&_.stub-value]:px-1.5',
	exhausted: 'bg-muted text-muted-foreground',
	expired: 'bg-muted text-muted-foreground/70',
}

const dateLabel = (value: string) => {
	const [, month, day] = value.split('-').map(Number)
	const months = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek']
	return `${day}-${months[month - 1]}`
}

/**
 * Kupon — haqiqiy chipta kabi: chapda qiymat, perforatsiyali kesik (yuqori/pastki o'yiqlar bilan),
 * o'ngda kod, shartlar, ishlatilish va vaqt chiziqlari.
 */
const CouponTicket = ({ coupon, status, today, preview = false, actions }: CouponTicketProps) => {
	const [copied, setCopied] = useState(false)
	const dimmed = status === 'expired' || status === 'exhausted'
	const progress = timeProgress(coupon, today)
	const usage = coupon.maxUses ? Math.min(coupon.uses / coupon.maxUses, 1) : null
	const categories = coupon.categories.map(id => PRODUCT_CATEGORIES.find(item => item.id === id)?.label ?? id)

	const copy = async () => {
		await navigator.clipboard.writeText(coupon.code)
		setCopied(true)
		setTimeout(() => setCopied(false), 1400)
	}

	return (
		<div
			className={cn(
				'group/ticket relative isolate flex min-h-44 rounded-xl border bg-background transition-all',
				!preview && 'hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-14px_rgb(0_0_0/0.3)]',
				dimmed && 'opacity-75 hover:opacity-100'
			)}
		>
			{/* Qiymat qirqimi */}
			<div className={cn('flex w-21 shrink-0 flex-col items-center justify-center gap-1 rounded-l-[11px] px-1.5 text-center sm:w-30 sm:px-2', STUB[status])}>
				<span className={cn('stub-value font-space-grotesk text-2xl leading-none sm:text-3xl font-bold tracking-tighter tabular-nums', dimmed && 'line-through decoration-2')}>
					{formatValue(coupon)}
				</span>
				<span className='font-mono text-[9px] tracking-[0.2em] uppercase opacity-80'>{coupon.type === 'percent' ? 'chegirma' : "so'm"}</span>
			</div>

			{/* Perforatsiya: shtrix chiziq + yuqori/pastki o'yiqlar */}
			<div aria-hidden className='relative w-0 border-l-2 border-dashed border-border'>
				<span className='absolute -top-px left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-b bg-background' />
				<span className='absolute -bottom-px left-1/2 size-4 -translate-x-1/2 translate-y-1/2 rounded-full border-t bg-background' />
			</div>

			<div className='flex min-w-0 flex-1 flex-col gap-3 p-3 sm:p-4'>
				<div className='flex items-start gap-2'>
					<div className='min-w-0 flex-1'>
						<div className='flex items-center gap-1.5'>
							<span className={cn('truncate font-mono text-base font-semibold tracking-wider', dimmed && 'text-muted-foreground')}>
								{coupon.code || 'KOD'}
							</span>
							{!preview && (
								<button
									type='button'
									onClick={copy}
									aria-label={`${coupon.code} kodini nusxalash`}
									className='rounded p-1 text-muted-foreground opacity-0 transition-opacity group-hover/ticket:opacity-100 hover:text-foreground focus-visible:opacity-100 [&_svg]:size-3.5'
								>
									{copied ? <Check className='text-emerald-600' /> : <Copy />}
								</button>
							)}
						</div>
						<p className='truncate text-xs text-muted-foreground'>{coupon.description || 'Tavsif yo‘q'}</p>
					</div>
					<span
						title={STATUS_META[status].label}
						className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full border px-1.5 py-1 text-[10px] font-medium sm:px-2 sm:py-0.5', STATUS_META[status].pill)}
					>
						<span className={cn('size-1.5 rounded-full', STATUS_META[status].dot)} />
						{/* Telefonda faqat nuqta — kod to'liq ko'rinsin */}
						<span className='hidden sm:inline'>{STATUS_META[status].label}</span>
						<span className='sr-only sm:hidden'>{STATUS_META[status].label}</span>
					</span>
					{actions && <TicketMenu coupon={coupon} status={status} actions={actions} />}
				</div>

				<div className='flex flex-wrap gap-1'>
					<Chip>{coupon.minOrder ? `${formatPrice(coupon.minOrder)} dan` : 'Minimal summasiz'}</Chip>
					{coupon.firstOrderOnly && <Chip>Birinchi xarid</Chip>}
					{coupon.onePerCustomer && <Chip>1 mijozga 1 marta</Chip>}
					<Chip>{categories.length ? categories.join(', ') : 'Barcha kategoriyalar'}</Chip>
				</div>

				<div className='mt-auto grid grid-cols-2 gap-4'>
					<Meter
						label='Ishlatilgan'
						value={coupon.maxUses ? `${coupon.uses}/${coupon.maxUses}` : `${coupon.uses} · ∞`}
						progress={usage}
						tone={usage !== null && usage >= 0.9 ? 'bg-rose-500' : 'bg-foreground/70'}
					/>
					<Meter
						label={coupon.endsAt ? `${dateLabel(coupon.startsAt)} → ${dateLabel(coupon.endsAt)}` : `${dateLabel(coupon.startsAt)} dan`}
						value={timeHint(coupon, today)}
						progress={status === 'scheduled' ? 0 : progress}
						tone={status === 'active' && progress !== null && progress > 0.8 ? 'bg-amber-500' : 'bg-foreground/70'}
					/>
				</div>
			</div>
		</div>
	)
}

const Chip = ({ children }: { children: ReactNode }) => (
	<span className='rounded-md border bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground'>{children}</span>
)

const Meter = ({ label, value, progress, tone }: { label: string; value: string; progress: number | null; tone: string }) => (
	<div className='min-w-0 space-y-1'>
		<div className='flex items-baseline justify-between gap-2'>
			<span className='truncate font-mono text-[10px] text-muted-foreground'>{label}</span>
		</div>
		{progress === null ? (
			<div className='h-1 rounded-full bg-[repeating-linear-gradient(90deg,var(--color-border)_0_4px,transparent_4px_7px)]' />
		) : (
			<div className='h-1 overflow-hidden rounded-full bg-muted'>
				<div className={cn('h-full rounded-full transition-[width] duration-700', tone)} style={{ width: `${progress * 100}%` }} />
			</div>
		)}
		<p className='truncate text-xs font-medium tabular-nums' suppressHydrationWarning>
			{value}
		</p>
	</div>
)

const itemClass =
	'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors outline-none hover:bg-muted focus-visible:bg-muted [&_svg]:size-4 [&_svg]:text-muted-foreground'

const TicketMenu = ({ coupon, status, actions }: { coupon: Coupon; status: CouponStatus; actions: CouponActions }) => {
	const [open, setOpen] = useState(false)
	const run = (action: (coupon: Coupon) => void) => () => {
		setOpen(false)
		action(coupon)
	}
	const canPause = status === 'active' || status === 'scheduled' || status === 'paused'

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label={`${coupon.code} amallari`}
				className='-mt-1 -mr-1.5 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:bg-muted'
			>
				<MoreHorizontal className='size-4' />
			</PopoverTrigger>
			<PopoverContent align='end' sideOffset={4} className='w-48 gap-0 p-1'>
				<button type='button' className={itemClass} onClick={run(actions.onEdit)}>
					<Pencil />
					Tahrirlash
				</button>
				<button type='button' className={itemClass} onClick={run(actions.onDuplicate)}>
					<Duplicate />
					Nusxa yaratish
				</button>
				{canPause && (
					<button type='button' className={itemClass} onClick={run(actions.onTogglePause)}>
						{coupon.paused ? <Play /> : <Pause />}
						{coupon.paused ? 'Davom ettirish' : "To'xtatish"}
					</button>
				)}
				<div className='my-1 h-px bg-border' />
				<button
					type='button'
					className={cn(itemClass, 'text-destructive hover:bg-destructive/10 [&_svg]:text-destructive')}
					onClick={run(actions.onDelete)}
				>
					<Trash2 />
					O&apos;chirish
				</button>
			</PopoverContent>
		</Popover>
	)
}

export default CouponTicket
