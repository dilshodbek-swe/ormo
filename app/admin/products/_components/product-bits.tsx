'use client'

import { Archive, ArchiveRestore, Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { type AdminProduct, LOW_STOCK, PRODUCT_STATUS, type ProductStatus } from '../_lib/types'

/** Saqlangan (/images) yoki yangi yuklangan (blob:) rasm — blob uchun optimizatsiyasiz */
export const ProductImg = ({ url, sizes, className }: { url: string; sizes: string; className?: string }) => (
	<Image src={url} alt='' fill sizes={sizes} unoptimized={url.startsWith('blob:')} className={cn('object-contain mix-blend-multiply dark:mix-blend-normal', className)} />
)

export const StatusPill = ({ status, className }: { status: ProductStatus; className?: string }) => (
	<span
		className={cn(
			'inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-2 py-0.5 text-[11px] font-medium backdrop-blur',
			className
		)}
	>
		<span className={cn('size-1.5 rounded-full', PRODUCT_STATUS[status].dot)} />
		{PRODUCT_STATUS[status].label}
	</span>
)

/** Qoldiq: son + 10 bo'lakli kichik o'lchagich (kam qolsa — qizil) */
export const StockMeter = ({ stock }: { stock: number }) => {
	const filled = Math.min(stock, 10)
	const tone = stock === 0 ? 'bg-rose-500' : stock <= LOW_STOCK ? 'bg-amber-500' : 'bg-foreground/70'

	return (
		<span className='inline-flex items-center gap-2' title={`${stock} dona`}>
			<span className='flex gap-px' aria-hidden>
				{Array.from({ length: 10 }, (_, index) => (
					<span key={index} className={cn('h-2.5 w-0.75 rounded-[1px]', index < filled ? tone : 'bg-border')} />
				))}
			</span>
			<span className={cn('font-mono text-xs tabular-nums', stock === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground')}>
				{stock === 0 ? 'tugagan' : `${stock} dona`}
			</span>
		</span>
	)
}

export interface ProductActions {
	onEdit: (product: AdminProduct) => void
	onDuplicate: (product: AdminProduct) => void
	onToggleArchive: (product: AdminProduct) => void
	onDelete: (product: AdminProduct) => void
}

const itemClass =
	'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors outline-none hover:bg-muted focus-visible:bg-muted [&_svg]:size-4 [&_svg]:text-muted-foreground'

/** "…" menyu — karta va qatorda bir xil */
export const ProductMenu = ({ product, actions, className }: { product: AdminProduct; actions: ProductActions; className?: string }) => {
	const [open, setOpen] = useState(false)
	const run = (action: (product: AdminProduct) => void) => () => {
		setOpen(false)
		action(product)
	}
	const archived = product.status === 'archived'

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label={`${product.name} amallari`}
				onClick={event => event.stopPropagation()}
				className={cn(
					'flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:bg-muted data-popup-open:text-foreground',
					className
				)}
			>
				<MoreHorizontal className='size-4' />
			</PopoverTrigger>
			<PopoverContent align='end' sideOffset={4} className='w-48 gap-0 p-1' onClick={event => event.stopPropagation()}>
				<button type='button' className={itemClass} onClick={run(actions.onEdit)}>
					<Pencil />
					Tahrirlash
				</button>
				<button type='button' className={itemClass} onClick={run(actions.onDuplicate)}>
					<Copy />
					Nusxa yaratish
				</button>
				<button type='button' className={itemClass} onClick={run(actions.onToggleArchive)}>
					{archived ? <ArchiveRestore /> : <Archive />}
					{archived ? 'Arxivdan chiqarish' : 'Arxivlash'}
				</button>
				<div className='my-1 h-px bg-border' />
				<button
					type='button'
					className={cn(itemClass, 'text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10 [&_svg]:text-destructive')}
					onClick={run(actions.onDelete)}
				>
					<Trash2 />
					O&apos;chirish
				</button>
			</PopoverContent>
		</Popover>
	)
}
