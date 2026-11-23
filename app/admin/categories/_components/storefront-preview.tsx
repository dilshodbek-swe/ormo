import { ArrowUpRight, Lock } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { AdminCategory } from '../_lib/types'
import { CategoryImg } from './category-bits'

/**
 * Bosh sahifadagi "Kategoriyalar" bo'limining jonli kichik nusxasi: tartib va ko'rinishni
 * o'zgartirsangiz, shu zahoti shu yerda aks etadi. Birinchi ko'rinadigan — katta karta.
 */
const StorefrontPreview = ({ categories }: { categories: AdminCategory[] }) => {
	const visible = categories.filter(category => category.visible)
	const hidden = categories.length - visible.length

	return (
		<div className='overflow-hidden rounded-xl border bg-background shadow-[0_8px_30px_-16px_rgb(0_0_0/0.25)]'>
			{/* Brauzer ramkasi */}
			<div className='flex items-center gap-3 border-b bg-muted/40 px-3 py-2'>
				<span className='flex gap-1.5' aria-hidden>
					<span className='size-2.5 rounded-full bg-border' />
					<span className='size-2.5 rounded-full bg-border' />
					<span className='size-2.5 rounded-full bg-border' />
				</span>
				<span className='flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground'>
					<Lock className='size-2.5 shrink-0' />
					<span className='truncate'>ormo.uz/#kategoriyalar</span>
				</span>
				<span className='flex items-center gap-1 font-mono text-[9px] tracking-widest text-emerald-600 uppercase dark:text-emerald-400'>
					<span className='size-1.5 animate-pulse rounded-full bg-emerald-500' />
					Jonli
				</span>
			</div>

			<div className='space-y-3 p-4'>
				<p className='font-space-grotesk text-sm font-bold tracking-tight'>Kategoriyalar</p>
				{visible.length === 0 ? (
					<p className='rounded-lg border border-dashed px-3 py-8 text-center text-xs text-muted-foreground'>
						Do&apos;konda hech qaysi kategoriya ko&apos;rinmaydi
					</p>
				) : (
					<div className='grid auto-rows-[5.5rem] grid-cols-2 gap-2'>
						{visible.map((category, index) => (
							<div
								key={category.id}
								className={cn(
									'flex flex-col overflow-hidden rounded-lg border transition-all duration-500 animate-in fade-in zoom-in-95',
									index === 0 && 'row-span-2'
								)}
							>
								<div className='relative flex-1 bg-white dark:bg-muted/40'>
									<CategoryImg image={category.image} sizes='120px' className='p-2' />
								</div>
								<div className='flex items-center justify-between gap-1 border-t px-2 py-1'>
									<span className='truncate text-[10px] font-semibold'>{category.title}</span>
									<ArrowUpRight className='size-2.5 shrink-0 text-muted-foreground' />
								</div>
							</div>
						))}
					</div>
				)}
				{hidden > 0 && (
					<p className='font-mono text-[10px] text-muted-foreground'>
						+ {hidden} ta yashirin kategoriya do&apos;konda ko&apos;rinmaydi
					</p>
				)}
			</div>
		</div>
	)
}

export default StorefrontPreview
