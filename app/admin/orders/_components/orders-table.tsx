'use client'

import { ChevronRight, PackageSearch } from 'lucide-react'
import Image from 'next/image'

import StatusBadge from '@/components/shared/status-badge'
import { getOrderCount, getOrderTotal } from '@/lib/data/orders'
import { cn, formatDate, formatPrice, formatRelative } from '@/lib/utils'
import { STATUS_COLORS } from '../_lib/order-utils'
import type { AdminOrder } from '../_lib/sample-orders'

interface OrdersTableProps {
	orders: AdminOrder[]
	query: string
	selectedId: string | null
	onSelect: (id: string) => void
	onReset: () => void
}

const COLUMNS = 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1.1fr)_7rem_9rem_1rem]'

/** Vercel "Deployments" ro'yxati kabi: chapda holat chizig'i, mono ID, nisbiy vaqt; qator bosilsa tafsilotlar */
const OrdersTable = ({ orders, query, selectedId, onSelect, onReset }: OrdersTableProps) => {
	if (orders.length === 0) {
		return (
			<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center'>
				<span className='flex size-11 items-center justify-center rounded-xl border bg-background'>
					<PackageSearch className='size-5 text-muted-foreground' />
				</span>
				<div className='space-y-1'>
					<p className='font-medium'>Hech narsa topilmadi</p>
					<p className='text-sm text-muted-foreground'>Filtr yoki qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring.</p>
				</div>
				<button type='button' onClick={onReset} className='text-sm underline underline-offset-4'>
					Filtrlarni tozalash
				</button>
			</div>
		)
	}

	return (
		<div className='overflow-hidden rounded-xl border bg-background'>
			<div
				className={cn(
					'hidden gap-4 border-b bg-muted/40 px-4 py-2.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase lg:grid',
					COLUMNS
				)}
			>
				<span>Buyurtma</span>
				<span>Mijoz</span>
				<span>Mahsulotlar</span>
				<span>To&apos;lov</span>
				<span className='text-right'>Jami</span>
				<span />
			</div>

			<ul className='divide-y'>
				{orders.map(order => (
					<li key={order.id}>
						<OrderRow order={order} query={query} selected={order.id === selectedId} onSelect={onSelect} />
					</li>
				))}
			</ul>
		</div>
	)
}

const OrderRow = ({
	order,
	query,
	selected,
	onSelect,
}: {
	order: AdminOrder
	query: string
	selected: boolean
	onSelect: (id: string) => void
}) => {
	const count = getOrderCount(order)

	return (
		<button
			type='button'
			onClick={() => onSelect(order.id)}
			className={cn(
				'group relative grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none lg:grid',
				COLUMNS,
				selected && 'bg-muted/60'
			)}
		>
			{/* Holat rangi — chap chetda ingichka chiziq */}
			<span aria-hidden className={cn('absolute inset-y-2 left-0 w-0.5 rounded-r-full', STATUS_COLORS[order.status])} />

			<div className='min-w-0 space-y-1'>
				<p className='flex items-center gap-2 font-mono text-sm font-medium'>
					<Highlight text={order.id} query={query} />
				</p>
				<p className='truncate text-xs text-muted-foreground' title={formatDate(order.createdAt, { time: true })}>
					<span suppressHydrationWarning>{formatRelative(order.createdAt)}</span>
				</p>
			</div>

			<div className='order-first col-span-2 flex min-w-0 items-center gap-2.5 lg:order-0 lg:col-span-1'>
				<Initials name={order.customer.name} />
				<div className='min-w-0'>
					<p className='truncate text-sm font-medium'>
						<Highlight text={order.customer.name} query={query} />
					</p>
					<p className='truncate text-xs text-muted-foreground'>
						{order.customer.city} · <span className='font-mono'>{order.customer.phone}</span>
					</p>
				</div>
				<span className='ml-auto lg:hidden'>
					<StatusBadge status={order.status} />
				</span>
			</div>

			<div className='hidden min-w-0 items-center gap-3 lg:flex'>
				<div className='flex -space-x-2'>
					{order.items.slice(0, 3).map(({ product }) => (
						<span
							key={product.id}
							className='relative size-8 overflow-hidden rounded-md border bg-muted ring-2 ring-background transition-transform group-hover:translate-x-0.5'
						>
							<Image src={product.image} alt='' fill sizes='32px' className='object-contain p-0.5' />
						</span>
					))}
				</div>
				<p className='min-w-0 truncate text-xs text-muted-foreground'>
					<Highlight text={order.items[0].product.name} query={query} />
					{order.items.length > 1 && ` +${order.items.length - 1}`}
					<span className='block font-mono'>{count} dona</span>
				</p>
			</div>

			<div className='hidden lg:block'>
				<StatusBadge status={order.status} />
				<p className='mt-1 text-xs text-muted-foreground'>{order.payment}</p>
			</div>

			<p className='text-right font-mono text-sm font-medium tabular-nums'>{formatPrice(getOrderTotal(order))}</p>

			<ChevronRight className='hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 lg:block' />
		</button>
	)
}

/** Ism-familiyadan 2 harf; rang ismdan barqaror hisoblanadi */
const Initials = ({ name }: { name: string }) => {
	const initials = name
		.split(' ')
		.map(part => part.charAt(0))
		.join('')
		.slice(0, 2)
	const hue = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360

	return (
		<span
			aria-hidden
			className='flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white'
			style={{ background: `linear-gradient(135deg, oklch(0.72 0.14 ${hue}), oklch(0.5 0.16 ${(hue + 60) % 360}))` }}
		>
			{initials}
		</span>
	)
}

/** Qidiruv so'zini matn ichida belgilaydi */
const Highlight = ({ text, query }: { text: string; query: string }) => {
	const q = query.trim()
	const index = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1
	if (index < 0) return <>{text}</>

	return (
		<>
			{text.slice(0, index)}
			<mark className='rounded-[3px] bg-amber-300/60 text-inherit dark:bg-amber-500/40'>{text.slice(index, index + q.length)}</mark>
			{text.slice(index + q.length)}
		</>
	)
}

export { Initials }
export default OrdersTable
