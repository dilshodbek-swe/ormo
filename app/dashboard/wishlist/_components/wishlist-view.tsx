'use client'

import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import GridFrame from '@/components/shared/grid-frame'
import ProductCard from '@/components/shared/product-card'
import ProductGrid from '@/components/shared/product-grid'
import ProductGridSkeleton from '@/components/shared/product-grid-skeleton'
import { Button } from '@/components/ui/button'
import { catalogProducts } from '@/lib/data/catalog'
import { useStore } from '@/lib/store'
import useStoreHydrated from '@/lib/store/use-store-hydrated'
import { useWishlistItems, type WishlistItem } from '@/lib/store/wishlist/wishlist-selectors'
import { cn, formatPrice, getDiscount } from '@/lib/utils'
import PageHeader from '@/components/shared/page-header'

const sorts = [
	{ value: 'recent', label: 'Yangi qo‘shilgan' },
	{ value: 'cheap', label: 'Arzonroq' },
	{ value: 'discount', label: 'Chegirma' },
] as const
type Sort = (typeof sorts)[number]['value']

const compare: Record<Sort, (a: WishlistItem, b: WishlistItem) => number> = {
	recent: (a, b) => b.addedAt.localeCompare(a.addedAt),
	cheap: (a, b) => a.product.price - b.product.price,
	discount: (a, b) =>
		getDiscount(b.product.oldPrice, b.product.price) - getDiscount(a.product.oldPrice, a.product.price),
}

// Bo'sh holatda tavsiya — eng katta chegirmali mahsulotlar
const suggestions = [...catalogProducts]
	.sort((a, b) => getDiscount(b.oldPrice, b.price) - getDiscount(a.oldPrice, a.price))
	.slice(0, 4)

const Stat = ({ label, value }: { label: string; value: string }) => (
	<div className='p-4 sm:p-5'>
		<p className='font-mono text-[11px] tracking-widest text-muted-foreground uppercase'>{label}</p>
		<p className='mt-1.5 truncate font-space-grotesk text-xl font-bold tracking-tight tabular-nums sm:text-2xl'>
			{value}
		</p>
	</div>
)

const WishlistView = () => {
	const hydrated = useStoreHydrated()
	const items = useWishlistItems()
	const addToCart = useStore(state => state.addToCart)
	const clearWishlist = useStore(state => state.clearWishlist)
	const router = useRouter()
	const [sort, setSort] = useState<Sort>('recent')
	const [confirmClear, setConfirmClear] = useState(false)

	const sorted = [...items].sort(compare[sort])
	const total = items.reduce((sum, item) => sum + item.product.price, 0)
	const saved = items.reduce((sum, item) => sum + item.product.oldPrice - item.product.price, 0)

	const moveAllToCart = () => {
		items.forEach(item => addToCart(item.id))
		router.push('/cart')
	}

	return (
		<>
			<PageHeader
				eyebrow={`Dashboard · Sevimlilar${hydrated ? ` · ${items.length} ta` : ''}`}
				title={
					hydrated && items.length > 0 ? (
						<>
							{items.length} ta mahsulot. <span className='text-muted-foreground'>Sizni kutmoqda.</span>
						</>
					) : (
						<>
							Sevimlilar. <span className='text-muted-foreground'>Yoqqanini saqlab qo&apos;ying.</span>
						</>
					)
				}
				description='Mahsulot kartasidagi yurakchani bosing — u shu yerda paydo bo‘ladi. Ro‘yxat shu qurilmada saqlanadi.'
			/>

			{!hydrated ? (
				<ProductGridSkeleton count={4} gridClassName='md:grid-cols-3 xl:grid-cols-4' />
			) : items.length === 0 ? (
				<div className='space-y-8'>
					<GridFrame className='flex flex-col items-center gap-5 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[18px_18px] px-6 py-14 text-center'>
						<span className='relative flex size-14 items-center justify-center rounded-full border bg-background'>
							<Heart className='size-6 animate-pulse text-rose-500' />
						</span>
						<div className='space-y-1.5'>
							<p className='font-space-grotesk text-2xl font-bold tracking-tight'>Ro&apos;yxat bo&apos;sh</p>
							<p className='max-w-sm text-sm text-muted-foreground'>
								Hozircha hech narsa saqlanmagan. Pastdagi takliflardan boshlab ko&apos;ring.
							</p>
						</div>
						<Button nativeButton={false} render={<Link href='/shop' />}>
							Do&apos;konga o&apos;tish
						</Button>
					</GridFrame>

					<section className='space-y-3'>
						<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
							Eng katta chegirmalar
						</h2>
						<ProductGrid gridClassName='md:grid-cols-4'>
							{suggestions.map(product => (
								<ProductCard key={product.id} product={product} />
							))}
						</ProductGrid>
					</section>
				</div>
			) : (
				<div className='space-y-6'>
					<GridFrame className='grid grid-cols-3 divide-x bg-background'>
						<Stat label='Mahsulotlar' value={String(items.length)} />
						<Stat label='Umumiy narx' value={formatPrice(total)} />
						<Stat label='Tejaysiz' value={formatPrice(saved)} />
					</GridFrame>

					<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
						<div role='radiogroup' aria-label='Saralash' className='flex overflow-x-auto border p-1'>
							{sorts.map(item => (
								<button
									key={item.value}
									type='button'
									role='radio'
									aria-checked={sort === item.value}
									onClick={() => setSort(item.value)}
									className={cn(
										'shrink-0 px-3 py-1.5 text-sm transition-colors',
										sort === item.value
											? 'bg-foreground text-background'
											: 'text-muted-foreground hover:text-foreground'
									)}
								>
									{item.label}
								</button>
							))}
						</div>

						<div className='flex gap-2'>
							{confirmClear ? (
								<>
									<Button variant='ghost' onClick={() => setConfirmClear(false)}>
										Bekor
									</Button>
									<Button
										variant='destructive'
										onClick={() => {
											clearWishlist()
											setConfirmClear(false)
										}}
									>
										Ha, tozalash
									</Button>
								</>
							) : (
								<>
									<Button variant='outline' onClick={() => setConfirmClear(true)}>
										<Trash2 />
										Tozalash
									</Button>
									<Button onClick={moveAllToCart}>
										<ShoppingBag />
										Hammasini savatga
									</Button>
								</>
							)}
						</div>
					</div>

					<ProductGrid gridClassName='md:grid-cols-3 xl:grid-cols-4'>
						{sorted.map(item => (
							<ProductCard key={item.id} product={item.product} />
						))}
					</ProductGrid>
				</div>
			)}
		</>
	)
}

export default WishlistView
