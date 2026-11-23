import { Hammer } from 'lucide-react'

import PageHeader from '@/components/shared/page-header'
import { getAdminGroup, getAdminLink } from '../_lib/nav'

/**
 * Hali qurilmagan bo'lim uchun vaqtinchalik sahifa: sarlavha nav.ts dan olinadi,
 * pastda — bo'limda nima bo'lishi rejasi. Har bir bo'lim qurilganda shu komponent o'rniga haqiqiy UI keladi.
 */
const SectionPlaceholder = ({ href }: { href: string }) => {
	const link = getAdminLink(href)
	const group = getAdminGroup(href)
	const Icon = link.icon

	return (
		<>
			<PageHeader eyebrow={`Admin · ${group?.label ?? ''}`} title={link.label} description={link.description} />

			<div className='relative overflow-hidden rounded-xl border border-dashed bg-background'>
				{/* Qurilish lentasi — diagonal chiziqlar */}
				<div
					aria-hidden
					className='h-2 bg-[repeating-linear-gradient(-45deg,var(--color-foreground)_0_8px,transparent_8px_16px)] opacity-[0.08]'
				/>

				<div className='grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:items-start'>
					<div className='relative flex size-20 items-center justify-center'>
						<span className='absolute inset-0 rounded-2xl border bg-muted/40' />
						<span className='absolute inset-2 rotate-6 rounded-xl border border-dashed' />
						<Icon className='relative size-7' />
					</div>

					<div className='space-y-5'>
						<div className='space-y-1.5'>
							<p className='inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>
								<Hammer className='size-3' />
								Qurilmoqda
							</p>
							<h2 className='font-space-grotesk text-xl font-semibold tracking-tight'>
								Bu bo&apos;lim keyingi bosqichda tayyor bo&apos;ladi
							</h2>
						</div>

						{link.planned.length > 0 && (
							<ol className='space-y-2.5'>
								{link.planned.map((item, index) => (
									<li key={item} className='flex items-center gap-3 text-sm'>
										<span className='flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] text-muted-foreground'>
											{String(index + 1).padStart(2, '0')}
										</span>
										{item}
									</li>
								))}
							</ol>
						)}

						<p className='font-mono text-xs text-muted-foreground'>
							Bu yerga istalgan joydan:{' '}
							<kbd className='rounded border bg-muted px-1'>G</kbd>{' '}
							<kbd className='rounded border bg-muted px-1'>{link.shortcut}</kbd>
						</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default SectionPlaceholder
