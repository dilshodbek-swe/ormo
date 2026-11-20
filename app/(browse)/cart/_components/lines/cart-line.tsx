import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import QuantityStepper from '@/components/shared/quantity-stepper'
import type { Product } from '@/lib/data/products'
import { cn, formatPrice } from '@/lib/utils'

type Props = {
	index: number
	product: Product
	quantity: number
	stock: number
	onQuantityChange: (quantity: number) => void
	onRemove: () => void
}

/** Savatdagi bitta qator: rasm, nom, narx, miqdor, jami va o'chirish */
const CartLine = ({ index, product, quantity, stock, onQuantityChange, onRemove }: Props) => {
	const hasDiscount = product.price < product.oldPrice
	const atMax = quantity >= stock

	return (
		<li className='group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 p-4 sm:p-5 md:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto_auto]'>
			<span className='hidden font-mono text-[11px] text-muted-foreground md:block'>
				{String(index + 1).padStart(2, '0')}
			</span>

			<Link
				href={`/shop/${product.id}`}
				className='relative size-20 overflow-hidden rounded-lg border bg-white sm:size-24'
			>
				<Image
					src={product.image}
					alt={`${product.brand} ${product.name}`}
					fill
					sizes='96px'
					className='mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain p-2 transition-transform duration-500 group-hover:scale-105'
				/>
			</Link>

			<div className='min-w-0 space-y-1'>
				<p className='font-mono text-[11px] tracking-widest text-muted-foreground uppercase'>
					{product.brand}
				</p>
				<Link
					href={`/shop/${product.id}`}
					className='line-clamp-2 font-medium underline-offset-4 hover:underline'
				>
					{product.name}
				</Link>
				<p className='flex flex-wrap items-baseline gap-x-2 font-mono text-xs'>
					<span>{formatPrice(product.price)}</span>
					{hasDiscount && (
						<span className='text-muted-foreground line-through'>
							{formatPrice(product.oldPrice)}
						</span>
					)}
				</p>
			</div>

			{/* Mobilda o'chirish tugmasi yuqori o'ng burchakda, md'da — qator oxirida */}
			<button
				type='button'
				onClick={onRemove}
				aria-label={`${product.name} — savatdan o'chirish`}
				className='flex size-8 items-center justify-center self-start rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:order-last md:self-center'
			>
				<X className='size-4' />
			</button>

			{/* Mobilda miqdor va jami bir qatorda; md'da `contents` — ikkalasi alohida ustun */}
			<div className='col-span-3 flex items-center justify-between gap-4 md:contents'>
				<div className='flex flex-col items-start gap-1 md:items-end'>
					<QuantityStepper
						value={quantity}
						max={stock}
						onChange={onQuantityChange}
						size='sm'
					/>
					<p
						className={cn(
							'h-3.5 font-mono text-[10px] text-orange-600 transition-opacity',
							atMax ? 'opacity-100' : 'opacity-0'
						)}
					>
						Omborda shuncha bor
					</p>
				</div>

				<p className='text-right font-mono text-sm font-semibold tabular-nums md:min-w-36'>
					{formatPrice(product.price * quantity)}
				</p>
			</div>
		</li>
	)
}

export default CartLine
