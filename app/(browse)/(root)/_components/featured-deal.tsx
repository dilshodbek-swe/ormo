import { Flame, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import DiscountBadge from '@/components/shared/discount-badge'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/data/products'
import { cn, formatPrice, getDiscount } from '@/lib/utils'

const FeaturedDeal = ({
	product,
	className,
}: {
	product: Product
	className?: string
}) => {
	const { id, brand, name, oldPrice, price, image } = product
	const discount = getDiscount(oldPrice, price)

	return (
		<article
			className={cn(
				'group relative flex flex-col gap-6 overflow-hidden bg-background p-6 sm:p-8',
				className
			)}
		>
			<span className='flex w-fit items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs font-medium'>
				<Flame className='size-3.5 text-orange-500' />
				Kun taklifi
			</span>

			{/* Rasm va aylanuvchi chegirma muhri */}
			<div className='relative flex min-h-56 flex-1 items-center justify-center'>
				<div className='relative flex aspect-4/3 w-full max-w-md items-center justify-center rounded-2xl bg-white p-6'>
					<Image
						src={image}
						alt={`${brand} ${name}`}
						width={1200}
						height={1200}
						sizes='(min-width: 1024px) 40vw, 90vw'
						className='h-full w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2'
					/>
				</div>

				<DiscountBadge
					discount={discount}
					className='absolute -top-2 right-0 z-10 rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-0 sm:right-2'
				/>
			</div>

			{/* Ma'lumotlar */}
			<div className='flex flex-wrap items-end justify-between gap-4'>
				<div className='space-y-2'>
					<p className='font-mono text-xs tracking-wider text-muted-foreground uppercase'>
						{brand}
					</p>
					<h3 className='font-space-grotesk text-2xl font-bold tracking-tight sm:text-3xl'>
						<Link
							href={`/products/${id}`}
							className='after:absolute after:inset-0'
						>
							{name}
						</Link>
					</h3>
					<div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
						<p className='font-mono text-xl font-semibold tracking-tight'>
							{formatPrice(price)}
						</p>
						<p className='font-mono text-sm text-muted-foreground line-through'>
							{formatPrice(oldPrice)}
						</p>
					</div>
					<p className='inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400'>
						{formatPrice(oldPrice - price)} tejaysiz
					</p>
				</div>

				<Button size='lg' className='relative z-10 h-10 px-5'>
					<ShoppingBag />
					Savatga
				</Button>
			</div>
		</article>
	)
}

export default FeaturedDeal
