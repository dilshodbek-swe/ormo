'use client'

import { cn, formatPrice, formatRelative } from '@/lib/utils'
import { type AdminProduct, categoryLabel, getProductDiscount, MAX_IMAGES } from '../_lib/types'
import { ProductImg, type ProductActions, ProductMenu, StatusPill, StockMeter } from './product-bits'

const COLUMNS = 'md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_9rem_8rem_6rem_2rem]'

/** Zich jadval ko'rinishi — ko'p mahsulotni tez ko'zdan kechirish uchun */
const ProductList = ({ products, actions }: { products: AdminProduct[]; actions: ProductActions }) => (
	<div className='overflow-hidden rounded-xl border bg-background'>
		<div className={cn('hidden gap-4 border-b bg-muted/40 px-4 py-2.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase md:grid', COLUMNS)}>
			<span>Mahsulot</span>
			<span>Kategoriya</span>
			<span className='text-right'>Narx</span>
			<span>Qoldiq</span>
			<span>Holat</span>
			<span />
		</div>
		<ul className='divide-y'>
			{products.map(product => {
				const discount = getProductDiscount(product)
				const cover = product.images[0]
				return (
					<li
						key={product.id}
						role='button'
						tabIndex={0}
						onClick={() => actions.onEdit(product)}
						onKeyDown={event => {
							if (event.key === 'Enter' && event.target === event.currentTarget) actions.onEdit(product)
						}}
						className={cn(
							'grid cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50 md:grid',
							COLUMNS,
							product.status === 'archived' && 'text-muted-foreground'
						)}
					>
						<div className='flex min-w-0 items-center gap-3'>
							<span className='relative size-11 shrink-0 overflow-hidden rounded-lg border bg-muted/40'>
								{cover && <ProductImg url={cover.url} sizes='44px' className='p-1' />}
							</span>
							<div className='min-w-0'>
								<p className='truncate text-sm font-medium'>{product.name}</p>
								<p className='truncate font-mono text-[11px] text-muted-foreground'>
									{product.sku || '—'} · {product.images.length}/{MAX_IMAGES} rasm ·{' '}
									<span suppressHydrationWarning>{formatRelative(product.updatedAt)}</span>
								</p>
							</div>
						</div>
						<p className='hidden truncate text-sm md:block'>
							{product.brand}
							<span className='block text-xs text-muted-foreground'>{categoryLabel(product.category)}</span>
						</p>
						<p className='text-right font-mono text-sm tabular-nums'>
							{formatPrice(product.price)}
							{discount > 0 && <span className='block text-[11px] text-emerald-600 dark:text-emerald-400'>−{discount}%</span>}
						</p>
						<span>
							<StockMeter stock={product.stock} />
						</span>
						<span className='hidden md:block'>
							<StatusPill status={product.status} />
						</span>
						<ProductMenu product={product} actions={actions} className='justify-self-end' />
					</li>
				)
			})}
		</ul>
	</div>
)

export default ProductList
