import { Flame, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/data/products'
import { cn, formatPrice, getDiscount } from '@/lib/utils'

interface ProductCardProps {
	product: Product
	highlight?: boolean
}

const ProductCard = ({ product, highlight = false }: ProductCardProps) => {
	const { id, brand, name, oldPrice, price, image } = product
	const discount = getDiscount(oldPrice, price)

	return (
		<article
			className={cn(
				'group relative flex flex-col overflow-hidden rounded-xl border bg-background transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm',
				highlight && 'border-foreground/30'
			)}
		>
			<div className='relative aspect-square bg-white'>
				<div className='absolute inset-0 flex items-center justify-center p-6'>
					<Image
						src={image}
						alt={`${brand} ${name}`}
						width={1200}
						height={1200}
						sizes='(min-width: 1024px) 25vw, 50vw'
						className='h-full w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain transition-transform duration-500 ease-out group-hover:scale-105'
					/>
				</div>

				<div className='absolute top-3 left-3 flex items-center gap-1.5'>
					<span className='rounded-full bg-foreground px-2 py-0.5 font-mono text-[11px] font-medium text-background'>
						-{discount}%
					</span>
					{highlight && (
						<span className='flex items-center gap-1 rounded-full border bg-background/90 px-2 py-0.5 text-[11px] font-medium backdrop-blur'>
							<Flame className='size-3 text-orange-500' />
							Eng foydali
						</span>
					)}
				</div>

				<Button
					variant='outline'
					size='icon'
					aria-label={`${name} — savatga qo'shish`}
					className='absolute top-3 right-3 z-10 rounded-full bg-background/90 backdrop-blur transition-all md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'
				>
					<Plus />
				</Button>
			</div>

			<div className='flex flex-1 flex-col gap-3 border-t p-4'>
				<div className='space-y-0.5'>
					<p className='font-mono text-[11px] tracking-wider text-muted-foreground uppercase'>
						{brand}
					</p>
					<h3 className='line-clamp-1 text-sm font-medium'>
						<Link
							href={`/products/${id}`}
							className='after:absolute after:inset-0'
						>
							{name}
						</Link>
					</h3>
				</div>

				<div className='mt-auto space-y-1'>
					<p className='font-mono text-xs text-muted-foreground line-through'>
						{formatPrice(oldPrice)}
					</p>
					<p className='font-mono text-base font-semibold tracking-tight'>
						{formatPrice(price)}
					</p>
					<p className='text-xs text-emerald-600 dark:text-emerald-400'>
						{formatPrice(oldPrice - price)} tejaysiz
					</p>
				</div>
			</div>
		</article>
	)
}

export default ProductCard
