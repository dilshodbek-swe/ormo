import {
	ArrowRight,
	CreditCard,
	ShieldCheck,
	Truck,
	Video,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import FloatingCard from './floating-card'

const features = [
	{ icon: ShieldCheck, label: 'Rasmiy kafolat' },
	{ icon: Truck, label: 'Tez yetkazib berish' },
	{ icon: CreditCard, label: "Muddatli to'lov" },
]

const Spec = ({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof Video
	label: string
	value: string
}) => (
	<div className='flex items-center gap-2.5'>
		<div className='flex size-7 items-center justify-center rounded-md border bg-muted'>
			<Icon className='size-3.5' />
		</div>
		<div className='leading-tight'>
			<p className='text-[10px] text-muted-foreground'>{label}</p>
			<p className='font-mono text-xs font-medium'>{value}</p>
		</div>
	</div>
)

const Hero = () => {
	return (
		<section className='relative overflow-x-clip border-b'>
			<div className='relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-16'>
				<div className='flex flex-col items-start gap-6'>
					<span className='animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground duration-500'>
						<span className='relative flex size-1.5'>
							<span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75' />
							<span className='relative inline-flex size-1.5 rounded-full bg-emerald-500' />
						</span>
						Yangi kolleksiya — 2026
					</span>

					<h1 className='animate-in fade-in slide-in-from-bottom-3 fill-mode-both font-space-grotesk text-4xl font-bold tracking-tight text-balance delay-100 duration-700 sm:text-5xl lg:text-6xl'>
						Har bir kadr uchun{' '}
						<span className='bg-linear-to-r from-foreground to-foreground/50 bg-clip-text text-transparent'>
							professional texnika
						</span>
					</h1>

					<p className='animate-in fade-in slide-in-from-bottom-3 fill-mode-both max-w-md text-base text-muted-foreground delay-200 duration-700 sm:text-lg'>
						Kameralar, stabilizatorlar va dronlar — ijodingizni yangi
						balandlikka olib chiqadigan jihozlar bir joyda.
					</p>

					<div className='animate-in fade-in slide-in-from-bottom-3 fill-mode-both flex flex-wrap gap-3 delay-300 duration-700'>
						<Link
							href='/deals'
							className={cn(
								buttonVariants({ size: 'lg' }),
								'group h-10 px-5'
							)}
						>
							Xarid qilish
							<ArrowRight className='transition-transform group-hover:translate-x-0.5' />
						</Link>
						<Link
							href='/catalog'
							className={cn(
								buttonVariants({ variant: 'outline', size: 'lg' }),
								'h-10 px-5'
							)}
						>
							Katalogni ko&apos;rish
						</Link>
					</div>

					<ul className='animate-in fade-in fill-mode-both flex flex-wrap gap-x-6 gap-y-2 pt-2 delay-500 duration-700'>
						{features.map(({ icon: Icon, label }) => (
							<li
								key={label}
								className='flex items-center gap-2 text-sm text-muted-foreground'
							>
								<Icon className='size-4' />
								{label}
							</li>
						))}
					</ul>
				</div>

				<div className='relative px-4 py-8 sm:px-8'>
					{/* Rasm ortidagi yorug'lik */}
					<div
						aria-hidden
						className='absolute inset-10 -z-0 rounded-full bg-linear-to-tr from-sky-300/40 via-violet-300/30 to-transparent blur-3xl dark:from-sky-500/20 dark:via-violet-500/15'
					/>

					<div className='animate-in fade-in zoom-in-95 fill-mode-both relative overflow-hidden rounded-xl border bg-white shadow-sm duration-700'>
						<Image
							src='/images/hero.png'
							alt='Dron, pult va kamera linzalari'
							width={2400}
							height={1350}
							sizes='(min-width: 1024px) 50vw, 100vw'
							preload
							className='h-auto w-full'
						/>
					</div>

					<FloatingCard className='top-0 left-0' delay={0}>
						<Spec icon={Video} label='Video' value='5.1K · 50fps' />
					</FloatingCard>

					<FloatingCard className='right-0 bottom-0' delay={1.5}>
						<div className='flex items-center gap-3'>
							<div className='relative size-10 overflow-hidden rounded-md border bg-white'>
								<Image
									src='/images/products/drone-1.png'
									alt=''
									fill
									sizes='40px'
									className='object-cover'
								/>
							</div>
							<div className='leading-tight'>
								<p className='text-xs font-medium'>DJI Mavic Pro</p>
								<p className='font-mono text-[11px] text-muted-foreground'>
									12 450 000 so&apos;m
								</p>
							</div>
						</div>
					</FloatingCard>
				</div>
			</div>
		</section>
	)
}

export default Hero
