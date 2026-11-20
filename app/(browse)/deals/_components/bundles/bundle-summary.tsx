import AddToCartButton from '@/components/shared/add-to-cart-button'
import type { getBundleTotals } from '@/lib/data/bundles'
import { cn, formatPrice } from '@/lib/utils'

type Props = {
	discount: number
	totals: ReturnType<typeof getBundleTotals>
	/** Savatga qo'shiladigan (tanlangan) mahsulotlar */
	selectedIds: string[]
	className?: string
}

/** Tenglamaning javobi: to'plam narxi, tejash yoki "qo'shsangiz" eslatmasi */
const BundleSummary = ({ discount, totals, selectedIds, className }: Props) => {
	const { count, missing, isComplete, subtotal, total, bundleSavings } = totals

	return (
		<div
			className={cn(
				'flex flex-col justify-between gap-6 rounded-2xl bg-foreground p-6 text-background',
				className
			)}
		>
			<div className='space-y-4'>
				<div className='flex items-center justify-between gap-3'>
					<p className='font-mono text-xs tracking-widest uppercase opacity-60'>
						{count} ta mahsulot
					</p>
					<span
						className={cn(
							'rounded-full px-2.5 py-1 font-mono text-xs font-semibold',
							isComplete
								? 'bg-linear-to-r from-orange-500 to-rose-500 text-white'
								: 'border border-background/20 text-background/50'
						)}
					>
						-{discount}%
					</span>
				</div>

				<div className='space-y-1'>
					{isComplete && (
						<p className='font-mono text-sm text-background/50 line-through decoration-rose-500'>
							{formatPrice(subtotal)}
						</p>
					)}
					{/* key — narx o'zgarganda yangi qiymat yuqoridan sirg'alib keladi */}
					<p
						key={total}
						className='animate-in fade-in slide-in-from-top-2 font-mono text-3xl font-bold tracking-tight duration-300'
					>
						{formatPrice(total)}
					</p>
				</div>

				{isComplete ? (
					<p className='inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300'>
						{formatPrice(bundleSavings)} tejaysiz
					</p>
				) : (
					<p className='text-sm text-background/70'>
						{count === 0 ? 'To\'plam bo\'sh. ' : `Yana ${missing} ta qo'shsangiz, `}
						<span className='font-medium text-orange-300'>
							{formatPrice(bundleSavings)} tejaysiz
						</span>
						{count === 0 && ' — to\'liq olsangiz.'}
					</p>
				)}
			</div>

			<AddToCartButton
				productIds={selectedIds}
				size='lg'
				disabled={count === 0}
				className='h-11 bg-background text-foreground hover:bg-background/90'
			>
				{isComplete ? 'To\'plamni savatga' : 'Savatga qo\'shish'}
			</AddToCartButton>
		</div>
	)
}

export default BundleSummary
