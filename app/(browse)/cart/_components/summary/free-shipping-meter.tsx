import { Truck } from 'lucide-react'

import { FREE_SHIPPING_FROM } from '@/lib/store/cart/cart-pricing'
import { cn, formatPrice } from '@/lib/utils'

/** Bepul yetkazishgacha qancha qolgani — olov rangidagi to'lib boruvchi chiziq */
const FreeShippingMeter = ({ untilFree }: { untilFree: number }) => {
	const isFree = untilFree === 0
	const progress = ((FREE_SHIPPING_FROM - untilFree) / FREE_SHIPPING_FROM) * 100

	return (
		<div className='space-y-2'>
			<p className='flex items-center gap-2 text-xs'>
				<Truck className={cn('size-4', isFree ? 'text-emerald-600' : 'text-muted-foreground')} />
				{isFree ? (
					<span className='font-medium text-emerald-700 dark:text-emerald-400'>
						Yetkazish bepul
					</span>
				) : (
					<span className='text-muted-foreground'>
						Bepul yetkazishgacha{' '}
						<span className='font-mono font-semibold text-foreground'>{formatPrice(untilFree)}</span>
					</span>
				)}
			</p>
			<div className='h-1 overflow-hidden rounded-full bg-border'>
				<div
					className={cn(
						'h-full rounded-full transition-[width] duration-700 ease-out',
						isFree ? 'bg-emerald-500' : 'bg-linear-to-r from-amber-300 via-orange-500 to-rose-500'
					)}
					style={{ width: `${Math.min(progress, 100)}%` }}
				/>
			</div>
		</div>
	)
}

export default FreeShippingMeter
