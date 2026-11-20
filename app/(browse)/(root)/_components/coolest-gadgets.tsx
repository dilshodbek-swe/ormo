'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import AddToCartButton from '@/components/shared/add-to-cart-button'
import { gadgets } from '@/lib/data/gadgets'
import { cn, formatPrice } from '@/lib/utils'

/** Har bir gadjet sahnada necha soniya turadi */
const SLIDE_SECONDS = 6

const pad = (n: number) => String(n).padStart(2, '0')

// Marquee uchun takrorlanmaydigan kategoriyalar
const categories = [...new Set(gadgets.map(gadget => gadget.category))]

const CoolestGadgets = () => {
	const [active, setActive] = useState(0)
	const [paused, setPaused] = useState(false)

	const current = gadgets[active]
	const next = () => setActive(index => (index + 1) % gadgets.length)

	return (
		<section className='border-b'>
			<div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24'>
				<div className='mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
					<div className='max-w-xl space-y-3'>
						<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
							Eng zo&apos;r gadjetlar
						</p>
						<h2 className='font-space-grotesk text-3xl font-bold tracking-tight text-balance sm:text-4xl'>
							Ijodingizni kuchaytiradigan aksessuarlar
						</h2>
					</div>
					<Link
						href='/accessories'
						className='group flex items-center gap-1 text-sm font-medium'
					>
						Barcha aksessuarlar
						<ArrowRight className='size-4 transition-transform group-hover:translate-x-0.5' />
					</Link>
				</div>

				<div
					className='grid gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-5'
					onMouseEnter={() => setPaused(true)}
					onMouseLeave={() => setPaused(false)}
				>
					{/* Sahna: tanlangan gadjet */}
					<div className='flex flex-col gap-6 bg-background p-6 sm:p-8 lg:col-span-3'>
						<div className='flex items-center justify-between'>
							<span className='rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wider uppercase'>
								{current.category}
							</span>
							<span className='font-mono text-sm text-muted-foreground tabular-nums'>
								<span className='text-foreground'>{pad(active + 1)}</span> /{' '}
								{pad(gadgets.length)}
							</span>
						</div>

						<div className='relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl bg-white p-8'>
							<Image
								key={current.id}
								src={current.image}
								alt={current.name}
								width={1200}
								height={1200}
								sizes='(min-width: 1024px) 55vw, 100vw'
								className='animate-in fade-in zoom-in-95 h-full w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain duration-700'
							/>
						</div>

						<div
							key={current.id}
							className='animate-in fade-in slide-in-from-bottom-2 flex flex-wrap items-end justify-between gap-4 duration-500'
						>
							<div className='max-w-md space-y-2'>
								<h3 className='font-space-grotesk text-2xl font-bold tracking-tight sm:text-3xl'>
									{current.name}
								</h3>
								<p className='text-sm text-muted-foreground'>
									{current.description}
								</p>
								<p className='font-mono text-lg font-semibold tracking-tight'>
									{formatPrice(current.price)}
								</p>
							</div>
							<AddToCartButton productIds={current.id} size='lg' className='h-10 px-5' />
						</div>
					</div>

					{/* Ro'yxat: hover qilinganda sahna almashadi */}
					<ol className='flex flex-col bg-background lg:col-span-2'>
						{gadgets.map((gadget, index) => {
							const isActive = index === active

							return (
								<li
									key={gadget.id}
									className='relative flex-1 border-b last:border-b-0'
								>
									<button
										type='button'
										onMouseEnter={() => setActive(index)}
										onFocus={() => setActive(index)}
										onClick={() => setActive(index)}
										aria-current={isActive}
										className={cn(
											'grid size-full grid-cols-[auto_auto_1fr_auto] items-center gap-4 px-5 py-3 text-left transition-colors duration-300',
											isActive ? 'text-foreground' : 'text-muted-foreground'
										)}
									>
										<span className='font-mono text-xs tabular-nums'>
											{pad(index + 1)}
										</span>
										<span
											className={cn(
												'relative size-10 overflow-hidden rounded-md border bg-white transition-all duration-300',
												!isActive && 'opacity-50 grayscale'
											)}
										>
											<Image
												src={gadget.image}
												alt=''
												fill
												sizes='40px'
												className='object-cover'
											/>
										</span>
										<span className='min-w-0'>
											<span className='block truncate text-sm font-medium'>
												{gadget.name}
											</span>
											<span className='block text-xs text-muted-foreground'>
												{gadget.category}
											</span>
										</span>
										<span className='hidden font-mono text-xs sm:block'>
											{formatPrice(gadget.price)}
										</span>
									</button>

									{/* Faol qatordagi taymer chizig'i — tugaganda keyingisiga o'tadi */}
									{isActive && (
										<span
											key={active}
											aria-hidden
											onAnimationEnd={next}
											className='absolute bottom-0 left-0 h-0.5 bg-foreground motion-safe:animate-progress'
											style={{
												animationDuration: `${SLIDE_SECONDS}s`,
												animationPlayState: paused ? 'paused' : 'running',
											}}
										/>
									)}
								</li>
							)
						})}
					</ol>
				</div>

				{/* Pastdagi aylanib turuvchi kategoriyalar lentasi */}
				<div className='mt-8 overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]'>
					<div className='flex w-max motion-safe:animate-marquee'>
						{[0, 1].map(copy => (
							<div
								key={copy}
								aria-hidden={copy === 1}
								className='flex shrink-0 items-center'
							>
								{[...categories, ...categories, ...categories].map(
									(category, index) => (
										<span
											key={`${category}-${index}`}
											className='flex items-center gap-6 pr-6 font-space-grotesk text-2xl font-bold tracking-tight text-foreground/15 uppercase sm:text-3xl'
										>
											{category}
											<span className='text-base'>✦</span>
										</span>
									)
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default CoolestGadgets
