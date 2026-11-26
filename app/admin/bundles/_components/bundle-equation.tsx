import { Equal, Plus } from 'lucide-react'
import Image from 'next/image'
import { Fragment } from 'react'

import { cn, formatPrice } from '@/lib/utils'
import { bundleProducts, bundleTotals } from '../_lib/types'

interface BundleEquationProps {
	productIds: string[]
	discount: number
	/** Muammoli mahsulotlar — qizil chegara bilan */
	flagged?: Set<string>
	className?: string
}

/**
 * Do'kondagi "tenglama"ning ixcham nusxasi: [rasm] + [rasm] + [rasm] = narx.
 * Kartada ham, tahrirlagichdagi jonli ko'rinishda ham bir xil.
 */
const BundleEquation = ({ productIds, discount, flagged, className }: BundleEquationProps) => {
	const products = bundleProducts(productIds)
	const { subtotal, total, savings } = bundleTotals(productIds, discount)

	return (
		<div className={cn('flex flex-wrap items-center gap-1.5', className)}>
			{products.map((product, index) => (
				<Fragment key={product.id}>
					{index > 0 && (
						<span aria-hidden className='flex size-5 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground'>
							<Plus className='size-3' strokeWidth={2.5} />
						</span>
					)}
					<span
						title={`${product.name} — ${formatPrice(product.price)}`}
						className={cn(
							'relative size-14 shrink-0 overflow-hidden rounded-lg border bg-white transition-transform hover:-translate-y-0.5',
							flagged?.has(product.id) && 'border-rose-500 ring-2 ring-rose-500/20'
						)}
					>
						<Image src={product.images[0]?.url ?? ''} alt={product.name} fill sizes='56px' className='object-contain p-1.5 mix-blend-multiply' />
					</span>
				</Fragment>
			))}
			{products.length > 0 && (
				<>
					<span
						aria-hidden
						className='flex size-6 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-300 via-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/30'
					>
						<Equal className='size-3.5' strokeWidth={2.5} />
					</span>
					<span className='ml-1 min-w-0'>
						<span className='block font-mono text-base font-semibold tabular-nums'>{formatPrice(total)}</span>
						<span className='block font-mono text-[11px] text-muted-foreground tabular-nums'>
							<span className='line-through'>{formatPrice(subtotal)}</span>
							<span className='ml-1.5 text-emerald-600 dark:text-emerald-400'>−{formatPrice(savings)}</span>
						</span>
					</span>
				</>
			)}
		</div>
	)
}

export default BundleEquation
