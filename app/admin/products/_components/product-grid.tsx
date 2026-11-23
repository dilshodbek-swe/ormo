'use client'

import { Images } from 'lucide-react'
import { useState } from 'react'

import { cn, formatPrice } from '@/lib/utils'
import { type AdminProduct, categoryLabel, getProductDiscount, MAX_IMAGES } from '../_lib/types'
import { ProductImg, type ProductActions, ProductMenu, StatusPill, StockMeter } from './product-bits'

interface ProductGridProps {
	products: AdminProduct[]
	actions: ProductActions
}

/** Vercel "Projects" kartalari kabi to'r; kartada sichqonchani yurgizsangiz rasmlar almashadi */
const ProductGrid = ({ products, actions }: ProductGridProps) => (
	<ul className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
		{products.map((product, index) => (
			<li
				key={product.id}
				className='animate-in fade-in slide-in-from-bottom-1 fill-mode-backwards'
				style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
			>
				<ProductCard product={product} actions={actions} />
			</li>
		))}
	</ul>
)

const ProductCard = ({ product, actions }: { product: AdminProduct; actions: ProductActions }) => {
	const [active, setActive] = useState(0)
	const images = product.images
	const discount = getProductDiscount(product)
	const current = images[Math.min(active, images.length - 1)]

	return (
		<div
			role='button'
			tabIndex={0}
			onClick={() => actions.onEdit(product)}
			onKeyDown={event => {
				if (event.key === 'Enter' && event.target === event.currentTarget) actions.onEdit(product)
			}}
			className={cn(
				'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-background text-left transition-all outline-none hover:border-foreground/25 hover:shadow-[0_8px_30px_-12px_rgb(0_0_0/0.18)] focus-visible:ring-3 focus-visible:ring-ring/40',
				product.status === 'archived' && 'opacity-70 hover:opacity-100'
			)}
		>
			{/* Rasm maydoni: x bo'yicha "skrab" — har bir bo'lak bitta rasm */}
			<div
				className='relative aspect-[4/3] overflow-hidden border-b bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[14px_14px]'
				onMouseMove={event => {
					if (images.length < 2) return
					const rect = event.currentTarget.getBoundingClientRect()
					setActive(Math.min(images.length - 1, Math.floor(((event.clientX - rect.left) / rect.width) * images.length)))
				}}
				onMouseLeave={() => setActive(0)}
			>
				{current ? (
					<ProductImg
						key={current.id}
						url={current.url}
						sizes='(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw'
						className='animate-in fade-in p-8 duration-300 transition-transform group-hover:scale-[1.03]'
					/>
				) : (
					<div className='absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground'>
						<Images className='size-6' />
						<span className='font-mono text-[10px] tracking-widest uppercase'>Rasm yo&apos;q</span>
					</div>
				)}

				<StatusPill status={product.status} className='absolute top-3 left-3' />
				<span className='absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border bg-background/90 px-2 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur'>
					<Images className='size-3' />
					{images.length}/{MAX_IMAGES}
				</span>
				{discount > 0 && (
					<span className='absolute bottom-3 left-3 rounded-md bg-foreground px-1.5 py-0.5 font-mono text-[11px] font-semibold text-background'>
						−{discount}%
					</span>
				)}

				{/* Rasm indikatorlari */}
				{images.length > 1 && (
					<div className='absolute inset-x-3 bottom-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
						{images.map((image, index) => (
							<span key={image.id} className={cn('h-0.5 flex-1 rounded-full', index === active ? 'bg-foreground' : 'bg-foreground/15')} />
						))}
					</div>
				)}
			</div>

			<div className='flex flex-1 flex-col gap-3 p-4'>
				<div className='flex items-start gap-2'>
					<div className='min-w-0 flex-1'>
						<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>
							{product.brand} · {categoryLabel(product.category)}
						</p>
						<p className='mt-1 truncate font-medium'>{product.name}</p>
					</div>
					<ProductMenu product={product} actions={actions} className='-mt-1 -mr-1.5' />
				</div>

				<div className='mt-auto flex items-end justify-between gap-3'>
					<div>
						<p className='font-mono text-sm font-semibold tabular-nums'>{formatPrice(product.price)}</p>
						{discount > 0 && (
							<p className='font-mono text-xs text-muted-foreground tabular-nums line-through'>{formatPrice(product.oldPrice)}</p>
						)}
					</div>
					<StockMeter stock={product.stock} />
				</div>
			</div>
		</div>
	)
}

export default ProductGrid
