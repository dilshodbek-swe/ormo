'use client'

import { AlertTriangle, ArrowDown, ArrowUp, Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, formatPrice } from '@/lib/utils'
import { type AdminBundle, bundleCapacity, bundleIssues } from '../_lib/types'
import BundleEquation from './bundle-equation'

export interface BundleActions {
	onEdit: (bundle: AdminBundle) => void
	onToggleVisible: (bundle: AdminBundle) => void
	onMove: (from: number, to: number) => void
	onDelete: (bundle: AdminBundle) => void
}

const compact = (value: number) =>
	value >= 1_000_000_000 ? `${(value / 1_000_000_000).toFixed(2)} mlrd` : value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)} mln` : formatPrice(value)

interface BundleCardProps {
	bundle: AdminBundle
	index: number
	count: number
	actions: BundleActions
}

/**
 * To'plam kartasi: tartib raqami (do'kondagi yorliq o'rni), chegirma "muhri", tenglama,
 * ogohlantirishlar (mahsulot tugagan/arxivda) va qisqa statistika.
 */
const BundleCard = ({ bundle, index, count, actions }: BundleCardProps) => {
	const issues = bundleIssues(bundle.productIds)
	const capacity = bundleCapacity(bundle.productIds)

	return (
		<article
			className={cn(
				'group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border bg-background p-5 transition-all hover:border-foreground/25 hover:shadow-[0_10px_30px_-16px_rgb(0_0_0/0.3)]',
				!bundle.visible && 'bg-muted/20'
			)}
		>
			{/* Katta chegirma "muhri" — burchakda, yarim ko'rinadigan */}
			<span
				aria-hidden
				className='pointer-events-none absolute -top-6 -right-4 font-space-grotesk text-8xl leading-none font-bold tracking-tighter text-foreground/[0.04] transition-transform duration-500 group-hover:-rotate-6'
			>
				{bundle.discount}%
			</span>

			<div className='relative flex items-start gap-3'>
				<span className='flex size-8 shrink-0 items-center justify-center rounded-md border font-mono text-xs text-muted-foreground'>
					{String(index + 1).padStart(2, '0')}
				</span>
				<div className='min-w-0 flex-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<button type='button' onClick={() => actions.onEdit(bundle)} className='truncate text-left font-semibold underline-offset-4 hover:underline'>
							{bundle.name}
						</button>
						<span className='rounded-md bg-foreground px-1.5 py-0.5 font-mono text-[10px] font-semibold text-background'>−{bundle.discount}%</span>
						{!bundle.visible && (
							<span className='rounded-full border border-dashed px-2 py-0.5 text-[10px] text-muted-foreground'>Yashirin</span>
						)}
					</div>
					<p className='mt-0.5 line-clamp-2 text-sm text-muted-foreground'>{bundle.tagline || '—'}</p>
				</div>
				<BundleMenu bundle={bundle} index={index} count={count} actions={actions} />
			</div>

			<BundleEquation productIds={bundle.productIds} discount={bundle.discount} flagged={new Set(issues.map(issue => issue.productId))} className='relative' />

			{issues.length > 0 && (
				<div className='relative flex gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 p-2.5 text-xs text-rose-700 dark:text-rose-400'>
					<AlertTriangle className='mt-px size-3.5 shrink-0' />
					<p>
						<span className='font-medium'>To&apos;plamni sotib bo&apos;lmaydi: </span>
						{issues.map(issue => issue.text).join('; ')}
					</p>
				</div>
			)}

			<dl className='relative mt-auto grid grid-cols-3 gap-2 border-t pt-3 text-xs'>
				<div>
					<dt className='text-muted-foreground'>Sotildi</dt>
					<dd className='font-mono font-medium tabular-nums'>{bundle.sold}</dd>
				</div>
				<div>
					<dt className='text-muted-foreground'>Tushum</dt>
					<dd className='font-mono font-medium tabular-nums'>{compact(bundle.revenue)}</dd>
				</div>
				<div>
					<dt className='text-muted-foreground'>Yig&apos;sa bo&apos;ladi</dt>
					<dd className={cn('font-mono font-medium tabular-nums', capacity === 0 && 'text-rose-600 dark:text-rose-400')}>{capacity} ta</dd>
				</div>
			</dl>
		</article>
	)
}

const itemClass =
	'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors outline-none hover:bg-muted focus-visible:bg-muted disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:text-muted-foreground'

const BundleMenu = ({ bundle, index, count, actions }: { bundle: AdminBundle; index: number; count: number; actions: BundleActions }) => {
	const [open, setOpen] = useState(false)
	const run = (action: () => void) => () => {
		setOpen(false)
		action()
	}
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label={`${bundle.name} amallari`}
				className='-mt-1 -mr-1.5 flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:bg-muted'
			>
				<MoreHorizontal className='size-4' />
			</PopoverTrigger>
			<PopoverContent align='end' sideOffset={4} className='w-52 gap-0 p-1'>
				<button type='button' className={itemClass} onClick={run(() => actions.onEdit(bundle))}>
					<Pencil />
					Tahrirlash
				</button>
				<button type='button' className={itemClass} onClick={run(() => actions.onToggleVisible(bundle))}>
					{bundle.visible ? <EyeOff /> : <Eye />}
					{bundle.visible ? "Do'kondan yashirish" : "Do'konda ko'rsatish"}
				</button>
				<button type='button' className={itemClass} disabled={index === 0} onClick={run(() => actions.onMove(index, index - 1))}>
					<ArrowUp />
					Oldinga
				</button>
				<button type='button' className={itemClass} disabled={index === count - 1} onClick={run(() => actions.onMove(index, index + 1))}>
					<ArrowDown />
					Orqaga
				</button>
				<div className='my-1 h-px bg-border' />
				<button
					type='button'
					className={cn(itemClass, 'text-destructive hover:bg-destructive/10 [&_svg]:text-destructive')}
					onClick={run(() => actions.onDelete(bundle))}
				>
					<Trash2 />
					O&apos;chirish
				</button>
			</PopoverContent>
		</Popover>
	)
}

export default BundleCard
