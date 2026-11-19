import type { Deal } from '@/lib/data/deals'
import { formatPrice } from '@/lib/utils'

/**
 * Narx "sahnasi": eski narx qizil chiziq bilan o'chiriladi,
 * so'ng yangi narx yuqoridan tushib keladi. Slayd almashganda `key` orqali qayta o'ynaydi.
 */
const DealPrice = ({ deal }: { deal: Deal }) => {
	return (
		<div className='space-y-3'>
			<p className='relative w-fit font-mono text-lg text-background/50'>
				{formatPrice(deal.oldPrice)}
				<span
					aria-hidden
					className='absolute inset-x-0 top-1/2 h-0.5 origin-left -rotate-3 rounded-full bg-rose-500 motion-safe:animate-strike'
				/>
				<span className='sr-only'>— eski narx</span>
			</p>

			<p className='font-mono text-4xl font-bold tracking-tight motion-safe:animate-price-drop sm:text-5xl'>
				{formatPrice(deal.price)}
			</p>

			<p className='inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300 motion-safe:animate-price-drop'>
				{formatPrice(deal.oldPrice - deal.price)} tejaysiz
			</p>
		</div>
	)
}

export default DealPrice
