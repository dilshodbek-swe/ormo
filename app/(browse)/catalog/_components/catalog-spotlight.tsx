'use client'

import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel'
import { catalogProducts } from '@/lib/data/catalog'
import { cn, formatPrice } from '@/lib/utils'

/** Muharrir tanlovi: qaysi mahsulot, qanday shior va qaysi xususiyatlar */
const picks = [
	{
		id: 'dji-mavic-air-2',
		tagline: 'Osmondan 4K/60fps',
		specs: ['34 daq parvoz', '10 km masofa', '48 MP'],
	},
	{
		id: 'sony-a6400',
		tagline: 'Fokus — ko\'z ochib yumguncha',
		specs: ['0.02s autofokus', '4K video', '24.2 MP'],
	},
	{
		id: 'sigma-85mm-art',
		tagline: 'Portretlar qiroli',
		specs: ['f/1.4 diafragma', '11 parrakli bokeh', 'Sony E'],
	},
	{
		id: 'dji-osmo-pocket',
		tagline: 'Cho\'ntakdagi kino studiya',
		specs: ['3 o\'qli gimbal', '4K/60fps', '116 g'],
	},
].flatMap(pick => {
	const product = catalogProducts.find(item => item.id === pick.id)
	return product ? [{ ...pick, product }] : []
})

const AUTOPLAY_MS = 6000

const pad = (n: number) => String(n).padStart(2, '0')

