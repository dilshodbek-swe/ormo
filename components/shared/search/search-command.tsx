'use client'

import { Dialog } from '@base-ui/react/dialog'
import { Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import SearchPalette from './search-palette'

/**
 * Header'dagi qidiruv: tugma yoki Ctrl/⌘ + K bilan markazda palitra ochiladi.
 * Palitra har ochilganda toza holatdan boshlanadi (ichki komponent qayta mount bo'ladi).
 */
const SearchCommand = () => {
	const [open, setOpen] = useState(false)
	const close = useCallback(() => setOpen(false), [])

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
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
				className='hidden w-56 justify-start text-muted-foreground sm:inline-flex'
			>
				<Search />
				<span>Qidirish...</span>
				<kbd className='ml-auto rounded border bg-muted px-1.5 font-mono text-[10px]'>Ctrl K</kbd>
			</Button>
			<Button
				variant='ghost'
				size='icon'
				onClick={() => setOpen(true)}
				aria-label='Qidirish'
				className='sm:hidden'
			>
				<Search />
			</Button>

			<Dialog.Portal>
				<Dialog.Backdrop className='fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0' />
				<Dialog.Popup className='fixed top-[12vh] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border bg-background shadow-2xl outline-none transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0'>
					<Dialog.Title className='sr-only'>Mahsulot qidirish</Dialog.Title>
					<SearchPalette onClose={close} />
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

export default SearchCommand
