'use client'

import { Check, Plus } from 'lucide-react'

import { cn, formatPrice } from '@/lib/utils'
import { discountedProducts, HERO_LIMIT, type HeroConfig } from '../_lib/deals'

interface DiscountMapProps {
	hero: HeroConfig
	scheduledIds: Set<string>
	onAddToHero: (id: string) => void
}

/**
 * Chegirma xaritasi: chegirmadagi barcha mahsulotlar, foiz bo'yicha — bitta o'lchov, bitta rang,
 * qiymat har doim yozilgan. Qo'lda rejimda shu yerdan heroga qo'shiladi.
 */
const DiscountMap = ({ hero, scheduledIds, onAddToHero }: DiscountMapProps) => {
	const items = discountedProducts()
	const max = Math.max(...items.map(item => item.discount), 1)
	const heroIds = new Set(hero.productIds)
	const full = hero.productIds.length >= HERO_LIMIT

	return (
		<section className='rounded-xl border bg-background'>
			<div className='border-b p-4'>
				<h2 className='font-medium'>Chegirma xaritasi</h2>
				<p className='text-xs text-muted-foreground'>{items.length} ta mahsulot chegirmada · eng kattasidan</p>
			</div>
			<ul className='divide-y'>
				{items.map(({ product, discount }) => {
					const inHero = hero.mode === 'manual' && heroIds.has(product.id)
					return (
						<li key={product.id} className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-4 py-2.5'>
							<div className='min-w-0'>
								<p className='flex items-center gap-2 text-sm'>
									<span className='truncate'>{product.name}</span>
									{scheduledIds.has(product.id) && (
										<span className='shrink-0 rounded border px-1 font-mono text-[9px] text-muted-foreground uppercase'>haftada</span>
									)}
								</p>
								<p className='font-mono text-[11px] text-muted-foreground'>
									{formatPrice(product.price)} <span className='line-through'>{formatPrice(product.oldPrice)}</span>
								</p>
							</div>
							{hero.mode === 'manual' ? (
								<button
									type='button'
									disabled={inHero || full}
									onClick={() => onAddToHero(product.id)}
									className={cn(
										'flex h-7 items-center gap-1 rounded-md border px-2 text-[11px] transition-colors',
										inHero ? 'border-transparent text-emerald-600 dark:text-emerald-400' : 'hover:bg-muted disabled:opacity-40'
									)}
								>
									{inHero ? <Check className='size-3' /> : <Plus className='size-3' />}
									{inHero ? 'Heroda' : 'Hero'}
								</button>
							) : (
								<span />
							)}
							<div className='col-span-2 flex items-center gap-2'>
								<div className='h-2 flex-1 overflow-hidden rounded-full bg-muted'>
									<div className='h-full rounded-full bg-orange-500 transition-[width] duration-700' style={{ width: `${(discount / max) * 100}%` }} />
								</div>
								<span className='w-9 text-right font-mono text-xs font-medium tabular-nums'>−{discount}%</span>
							</div>
						</li>
					)
				})}
			</ul>
		</section>
	)
}

export default DiscountMap
