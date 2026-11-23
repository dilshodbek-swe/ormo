import { ArrowRight, PackageCheck, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { getOrderTotal, type Order } from '@/lib/data/orders'
import { formatDate, formatPrice } from '@/lib/utils'
import OrderTracker from '@/components/shared/order-tracker'
import StatusBadge from '@/components/shared/status-badge'

/** Eng so'nggi faol buyurtma — kuzatuv chizig'i bilan */
const ActiveOrder = ({ order }: { order?: Order }) => {
	if (!order) {
		return (
			<section className='flex h-full flex-col items-center justify-center gap-3 border bg-background p-8 text-center'>
				<span className='flex size-11 items-center justify-center rounded-full border'>
					<PackageCheck className='size-5 text-muted-foreground' />
				</span>
				<p className='font-space-grotesk text-lg font-bold tracking-tight'>Yo&apos;lda buyurtma yo&apos;q</p>
				<p className='text-sm text-muted-foreground'>Hammasi yetib kelgan. Yangi narsa tanlaymizmi?</p>
				<Button variant='outline' nativeButton={false} render={<Link href='/shop' />}>
					Do&apos;konga o&apos;tish
				</Button>
			</section>
		)
	}

	return (
		<section className='flex h-full flex-col border bg-background'>
			<header className='flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3'>
				<div className='flex items-center gap-2'>
					<Truck className='size-4 text-muted-foreground' />
					<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>Yo&apos;ldagi buyurtma</h2>
				</div>
				<StatusBadge status={order.status} />
			</header>

			<div className='flex flex-1 flex-col gap-6 p-5'>
				<div className='flex items-center gap-4'>
					<div className='flex -space-x-3'>
						{order.items.slice(0, 3).map(({ product }) => (
							<span
								key={product.id}
								className='relative flex size-14 items-center justify-center overflow-hidden rounded-xl border bg-white ring-2 ring-background'
							>
								<Image src={product.image} alt='' width={96} height={96} className='size-11 object-contain' />
							</span>
						))}
					</div>
					<div className='min-w-0'>
						<p className='font-space-grotesk text-xl font-bold tracking-tight'>{order.id}</p>
						<p className='truncate text-sm text-muted-foreground'>
							{order.items.map(({ product }) => product.name).join(', ')}
						</p>
					</div>
					<p className='ml-auto hidden shrink-0 font-mono text-sm font-medium sm:block'>
						{formatPrice(getOrderTotal(order))}
					</p>
				</div>

				<OrderTracker order={order} />

				<div className='mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-dashed pt-4'>
					<p className='text-sm text-muted-foreground'>
						{order.eta ? (
							<>
								Taxminan <span className='font-medium text-foreground'>{formatDate(order.eta, { time: true, year: false })}</span>{' '}
								yetib keladi
							</>
						) : (
							'Tez orada jo‘natiladi'
						)}
					</p>
					<Link
						href='/dashboard/orders'
						className='group inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline'
					>
						Batafsil
						<ArrowRight className='size-3.5 transition-transform group-hover:translate-x-0.5' />
					</Link>
				</div>
			</div>
		</section>
	)
}

export default ActiveOrder
