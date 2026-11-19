import { Check, Plus } from 'lucide-react'
import Image from 'next/image'

import type { Product } from '@/lib/data/products'
import { cn, formatPrice } from '@/lib/utils'

type Props = {
	product: Product
	selected: boolean
	onToggle: () => void
}

/** To'plamdagi mahsulot — bosib chiqarish yoki qaytarish mumkin */
const BundleItem = ({ product, selected, onToggle }: Props) => {
	return (
		<button
			type='button'
			onClick={onToggle}
			aria-pressed={selected}
			aria-label={`${product.name} — ${selected ? 'to\'plamdan chiqarish' : 'to\'plamga qaytarish'}`}
			className={cn(
				'group relative flex min-w-0 flex-1 items-center gap-4 rounded-2xl border bg-background p-3 text-left transition-all duration-300 lg:flex-col lg:items-stretch lg:p-4',
				selected
					? 'hover:-translate-y-1 hover:shadow-lg'
					: 'border-dashed opacity-60 hover:opacity-100'
			)}
		>
			{/* Belgi: tanlangan — qora "✓", chiqarilgan — bo'sh "+" */}
			<span
				className={cn(
					'absolute top-3 right-3 z-10 flex size-7 items-center justify-center rounded-full border transition-colors',
					selected ? 'border-foreground bg-foreground text-background' : 'bg-background'
				)}
			>
				{selected ? <Check className='size-3.5' /> : <Plus className='size-3.5' />}
			</span>

			{/* Mobilda — chapda kichik rasm, lg'da — tepada katta */}
			<div className='relative aspect-4/3 w-24 shrink-0 overflow-hidden rounded-xl bg-white lg:w-auto'>
				<div className='absolute inset-0 flex items-center justify-center p-2 lg:p-4'>
					<Image
						src={product.image}
						alt=''
						width={600}
						height={600}
						sizes='(min-width: 1024px) 18vw, 80vw'
						className={cn(
							'h-full w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain transition-all duration-500 group-hover:scale-105',
							!selected && 'grayscale'
						)}
					/>
				</div>
			</div>

			<div className='min-w-0 space-y-1 pr-8 lg:pr-0'>
				<p className='font-mono text-[11px] tracking-widest text-muted-foreground uppercase'>
					{product.brand}
				</p>
				<p className='line-clamp-2 font-medium'>{product.name}</p>
				<p className={cn('font-mono text-sm', !selected && 'line-through')}>
					{formatPrice(product.price)}
				</p>
			</div>
		</button>
	)
}

export default BundleItem
