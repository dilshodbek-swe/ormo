'use client'

import { PackageSearch, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import GridFrame from '@/components/shared/grid-frame'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getOrderStats, type OrderStatus, orders } from '@/lib/data/orders'
import { cn, formatPrice } from '@/lib/utils'
import PageHeader from '../../_components/page-header'
import OrderCard from './order-card'

type Filter = 'all' | 'active' | Extract<OrderStatus, 'delivered' | 'cancelled'>

const filters: { value: Filter; label: string; match: (status: OrderStatus) => boolean }[] = [
	{ value: 'all', label: 'Barchasi', match: () => true },
	{ value: 'active', label: 'Faol', match: status => status === 'processing' || status === 'shipped' },
	{ value: 'delivered', label: 'Yetkazilgan', match: status => status === 'delivered' },
	{ value: 'cancelled', label: 'Bekor qilingan', match: status => status === 'cancelled' },
]

// Yangilari tepada
const sortedOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

const OrdersView = () => {
	const [filter, setFilter] = useState<Filter>('all')
	const [query, setQuery] = useState('')
	const stats = getOrderStats()

	const match = filters.find(item => item.value === filter)!.match
	const q = query.trim().toLowerCase()
	const visible = sortedOrders.filter(
		order =>
			match(order.status) &&
			(!q ||
				order.id.toLowerCase().includes(q) ||
				order.items.some(({ product }) =>
					`${product.brand} ${product.name}`.toLowerCase().includes(q)
				))
	)

	return (
		<>
			<PageHeader
				eyebrow={`Dashboard · Buyurtmalar · ${stats.count} ta`}
				title={
					stats.active > 0 ? (
						<>
							{stats.active} ta buyurtma yo&apos;lda.{' '}
							<span className='text-muted-foreground'>Kuzatib boring.</span>
						</>
					) : (
						'Buyurtmalar'
					)
				}
				description={`Hozirgacha ${formatPrice(stats.spent)} lik xarid qildingiz va ${formatPrice(stats.saved)} tejadingiz.`}
			/>

			<div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				{/* Segmentli filtr */}
				<div role='tablist' aria-label='Holat bo‘yicha' className='flex overflow-x-auto border p-1'>
					{filters.map(item => {
						const count = orders.filter(order => item.match(order.status)).length
						const active = filter === item.value

						return (
							<button
								key={item.value}
								type='button'
								role='tab'
								aria-selected={active}
								onClick={() => setFilter(item.value)}
								className={cn(
									'flex shrink-0 items-center gap-2 px-3 py-1.5 text-sm transition-colors',
									active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
								)}
							>
								{item.label}
								<span
									className={cn(
										'font-mono text-[11px] tabular-nums',
										active ? 'text-background/70' : 'text-muted-foreground'
									)}
								>
									{count}
								</span>
							</button>
						)
					})}
				</div>

				<div className='relative sm:w-64'>
					<Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						value={query}
						onChange={event => setQuery(event.target.value)}
						placeholder='Raqam yoki mahsulot'
						aria-label='Buyurtmalarni qidirish'
						className='h-10 rounded-none pr-9 pl-9'
					/>
					{query && (
						<button
							type='button'
							onClick={() => setQuery('')}
							aria-label='Qidiruvni tozalash'
							className='absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground'
						>
							<X className='size-3.5' />
						</button>
					)}
				</div>
			</div>

			{visible.length > 0 ? (
				<div className='space-y-3'>
					{visible.map((order, index) => (
						<OrderCard
							key={order.id}
							order={order}
							// Birinchi faol buyurtma ochiq turadi — eng muhim ma'lumot darhol ko'rinadi
							defaultOpen={index === 0 && order.status !== 'delivered' && order.status !== 'cancelled'}
						/>
					))}
				</div>
			) : (
				<GridFrame className='flex flex-col items-center gap-4 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[18px_18px] px-6 py-16 text-center'>
					<span className='flex size-12 items-center justify-center rounded-full border bg-background'>
						<PackageSearch className='size-5 text-muted-foreground' />
					</span>
					<div className='space-y-1'>
						<p className='font-space-grotesk text-xl font-bold tracking-tight'>Hech narsa topilmadi</p>
						<p className='text-sm text-muted-foreground'>Filtr yoki qidiruvni o&apos;zgartirib ko&apos;ring.</p>
					</div>
					<div className='flex gap-2'>
						<Button
							variant='outline'
							className='bg-background'
							onClick={() => {
								setFilter('all')
								setQuery('')
							}}
						>
							Filtrni tozalash
						</Button>
						<Button nativeButton={false} render={<Link href='/shop' />}>
							Do&apos;konga o&apos;tish
						</Button>
					</div>
				</GridFrame>
			)}
		</>
	)
}

export default OrdersView
