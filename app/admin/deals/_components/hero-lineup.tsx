'use client'

import { ArrowDown, ArrowUp, Sparkles, X } from 'lucide-react'
import type { ReactNode } from 'react'
import Image from 'next/image'

import { cn, formatPrice } from '@/lib/utils'
import { autoHeroIds, discountOf, getProduct, HERO_LIMIT, type HeroConfig } from '../_lib/deals'

interface HeroLineupProps {
	hero: HeroConfig
	onChange: (hero: HeroConfig) => void
}

/**
 * /deals tepasidagi karusel: "Avtomatik" — har doim eng katta chegirmali 5 tasi;
 * "Qo'lda" — admin tanlagan tartibda (chegirma xaritasidan qo'shiladi).
 */
const HeroLineup = ({ hero, onChange }: HeroLineupProps) => {
	const ids = hero.mode === 'auto' ? autoHeroIds() : hero.productIds
	const manual = hero.mode === 'manual'

	const move = (from: number, to: number) => {
		const next = [...hero.productIds]
		const [item] = next.splice(from, 1)
		next.splice(to, 0, item)
		onChange({ ...hero, productIds: next })
	}

	return (
		<section className='rounded-xl border bg-background'>
			<div className='flex items-center justify-between gap-3 border-b p-4'>
				<div>
					<h2 className='font-medium'>Hero karuseli</h2>
					<p className='text-xs text-muted-foreground'>
						{ids.length}/{HERO_LIMIT} slayd · har 5 soniyada almashadi
					</p>
				</div>
				<div className='flex h-8 rounded-md border p-0.5 text-xs' role='radiogroup' aria-label='Karusel rejimi'>
					{(
						[
							['auto', 'Avtomatik'],
							['manual', "Qo'lda"],
						] as const
					).map(([mode, label]) => (
						<button
							key={mode}
							type='button'
							role='radio'
							aria-checked={hero.mode === mode}
							onClick={() =>
								onChange(mode === 'manual' && hero.mode === 'auto' ? { mode, productIds: autoHeroIds() } : { ...hero, mode })
							}
							className={cn(
								'rounded-[5px] px-2.5 transition-colors',
								hero.mode === mode ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* Slaydlar indikatori — karuseldagi nuqtalar kabi */}
			<div className='flex gap-1 px-4 pt-3' aria-hidden>
				{Array.from({ length: HERO_LIMIT }, (_, index) => (
					<span key={index} className={cn('h-1 flex-1 rounded-full', index < ids.length ? (index === 0 ? 'bg-foreground' : 'bg-foreground/40') : 'bg-border')} />
				))}
			</div>

			<ol className='space-y-1 p-2'>
				{ids.map((id, index) => {
					const product = getProduct(id)
					if (!product) return null
					return (
						<li key={id} className='group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/40'>
							<span className='w-4 shrink-0 text-center font-mono text-[10px] text-muted-foreground'>{index + 1}</span>
							<span className='relative size-11 shrink-0 overflow-hidden rounded-md border bg-white'>
								<Image src={product.image} alt='' fill sizes='44px' className='object-contain p-1 mix-blend-multiply' />
							</span>
							<span className='min-w-0 flex-1'>
								<span className='block truncate text-sm font-medium'>{product.name}</span>
								<span className='block font-mono text-[11px] text-muted-foreground'>
									{formatPrice(product.price)} · −{discountOf(product, product.price)}%
								</span>
							</span>
							{manual && (
								<span className='flex opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100'>
									<IconButton label='Yuqoriga' disabled={index === 0} onClick={() => move(index, index - 1)}>
										<ArrowUp />
									</IconButton>
									<IconButton label='Pastga' disabled={index === ids.length - 1} onClick={() => move(index, index + 1)}>
										<ArrowDown />
									</IconButton>
									<IconButton label='Olib tashlash' onClick={() => onChange({ ...hero, productIds: hero.productIds.filter(item => item !== id) })}>
										<X />
									</IconButton>
								</span>
							)}
						</li>
					)
				})}
				{ids.length === 0 && (
					<li className='px-3 py-6 text-center text-xs text-muted-foreground'>Karusel bo&apos;sh — pastdagi xaritadan mahsulot qo&apos;shing</li>
				)}
			</ol>

			<p className='flex items-center gap-1.5 border-t px-4 py-2.5 text-[11px] text-muted-foreground'>
				<Sparkles className='size-3 shrink-0' />
				{manual ? "Tartibni o'zgartiring yoki chegirma xaritasidan qo'shing" : 'Chegirmalar o‘zgarsa, ro‘yxat o‘zi yangilanadi'}
			</p>
		</section>
	)
}

const IconButton = ({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: ReactNode }) => (
	<button
		type='button'
		aria-label={label}
		title={label}
		disabled={disabled}
		onClick={onClick}
		className='flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 [&_svg]:size-3.5'
	>
		{children}
	</button>
)

export default HeroLineup
