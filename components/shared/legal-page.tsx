import { ArrowRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import TableOfContents from './table-of-contents'

export interface LegalSection {
	id: string
	title: string
	content: ReactNode
}

interface LegalPageProps {
	title: string
	description: string
	lastUpdated: string
	readingTime: string
	highlights: { icon: LucideIcon; text: string }[]
	sections: LegalSection[]
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Huquqiy matnlardagi nuqtali ro'yxat */
export const LegalList = ({ items }: { items: ReactNode[] }) => (
	<ul className='space-y-2'>
		{items.map((item, index) => (
			<li key={index} className='flex gap-3'>
				<span className='mt-2.5 size-1 shrink-0 rounded-full bg-foreground/40' />
				<span>{item}</span>
			</li>
		))}
	</ul>
)

/** Ajratib ko'rsatilgan so'z */
export const LegalStrong = ({ children }: { children: ReactNode }) => (
	<strong className='font-medium text-foreground'>{children}</strong>
)

/**
 * Huquqiy sahifalar uchun umumiy shablon:
 * sarlavha, yopishqoq mundarija, "Qisqacha" bloki, raqamlangan bo'limlar va aloqa CTA.
 */
const LegalPage = ({
	title,
	description,
	lastUpdated,
	readingTime,
	highlights,
	sections,
}: LegalPageProps) => {
	return (
		<>
			{/* Sarlavha */}
			<section className='border-b'>
				<div className='mx-auto max-w-7xl space-y-6 px-4 py-16 sm:px-6 md:py-20'>
					<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
						Huquqiy hujjat
					</p>
					<h1 className='font-space-grotesk text-4xl font-bold tracking-tight sm:text-5xl'>
						{title}
					</h1>
					<p className='max-w-2xl text-muted-foreground sm:text-lg'>
						{description}
					</p>
					<div className='flex flex-wrap gap-2'>
						<span className='rounded-full border px-3 py-1 font-mono text-xs'>
							Yangilangan: {lastUpdated}
						</span>
						<span className='rounded-full border px-3 py-1 font-mono text-xs'>
							O&apos;qish vaqti: {readingTime}
						</span>
					</div>
				</div>
			</section>

			<div className='mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[240px_1fr] lg:gap-16'>
				{/* Mundarija — faqat katta ekranlarda, yopishqoq */}
				<aside className='hidden lg:block'>
					<div className='sticky top-28'>
						<TableOfContents
							items={sections.map(({ id, title }) => ({ id, title }))}
						/>
					</div>
				</aside>

				<div className='max-w-3xl space-y-12'>
					{/* Qisqacha */}
					<div className='rounded-xl border bg-muted/40 p-6'>
						<p className='mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase'>
							Qisqacha
						</p>
						<ul className='grid gap-4 sm:grid-cols-3'>
							{highlights.map(({ icon: Icon, text }) => (
								<li key={text} className='flex flex-col gap-2 text-sm'>
									<span className='flex size-8 items-center justify-center rounded-md border bg-background'>
										<Icon className='size-4' />
									</span>
									{text}
								</li>
							))}
						</ul>
					</div>

					{/* Bo'limlar */}
					{sections.map(({ id, title, content }, index) => (
						<section key={id} id={id} className='scroll-mt-28'>
							<div className='mb-4 flex items-baseline gap-3'>
								<span className='font-mono text-sm text-muted-foreground tabular-nums'>
									{pad(index + 1)}
								</span>
								<h2 className='font-space-grotesk text-xl font-bold tracking-tight sm:text-2xl'>
									{title}
								</h2>
							</div>
							<div className='space-y-4 leading-7 text-muted-foreground'>
								{content}
							</div>
						</section>
					))}

					{/* Aloqa CTA */}
					<div className='flex flex-col gap-4 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between'>
						<div>
							<p className='font-medium'>Savollaringiz qoldimi?</p>
							<p className='text-sm text-muted-foreground'>
								Jamoamiz bir ish kuni ichida javob beradi.
							</p>
						</div>
						<Link
							href='/contact'
							className={cn(buttonVariants({ size: 'lg' }), 'group h-10 px-5')}
						>
							Bog&apos;lanish
							<ArrowRight className='transition-transform group-hover:translate-x-0.5' />
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}

export default LegalPage