const CatalogSpotlight = () => {
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [paused, setPaused] = useState(false)

	const onSelect = useCallback((carousel: CarouselApi) => {
		if (carousel) setCurrent(carousel.selectedScrollSnap())
	}, [])

	useEffect(() => {
		if (!api) return
		// Boshlang'ich slayd 0 — faqat keyingi o'zgarishlarga obuna bo'lamiz
		api.on('select', onSelect)
		return () => {
			api.off('select', onSelect)
		}
	}, [api, onSelect])

	/*
	 * Avtomatik aylanish CSS animatsiyasi orqali boshqariladi:
	 * faol indikator to'lib bo'lgach (onAnimationEnd) keyingi slaydga o'tamiz.
	 * Sichqoncha ustida bo'lsa animatsiya pauza qilinadi — loader ham, vaqt ham to'xtaydi.
	 */
	const timer = {
		animationDuration: `${AUTOPLAY_MS}ms`,
		animationPlayState: paused ? 'paused' : 'running',
	} as const

	const next = picks[(current + 1) % picks.length]

	return (
		<section
			className='space-y-5'
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<div className='flex items-end justify-between gap-4'>
				<div className='space-y-1'>
					<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
						Muharrir tanlovi
					</p>
					<p className='font-mono text-sm tabular-nums'>
						{pad(current + 1)}{' '}
						<span className='text-muted-foreground'>/ {pad(picks.length)}</span>
					</p>
				</div>

				{/* Keyingi slayd haqida ogohlantirish */}
				<p
					key={next.id}
					className='animate-in fade-in slide-in-from-right-2 hidden min-w-0 flex-1 truncate text-right text-xs text-muted-foreground duration-500 sm:block'
				>
					{paused ? 'Pauza' : 'Keyingisi'} →{' '}
					<span className='text-foreground'>{next.product.name}</span>
				</p>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='icon'
						className='rounded-full'
						onClick={() => api?.scrollPrev()}
						aria-label='Oldingi'
					>
						<ArrowLeft />
					</Button>
					{/* "Keyingi" tugmasi atrofida aylana taymer */}
					<div className='relative'>
						<svg
							viewBox='0 0 40 40'
							aria-hidden
							className='pointer-events-none absolute -inset-1 size-[calc(100%+0.5rem)] -rotate-90'
						>
							<circle
								cx='20'
								cy='20'
								r='18'
								fill='none'
								strokeWidth='1.5'
								className='stroke-border'
							/>
							<circle
								key={current}
								cx='20'
								cy='20'
								r='18'
								fill='none'
								strokeWidth='1.5'
								strokeLinecap='round'
								pathLength={100}
								strokeDasharray='100'
								strokeDashoffset='100'
								className='stroke-foreground motion-safe:animate-ring'
								style={timer}
							/>
						</svg>
						<Button
							variant='outline'
							size='icon'
							className='rounded-full'
							onClick={() => api?.scrollNext()}
							aria-label='Keyingi'
						>
							<ArrowRight />
						</Button>
					</div>
				</div>
			</div>

			<Carousel setApi={setApi} opts={{ loop: true, align: 'start' }}>
				<CarouselContent>
					{picks.map(({ id, tagline, specs, product }, index) => {
						const isActive = index === current

						return (
							<CarouselItem key={id} className='md:basis-[86%]'>
								<article
									className={cn(
										'grid overflow-hidden rounded-2xl border transition-all duration-500 md:grid-cols-2',
										isActive ? 'opacity-100' : 'opacity-40 md:scale-[0.97]'
									)}
								>
									{/* Matn tomoni */}
									<div className='relative flex flex-col justify-between gap-10 bg-foreground p-6 text-background sm:p-10'>
										<span
											aria-hidden
											className='pointer-events-none absolute -right-4 -bottom-10 font-space-grotesk text-[10rem] leading-none font-bold text-background/5 select-none'
										>
											{pad(index + 1)}
										</span>

										<div className='space-y-4'>
											<p className='font-mono text-xs tracking-widest uppercase opacity-60'>
												{product.brand}
											</p>
											<h3 className='font-space-grotesk text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl'>
												{tagline}
											</h3>
											<p className='text-background/70'>{product.name}</p>
										</div>

										<div className='relative space-y-6'>
											<ul className='flex flex-wrap gap-2'>
												{specs.map(spec => (
													<li
														key={spec}
														className='rounded-full border border-background/20 px-3 py-1 font-mono text-xs'
													>
														{spec}
													</li>
												))}
											</ul>
											<div className='flex flex-wrap items-center justify-between gap-4'>
												<p className='font-mono text-xl font-semibold tracking-tight'>
													{formatPrice(product.price)}
												</p>
												<Button
													size='lg'
													className='h-10 bg-background px-5 text-foreground hover:bg-background/90'
												>
													<ShoppingBag />
													Savatga
												</Button>
											</div>
										</div>
									</div>

									{/* Rasm tomoni */}
									<div className='relative flex min-h-64 items-center justify-center bg-white p-8 sm:min-h-96'>
										<Image
											src={product.image}
											alt={`${product.brand} ${product.name}`}
											width={1200}
											height={1200}
											sizes='(min-width: 768px) 45vw, 100vw'
											className={cn(
												'h-full max-h-80 w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain transition-transform duration-700',
												isActive && 'scale-105'
											)}
										/>
									</div>
								</article>
							</CarouselItem>
						)
					})}
				</CarouselContent>
			</Carousel>

			{/* Story uslubidagi indikator: faol segment vaqt o'tishi bilan to'ladi */}
			<div className='flex items-center justify-between gap-4'>
				<div className='flex gap-1.5'>
					{picks.map(({ id, product }, index) => {
						const isActive = index === current

						return (
							<button
								key={id}
								type='button'
								onClick={() => api?.scrollTo(index)}
								aria-label={`${product.name} — ${index + 1}-slayd`}
								aria-current={isActive}
								className={cn(
									'relative h-1 overflow-hidden rounded-full bg-border transition-all duration-500 hover:bg-muted-foreground/40',
									isActive ? 'w-16' : 'w-6'
								)}
							>
								{/* O'tib ketgan slaydlar to'liq, faoli esa jonli to'ladi */}
								{index < current && (
									<span className='absolute inset-0 rounded-full bg-foreground/30' />
								)}
								{isActive && (
									<span
										key={current}
										onAnimationEnd={() => api?.scrollNext()}
										className='absolute inset-y-0 left-0 w-full rounded-full bg-foreground motion-safe:w-0 motion-safe:animate-progress'
										style={timer}
									/>
								)}
							</button>
						)
					})}
				</div>

				<span className='flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground'>
					<span
						className={cn(
							'size-1.5 rounded-full',
							paused ? 'bg-amber-500' : 'bg-emerald-500 motion-safe:animate-pulse'
						)}
					/>
					{paused ? 'Pauza' : `Avto · ${AUTOPLAY_MS / 1000}s`}
				</span>
			</div>
		</section>
	)
}

export default CatalogSpotlight
