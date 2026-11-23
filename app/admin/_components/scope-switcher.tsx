'use client'

import { Check, ChevronsUpDown, LayoutGrid, ShieldCheck, Store, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const scopes: { href: string; label: string; hint: string; icon: LucideIcon; current?: boolean }[] = [
	{ href: '/admin', label: 'Admin panel', hint: "Do'konni boshqarish", icon: ShieldCheck, current: true },
	{ href: '/dashboard', label: 'Mening kabinetim', hint: 'Xaridlar va profil', icon: LayoutGrid },
	{ href: '/', label: "Do'kon", hint: 'Mijozlar ko‘radigan sayt', icon: Store },
]

/** Vercel'dagi jamoa almashtirgich kabi: "Ormo / Admin" — bosilganda boshqa joylarga o'tish */
const ScopeSwitcher = () => {
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className='group/scope flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0'>
				<span className='size-3.5 shrink-0 rotate-45 rounded-[3px] bg-foreground transition-transform duration-500 group-hover/scope:rotate-[225deg]' />
				<span className='flex min-w-0 flex-1 items-center gap-1.5 group-data-[collapsible=icon]:hidden'>
					<span className='font-space-grotesk text-lg font-bold tracking-tight'>Ormo</span>
					<span className='text-lg font-light text-muted-foreground/50'>/</span>
					<span className='truncate text-sm font-medium'>Admin</span>
				</span>
				<ChevronsUpDown className='size-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden' />
			</PopoverTrigger>

			<PopoverContent align='start' sideOffset={6} className='w-64 gap-0 p-1'>
				<p className='px-2 pt-1.5 pb-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>
					Qayerga o&apos;tamiz?
				</p>
				{scopes.map(({ href, label, hint, icon: Icon, current }) => (
					<Link
						key={href}
						href={href}
						onClick={() => setOpen(false)}
						className='flex items-center gap-3 rounded-md px-2 py-2 transition-colors outline-none hover:bg-muted focus-visible:bg-muted'
					>
						<span className='flex size-8 shrink-0 items-center justify-center rounded-md border bg-background [&_svg]:size-4'>
							<Icon />
						</span>
						<span className='min-w-0 flex-1'>
							<span className='block text-sm font-medium'>{label}</span>
							<span className='block truncate text-xs text-muted-foreground'>{hint}</span>
						</span>
						{current && <Check className='size-4 shrink-0' />}
					</Link>
				))}
			</PopoverContent>
		</Popover>
	)
}

export default ScopeSwitcher
