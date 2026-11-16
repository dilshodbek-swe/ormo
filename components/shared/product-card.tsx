import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/data/products'
import { cn, formatPrice, getDiscount } from '@/lib/utils'

interface ProductCardProps {
	product: Product
	className?: string
}

/**
 * Chegarasiz kartochka — `gap-px bg-border` grid ichida ishlatiladi,
 * shunda kartochkalar orasida 1px chiziq hosil bo'ladi.
 */
const ProductCard = ({ product, className }: ProductCardProps) => {
	const { id, brand, name, oldPrice, price, image } = product
	const discount = getDiscount(oldPrice, price)

	return (
		<article
			className={cn(
				'group relative flex flex-col bg-background p-4',
				className
			)}
		>
			<div className='relative aspect-4/3 overflow-hidden rounded-lg bg-white'>
				<div className='absolute inset-0 flex items-center justify-center p-4'>
					<Image
						src={image}
						alt={`${brand} ${name}`}
						width={1200}
						height={1200}
						sizes='(min-width: 1024px) 25vw, 50vw'
						className='h-full w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain transition-transform duration-500 ease-out group-hover:scale-105'
					/>
				</div>

				{discount > 0 && (
					<span className='absolute top-2 left-2 rounded-full bg-foreground px-2 py-0.5 font-mono text-[11px] font-medium text-background'>
						-{discount}%
					</span>
				)}

				<Button
					variant='outline'
					size='icon-sm'
					aria-label={`${name} — savatga qo'shish`}
					className='absolute right-2 bottom-2 z-10 rounded-full bg-background/90 backdrop-blur transition-all md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'
				>
					<Plus />
				</Button>
			</div>

			<div className='mt-4 flex flex-1 flex-col gap-2'>
				<div>
					<p className='font-mono text-[10px] tracking-wider text-muted-foreground uppercase'>
						{brand}
					</p>
					<h3 className='line-clamp-1 text-sm font-medium'>
						<Link
							href={`/products/${id}`}
							className='underline-offset-4 group-hover:underline after:absolute after:inset-0'
						>
							{name}
						</Link>
					</h3>
				</div>

				<div className='mt-auto flex flex-wrap items-baseline gap-x-2'>
					<p className='font-mono text-sm font-semibold tracking-tight'>
						{formatPrice(price)}
					</p>
					{discount > 0 && (
						<p className='font-mono text-[11px] text-muted-foreground line-through'>
							{formatPrice(oldPrice)}
						</p>
					)}
				</div>
			</div>
		</article>
	)
}

export default ProductCard
