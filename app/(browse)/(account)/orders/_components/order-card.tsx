'use client'

import { ChevronDown, CreditCard, MapPin, RotateCcw, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	getOrderCount,
	getOrderSavings,
	getOrderSubtotal,
	getOrderTotal,
	type Order,
} from '@/lib/data/orders'
import { useStore } from '@/lib/store'
import { cn, formatDate, formatPrice } from '@/lib/utils'
import OrderTracker from './order-tracker'
import StatusBadge from './status-badge'

const Line = ({ label, children }: { label: string; children: React.ReactNode }) => (
	<div className='flex items-baseline justify-between gap-4 py-2'>
		<dt className='text-sm text-muted-foreground'>{label}</dt>
		<dd className='font-mono text-sm tabular-nums'>{children}</dd>
	</div>
)

/** Bitta buyurtma: yig'ilgan holatda qisqa ma'lumot, ochilganda kuzatuv va chek */
const OrderCard = ({ order, defaultOpen = false }: { order: Order; defaultOpen?: boolean }) => {
	const [open, setOpen] = useState(defaultOpen)
	const addToCart = useStore(state => state.addToCart)
	const router = useRouter()

	const count = getOrderCount(order)
	const savings = getOrderSavings(order)
	const thumbs = order.items.slice(0, 3)
	const detailsId = `${order.id}-details`

	const reorder = () => {
		order.items.forEach(line => addToCart(line.product.id, line.quantity))
		router.push('/cart')
	}

	return (
		<article
			className={cn(
				'border bg-background transition-shadow',
				open && 'shadow-[0_24px_48px_-32px_rgb(0_0_0/0.25)]'
			)}
		>
			{/* Qisqa ko'rinish — butun qator bosiladi */}
			<button
				type='button'
				onClick={() => setOpen(value => !value)}
				aria-expanded={open}
				aria-controls={detailsId}
				className='flex w-full flex-col gap-4 p-4 text-left transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:p-5'
			>
				<div className='flex -space-x-3'>
					{thumbs.map(({ product }) => (
						<span
							key={product.id}
							className='relative size-14 overflow-hidden rounded-lg border bg-muted/40 ring-2 ring-background'
						>
							<Image src={product.image} alt={product.name} fill sizes='56px' className='object-contain p-1.5' />
						</span>
					))}
				</div>

				<div className='min-w-0 flex-1 space-y-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<span className='font-mono text-sm font-medium'>#{order.id}</span>
						<StatusBadge status={order.status} />
					</div>
					<p className='truncate text-sm text-muted-foreground'>
						{order.items.map(line => `${line.product.brand} ${line.product.name}`).join(', ')}
					</p>
				</div>

				<div className='flex items-center justify-between gap-6 sm:justify-end'>
					<div className='sm:text-right'>
						<p className='font-mono text-sm font-medium tabular-nums'>{formatPrice(getOrderTotal(order))}</p>
						<p className='text-xs text-muted-foreground'>
							{formatDate(order.createdAt)} · {count} dona
						</p>
					</div>
					<ChevronDown
						className={cn('size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
					/>
				</div>
			</button>

			{/* Batafsil — grid-rows animatsiyasi bilan silliq ochiladi */}
			<div
				id={detailsId}
				className={cn(
					'grid transition-[grid-template-rows] duration-300 ease-out',
					open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
				)}
			>
				<div className='overflow-hidden'>
					<div className='space-y-6 border-t border-dashed p-4 sm:p-5'>
						{order.status === 'cancelled' ? (
							<p className='border border-dashed px-4 py-3 text-sm text-muted-foreground'>
								{order.cancelReason}
							</p>
						) : (
							<div className='space-y-4'>
								<OrderTracker order={order} />
								{order.eta && order.status !== 'delivered' && (
									<p className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
										<Truck className='size-4' />
										Taxminiy yetib kelish:{' '}
										<span className='font-medium text-foreground'>{formatDate(order.eta)}</span>
									</p>
								)}
							</div>
						)}

						<div className='grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]'>
							<ul className='divide-y border'>
								{order.items.map(({ product, quantity, price }) => (
									<li key={product.id} className='flex items-center gap-3 p-3'>
										<span className='relative size-12 shrink-0 overflow-hidden rounded-md bg-muted/40'>
											<Image src={product.image} alt='' fill sizes='48px' className='object-contain p-1' />
										</span>
										<div className='min-w-0 flex-1'>
											<Link
												href={`/shop/${product.id}`}
												className='block truncate text-sm font-medium hover:underline'
											>
												{product.brand} {product.name}
											</Link>
											<p className='font-mono text-xs text-muted-foreground'>
												{quantity} × {formatPrice(price)}
											</p>
										</div>
										<span className='font-mono text-sm tabular-nums'>{formatPrice(price * quantity)}</span>
									</li>
								))}
							</ul>

							<div className='space-y-4'>
								<dl className='divide-y divide-dashed border-y border-dashed'>
									<Line label='Mahsulotlar'>{formatPrice(getOrderSubtotal(order))}</Line>
									{savings > 0 && (
										<Line label='Tejaldi'>
											<span className='text-emerald-700 dark:text-emerald-400'>{formatPrice(savings)}</span>
										</Line>
									)}
									<Line label='Yetkazish'>{order.shipping ? formatPrice(order.shipping) : 'Bepul'}</Line>
									<Line label='Jami'>
										<span className='font-semibold text-foreground'>{formatPrice(getOrderTotal(order))}</span>
									</Line>
								</dl>

								<div className='space-y-2 text-sm text-muted-foreground'>
									<p className='flex gap-2'>
										<MapPin className='mt-0.5 size-4 shrink-0' />
										{order.address}
									</p>
									<p className='flex gap-2'>
										<CreditCard className='mt-0.5 size-4 shrink-0' />
										{order.payment}
									</p>
								</div>

								<Button variant='outline' onClick={reorder} className='w-full'>
									<RotateCcw />
									Qayta buyurtma berish
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
	)
}

export default OrderCard
