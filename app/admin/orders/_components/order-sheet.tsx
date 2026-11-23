'use client'

import { ArrowRight, Check, CircleSlash, Copy, Mail, MapPin, Phone, Wallet } from 'lucide-react'
import Image from 'next/image'
import { type ReactNode, useState } from 'react'

import OrderTracker from '@/components/shared/order-tracker'
import StatusBadge from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { getOrderSubtotal, getOrderTotal } from '@/lib/data/orders'
import { formatDate, formatPrice } from '@/lib/utils'
import { canCancel, getNextAction } from '../_lib/order-utils'
import type { AdminOrder } from '../_lib/sample-orders'
import { Initials } from './orders-table'

interface OrderSheetProps {
	order: AdminOrder | null
	onClose: () => void
	onAdvance: (id: string) => void
	onCancel: (id: string) => void
}

/** O'ngdan chiqadigan panel: bosqichlar, mijoz, mahsulotlar, hisob va holatni o'zgartirish */
const OrderSheet = ({ order, onClose, onAdvance, onCancel }: OrderSheetProps) => {
	return (
		<Sheet open={Boolean(order)} onOpenChange={open => !open && onClose()}>
			<SheetContent className='w-full gap-0 overflow-hidden p-0 data-[side=right]:sm:max-w-lg'>
				{/* Ichki komponent buyurtma almashganda qayta mount bo'ladi — "bekor qilish" tasdig'i tozalanadi */}
				{order && <OrderDetails key={order.id} order={order} onAdvance={onAdvance} onCancel={onCancel} />}
			</SheetContent>
		</Sheet>
	)
}

const OrderDetails = ({
	order,
	onAdvance,
	onCancel,
}: {
	order: AdminOrder
	onAdvance: (id: string) => void
	onCancel: (id: string) => void
}) => {
	const [confirming, setConfirming] = useState(false)
	const [copied, setCopied] = useState(false)
	const next = getNextAction(order)
	const subtotal = getOrderSubtotal(order)

	const copyId = async () => {
		await navigator.clipboard.writeText(order.id)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	return (
		<>
			<div className='border-b p-5 pr-12'>
				<div className='flex items-center gap-2'>
					<SheetTitle className='font-mono text-lg font-semibold'>{order.id}</SheetTitle>
					<button
						type='button'
						onClick={copyId}
						aria-label='ID nusxalash'
						className='rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-3.5'
					>
						{copied ? <Check /> : <Copy />}
					</button>
					<span className='ml-auto'>
						<StatusBadge status={order.status} />
					</span>
				</div>
				<SheetDescription className='mt-1 text-xs'>{formatDate(order.createdAt, { time: true })} da qabul qilingan</SheetDescription>
			</div>

			<div className='flex-1 space-y-6 overflow-y-auto p-5'>
				{order.status === 'cancelled' ? (
					<div className='flex gap-3 rounded-lg border border-dashed p-4 text-sm'>
						<CircleSlash className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
						<div>
							<p className='font-medium'>Buyurtma bekor qilingan</p>
							<p className='text-muted-foreground'>{order.cancelReason}</p>
						</div>
					</div>
				) : (
					<div className='rounded-lg border bg-muted/20 px-2 py-4'>
						<OrderTracker order={order} />
					</div>
				)}

				<Section title='Mijoz'>
					<div className='flex items-center gap-3'>
						<Initials name={order.customer.name} />
						<p className='font-medium'>{order.customer.name}</p>
					</div>
					<dl className='mt-3 space-y-2 text-sm'>
						<Detail icon={<Phone />}>
							<a href={`tel:${order.customer.phone.replace(/\s/g, '')}`} className='font-mono hover:underline'>
								{order.customer.phone}
							</a>
						</Detail>
						<Detail icon={<Mail />}>
							<a href={`mailto:${order.customer.email}`} className='hover:underline'>
								{order.customer.email}
							</a>
						</Detail>
						<Detail icon={<MapPin />}>{order.address}</Detail>
						<Detail icon={<Wallet />}>{order.payment}</Detail>
					</dl>
				</Section>

				<Section title={`Mahsulotlar · ${order.items.length}`}>
					<ul className='divide-y rounded-lg border'>
						{order.items.map(({ product, quantity, price }) => (
							<li key={product.id} className='flex items-center gap-3 p-3'>
								<span className='relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted'>
									<Image src={product.image} alt='' fill sizes='48px' className='object-contain p-1' />
								</span>
								<div className='min-w-0 flex-1'>
									<p className='truncate text-sm font-medium'>{product.name}</p>
									<p className='text-xs text-muted-foreground'>
										{product.brand} · <span className='font-mono'>{quantity} × {formatPrice(price)}</span>
									</p>
								</div>
								<p className='font-mono text-sm tabular-nums'>{formatPrice(price * quantity)}</p>
							</li>
						))}
					</ul>
					<dl className='mt-3 space-y-1.5 px-1 text-sm'>
						<Row label='Mahsulotlar'>{formatPrice(subtotal)}</Row>
						<Row label='Yetkazish'>{order.shipping ? formatPrice(order.shipping) : 'Bepul'}</Row>
						<div className='flex justify-between border-t pt-2 font-medium'>
							<dt>Jami</dt>
							<dd className='font-mono tabular-nums'>{formatPrice(getOrderTotal(order))}</dd>
						</div>
					</dl>
				</Section>
			</div>

			{(next || canCancel(order)) && (
				<div className='space-y-2 border-t bg-muted/30 p-4'>
					{confirming ? (
						<div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
							<p className='flex-1 text-sm'>Buyurtma bekor qilinsinmi? Mijozga mablag&apos; qaytariladi.</p>
							<div className='flex gap-2'>
								<Button variant='outline' onClick={() => setConfirming(false)}>
									Yo&apos;q
								</Button>
								<Button variant='destructive' onClick={() => onCancel(order.id)}>
									Ha, bekor qilish
								</Button>
							</div>
						</div>
					) : (
						<div className='flex gap-2'>
							{next && (
								<Button className='flex-1 justify-between' onClick={() => onAdvance(order.id)}>
									<span>{next.label}</span>
									<ArrowRight />
								</Button>
							)}
							{canCancel(order) && (
								<Button variant='outline' onClick={() => setConfirming(true)}>
									Bekor qilish
								</Button>
							)}
						</div>
					)}
					{next && !confirming && <p className='text-xs text-muted-foreground'>{next.hint}</p>}
				</div>
			)}
		</>
	)
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
	<section>
		<h3 className='mb-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{title}</h3>
		{children}
	</section>
)

const Detail = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
	<div className='flex items-start gap-2.5'>
		<dt className='mt-0.5 text-muted-foreground [&_svg]:size-3.5'>{icon}</dt>
		<dd className='min-w-0'>{children}</dd>
	</div>
)

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
	<div className='flex justify-between text-muted-foreground'>
		<dt>{label}</dt>
		<dd className='font-mono tabular-nums'>{children}</dd>
	</div>
)

export default OrderSheet
