'use client'

import { ArrowUpRight, PackageSearch } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Fragment } from 'react'

import ProductCard from '@/components/shared/product-card'
import { catalogCategories, catalogProducts } from '@/lib/data/catalog'
import { cn, getDiscount } from '@/lib/utils'

const sorts = [
	{ id: 'popular', label: 'Tavsiya' },
	{ id: 'price-asc', label: 'Arzonroq' },
	{ id: 'price-desc', label: 'Qimmatroq' },
	{ id: 'discount', label: 'Chegirma' },
] as const

type SortId = (typeof sorts)[number]['id']

const sortProducts = (items: typeof catalogProducts, sort: SortId) => {
	const list = [...items]
	if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
	if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
	if (sort === 'discount')
		list.sort(
			(a, b) =>
				getDiscount(b.oldPrice, b.price) - getDiscount(a.oldPrice, a.price)
		)
	return list
}

/** Necha mahsulotdan keyin "yordam" plitkasi qo'yiladi */
const PROMO_AFTER = 5

const CatalogBrowser = () => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const categoryParam = searchParams.get('category')
	const category = catalogCategories.some(item => item.id === categoryParam)
		? categoryParam!
		: 'all'
	const sortParam = searchParams.get('sort') as SortId | null
	const sort: SortId = sorts.some(item => item.id === sortParam)
		? sortParam!
		: 'popular'

	// Filtrlar URL'da saqlanadi — havolani ulashsa, aynan shu ko'rinish ochiladi
	const update = (key: 'category' | 'sort', value: string, fallback: string) => {
		const params = new URLSearchParams(searchParams.toString())
		if (value === fallback) params.delete(key)
		else params.set(key, value)
		const query = params.toString()
		router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
	}

	const filtered = sortProducts(
		catalogProducts.filter(item => category === 'all' || item.category === category),
		sort
	)

	const countFor = (id: string) =>
		id === 'all'
			? catalogProducts.length
			: catalogProducts.filter(item => item.category === id).length

	return (
		<section className='space-y-6'>
			{/* Asboblar paneli */}
			<div className='sticky top-26 z-20 md:top-16 -mx-4 flex flex-col gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between'>
				<div className='-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0'>
					{catalogCategories.map(({ id, label }) => {
						const isActive = id === category

						return (
							<button
								key={id}
								type='button'
								onClick={() => update('category', id, 'all')}
								aria-pressed={isActive}
								className={cn(
									'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
									isActive
										? 'border-foreground bg-foreground text-background'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{label}
								<span
									className={cn(
										'font-mono text-[11px] tabular-nums',
										isActive ? 'opacity-70' : 'opacity-50'
									)}
								>
									{countFor(id)}
								</span>
							</button>
						)
					})}
				</div>

				<div className='flex items-center gap-3'>
					<span className='hidden font-mono text-xs text-muted-foreground sm:inline'>
						Saralash:
					</span>
					<div className='flex rounded-lg border p-0.5'>
						{sorts.map(({ id, label }) => (
							<button
								key={id}
								type='button'
								onClick={() => update('sort', id, 'popular')}
								aria-pressed={id === sort}
								className={cn(
									'rounded-md px-2.5 py-1 text-xs transition-colors',
									id === sort
										? 'bg-muted font-medium text-foreground'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{label}
							</button>
						))}
					</div>
				</div>
			</div>

			<p className='font-mono text-xs text-muted-foreground'>
				{filtered.length} ta mahsulot topildi
			</p>

			{filtered.length === 0 ? (
				<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center'>
					<PackageSearch className='size-8 text-muted-foreground' />
					<p className='font-medium'>Bu bo&apos;limda hozircha mahsulot yo&apos;q</p>
				</div>
			) : (
				<div
					key={`${category}-${sort}`}
					className='animate-in fade-in slide-in-from-bottom-2 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border duration-500 md:grid-cols-3 lg:grid-cols-4'
				>
					{filtered.map((product, index) => (
						<Fragment key={product.id}>
							<ProductCard product={product} />

							{/* Ritmni buzuvchi yordam plitkasi */}
							{index === PROMO_AFTER - 1 && filtered.length > PROMO_AFTER && (
								<Link
									href='/contact'
									className='group col-span-2 flex flex-col justify-between gap-8 bg-foreground p-6 text-background sm:p-8'
								>
									<p className='font-mono text-xs tracking-widest uppercase opacity-60'>
										Tanlashda yordam
									</p>
									<div className='flex items-end justify-between gap-6'>
										<p className='font-space-grotesk text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl'>
											Qaysi biri sizga mos ekanini bilmayapsizmi?
											<span className='text-background/50'>
												{' '}
												Mutaxassisimiz 5 daqiqada maslahat beradi.
											</span>
										</p>
										<span className='flex size-11 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:rotate-45'>
											<ArrowUpRight className='size-5' />
										</span>
									</div>
								</Link>
							)}
						</Fragment>
					))}
				</div>
			)}
		</section>
	)
}

export default CatalogBrowser
