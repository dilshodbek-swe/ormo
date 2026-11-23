'use client'

import { Dialog } from '@base-ui/react/dialog'
import { CornerDownLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { adminNav } from '../_lib/nav'

const normalize = (value: string) => value.toLowerCase().replace(/[‘’ʻʼ']/g, '')

/** Admin bo'limlari bo'ylab tezkor o'tish: Ctrl/⌘ + K */
const AdminCommand = () => {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const onKeyDown = (event: globalThis.KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault()
				setOpen(value => !value)
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Button
				variant='outline'
				onClick={() => setOpen(true)}
				className='hidden w-60 justify-start text-muted-foreground md:inline-flex'
			>
				<Search />
				<span>Bo&apos;limga o&apos;tish...</span>
				<kbd className='ml-auto rounded border bg-muted px-1.5 font-mono text-[10px]'>Ctrl K</kbd>
			</Button>
			<Button variant='ghost' size='icon' onClick={() => setOpen(true)} aria-label='Bo‘limga o‘tish' className='md:hidden'>
				<Search />
			</Button>

			<Dialog.Portal>
				<Dialog.Backdrop className='fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0' />
				<Dialog.Popup className='fixed top-[12vh] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border bg-background shadow-2xl outline-none transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0'>
					<Dialog.Title className='sr-only'>Admin bo&apos;limlari</Dialog.Title>
					<CommandList onClose={() => setOpen(false)} />
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

/** Palitra ichi — har ochilganda qayta mount bo'lib, toza holatdan boshlanadi */
const CommandList = ({ onClose }: { onClose: () => void }) => {
	const router = useRouter()
	const [query, setQuery] = useState('')
	const [active, setActive] = useState(0)
	const listRef = useRef<HTMLDivElement>(null)

	const q = normalize(query.trim())
	const groups = adminNav
		.map(group => ({
			...group,
			links: group.links.filter(
				link => !q || normalize(link.label).includes(q) || normalize(link.description).includes(q)
			),
		}))
		.filter(group => group.links.length > 0)
	const flat = groups.flatMap(group => group.links)

	const go = (href: string) => {
		onClose()
		router.push(href)
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (!flat.length) return
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault()
			const next = (active + (event.key === 'ArrowDown' ? 1 : -1) + flat.length) % flat.length
			setActive(next)
			listRef.current?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: 'nearest' })
		}
		if (event.key === 'Enter') {
			event.preventDefault()
			go(flat[active].href)
		}
	}

	return (
		<>
			<div className='flex items-center gap-3 border-b px-4'>
				<Search className='size-4 shrink-0 text-muted-foreground' />
				<input
					autoFocus
					value={query}
					onChange={event => {
						setQuery(event.target.value)
						setActive(0)
					}}
					onKeyDown={handleKeyDown}
					placeholder="Bo'lim nomini yozing..."
					aria-label="Bo'lim qidirish"
					className='h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
				/>
				<kbd className='rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>Esc</kbd>
			</div>

			<div ref={listRef} className='max-h-[min(60vh,420px)] overflow-y-auto p-1.5'>
				{flat.length === 0 && (
					<p className='px-3 py-10 text-center text-sm text-muted-foreground'>
						&laquo;{query}&raquo; bo&apos;yicha bo&apos;lim topilmadi
					</p>
				)}
				{groups.map(group => (
					<div key={group.label} className='pb-1'>
						<p className='px-2.5 pt-2 pb-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>
							{group.label}
						</p>
						{group.links.map(({ href, label, description, icon: Icon, shortcut }) => {
							const index = flat.findIndex(link => link.href === href)
							const selected = index === active
							return (
								<button
									key={href}
									type='button'
									data-index={index}
									onMouseMove={() => setActive(index)}
									onClick={() => go(href)}
									className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors ${selected ? 'bg-muted' : ''}`}
								>
									<span className='flex size-8 shrink-0 items-center justify-center rounded-md border bg-background [&_svg]:size-4'>
										<Icon />
									</span>
									<span className='min-w-0 flex-1'>
										<span className='block text-sm font-medium'>{label}</span>
										<span className='block truncate text-xs text-muted-foreground'>{description}</span>
									</span>
									{selected ? (
										<CornerDownLeft className='size-3.5 shrink-0 text-muted-foreground' />
									) : (
										<kbd className='hidden shrink-0 font-mono text-[10px] text-muted-foreground sm:block'>G {shortcut}</kbd>
									)}
								</button>
							)
						})}
					</div>
				))}
			</div>

			<div className='flex items-center gap-4 border-t bg-muted/40 px-4 py-2 font-mono text-[10px] text-muted-foreground'>
				<span>↑↓ tanlash</span>
				<span>↵ ochish</span>
				<span className='ml-auto'>G + harf — tezkor o&apos;tish</span>
			</div>
		</>
	)
}

export default AdminCommand
