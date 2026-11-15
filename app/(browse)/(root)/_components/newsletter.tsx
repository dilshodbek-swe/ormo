'use client'

import { ArrowRight, Check, Mail } from 'lucide-react'
import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Aperture from './aperture'

const perks = ['Haftasiga 1 ta xat', 'Yopiq chegirmalar', 'Istalgan payt bekor qilish']

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Newsletter = () => {
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [subscribed, setSubscribed] = useState(false)

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!EMAIL_PATTERN.test(email.trim())) {
			setError("To'g'ri email manzil kiriting")
			return
		}

		// TODO: API ulanganda obunani serverga yuborish
		setError('')
		setSubscribed(true)
	}

	return (
		<section className='border-b'>
			<div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24'>
				<div className='relative isolate overflow-hidden rounded-2xl bg-foreground px-6 py-14 text-background sm:px-12 md:py-20'>
					{/* Aylanib turuvchi diafragma */}
					<Aperture className='absolute top-1/2 -right-24 -z-10 size-[28rem] -translate-y-1/2 text-background/15 motion-safe:animate-[spin_60s_linear_infinite] sm:-right-16 md:size-[36rem]' />
					<div
						aria-hidden
						className='absolute top-1/2 right-0 -z-10 size-72 -translate-y-1/2 rounded-full bg-linear-to-tr from-sky-400/25 via-violet-400/20 to-transparent blur-3xl'
					/>

					<div className='max-w-xl space-y-6'>
						<p className='flex items-center gap-2 font-mono text-xs tracking-widest uppercase opacity-60'>
							<Mail className='size-3.5' />
							Newsletter
						</p>

						<h2 className='font-space-grotesk text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl'>
							Yangi kelganlar va yopiq chegirmalar —{' '}
							<span className='text-background/50'>birinchi bo&apos;lib sizga.</span>
						</h2>

						<p className='max-w-md text-sm text-background/60 sm:text-base'>
							Spamsiz. Faqat yangi texnika, foydali maslahatlar va obunachilar
							uchun maxsus narxlar.
						</p>

						{subscribed ? (
							<div className='animate-in fade-in zoom-in-95 flex items-center gap-3 rounded-xl border border-background/15 bg-background/5 p-4 duration-500'>
								<span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white'>
									<Check className='size-4' />
								</span>
								<div>
									<p className='text-sm font-medium'>Obuna bo&apos;ldingiz!</p>
									<p className='text-xs text-background/60'>
										Birinchi xat <span className='font-mono'>{email}</span>{' '}
										manziliga yuboriladi.
									</p>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubmit} noValidate className='space-y-2'>
								<div
									className={cn(
										'flex flex-col gap-2 rounded-xl border border-background/15 bg-background/5 p-1.5 transition-colors focus-within:border-background/40 sm:flex-row',
										error && 'border-rose-400/60 focus-within:border-rose-400'
									)}
								>
									<Input
										type='email'
										value={email}
										onChange={event => {
											setEmail(event.target.value)
											if (error) setError('')
										}}
										placeholder='email@manzil.uz'
										aria-label='Email manzil'
										aria-invalid={Boolean(error)}
										className='h-11 border-0 bg-transparent px-3 font-mono text-background shadow-none placeholder:text-background/40 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent'
									/>
									<Button
										type='submit'
										size='lg'
										className='group h-11 shrink-0 bg-background px-5 text-foreground hover:bg-background/90'
									>
										Obuna bo&apos;lish
										<ArrowRight className='transition-transform group-hover:translate-x-0.5' />
									</Button>
								</div>
								<p
									role='alert'
									className={cn(
										'h-4 pl-1 text-xs text-rose-300 transition-opacity',
										error ? 'opacity-100' : 'opacity-0'
									)}
								>
									{error}
								</p>
							</form>
						)}

						<ul className='flex flex-wrap gap-x-5 gap-y-2'>
							{perks.map(perk => (
								<li
									key={perk}
									className='flex items-center gap-1.5 text-xs text-background/60'
								>
									<Check className='size-3.5 text-emerald-400' />
									{perk}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Newsletter
