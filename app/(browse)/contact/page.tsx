import { MapPin, Navigation } from 'lucide-react'
import type { Metadata } from 'next'

import ContactChannels from './_components/contact-channels'
import ContactForm from './_components/contact-form'
import { contactInfo } from './_components/contact-info'
import { HoursTable, OpenStatus } from './_components/opening-hours'
import ShowroomMap from './_components/showroom-map'

export const metadata: Metadata = {
	title: 'Aloqa — Ormo',
	description:
		"Ormo jamoasi bilan bog'laning: telefon, Telegram, email yoki showroom'ga tashrif.",
}

const ContactPage = () => {
	return (
		<>
			{/* Sarlavha */}
			<section className='border-b'>
				<div className='mx-auto max-w-7xl space-y-6 px-4 py-16 sm:px-6 md:py-20'>
					<OpenStatus />
					<h1 className='font-space-grotesk text-5xl leading-none font-bold tracking-tighter sm:text-7xl'>
						Keling,{' '}
						<span className='bg-linear-to-r from-foreground to-foreground/40 bg-clip-text text-transparent'>
							gaplashamiz.
						</span>
					</h1>
					<p className='max-w-xl text-muted-foreground sm:text-lg'>
						Kamera tanlashda ikkilanyapsizmi yoki buyurtma bo&apos;yicha savol
						bormi? Jamoamiz texnikani biladi va yordam berishga doim tayyor.
					</p>
				</div>
			</section>

			<div className='mx-auto max-w-7xl space-y-4 px-4 py-12 sm:px-6 md:py-16'>
				{/* Forma + aloqa kanallari */}
				<div className='grid gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-5'>
					<div className='bg-background p-6 sm:p-8 lg:col-span-3'>
						<p className='mb-6 font-mono text-xs tracking-widest text-muted-foreground uppercase'>
							Xabar qoldiring
						</p>
						<ContactForm />
					</div>

					<div className='flex flex-col bg-background lg:col-span-2'>
						<p className='border-b p-5 font-mono text-xs tracking-widest text-muted-foreground uppercase'>
							Yoki to&apos;g&apos;ridan-to&apos;g&apos;ri
						</p>
						<ContactChannels />
						<div className='mt-auto border-t p-5'>
							<p className='mb-3 text-sm font-medium'>Ish vaqti</p>
							<HoursTable />
						</div>
					</div>
				</div>

				{/* Showroom */}
				<div className='grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-5'>
					<div className='flex flex-col justify-between gap-8 bg-background p-6 sm:p-8 md:col-span-2'>
						<div className='space-y-3'>
							<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
								Showroom
							</p>
							<h2 className='font-space-grotesk text-2xl font-bold tracking-tight sm:text-3xl'>
								Texnikani qo&apos;lda ushlab ko&apos;ring
							</h2>
							<p className='text-sm text-muted-foreground'>
								Kameralar, dronlar va stabilizatorlarni sotib olishdan oldin
								sinab ko&apos;rishingiz mumkin.
							</p>
						</div>

						<div className='space-y-3 text-sm'>
							<p className='flex gap-2'>
								<MapPin className='mt-0.5 size-4 shrink-0' />
								<span>
									{contactInfo.address}
									<span className='block text-muted-foreground'>
										{contactInfo.landmark}
									</span>
								</span>
							</p>
							<a
								href={`https://yandex.uz/maps/?text=${encodeURIComponent(contactInfo.address)}`}
								target='_blank'
								rel='noreferrer'
								className='inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline'
							>
								<Navigation className='size-4' />
								Yo&apos;nalish olish
							</a>
						</div>
					</div>

					<div className='md:col-span-3'>
						<ShowroomMap />
					</div>
				</div>
			</div>
		</>
	)
}

export default ContactPage
