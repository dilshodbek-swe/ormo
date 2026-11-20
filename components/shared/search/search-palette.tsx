'use client'

import { Search, X } from 'lucide-react'
import { type KeyboardEvent, useCallback, useState } from 'react'

import { searchProducts } from '@/lib/data/search'
import RedirectCountdown from './redirect-countdown'
import SearchResults from './search-results'
import SearchSuggestions from './search-suggestions'
import useSearchRedirect, { MIN_QUERY_LENGTH, REDIRECT_DELAY_MS } from './use-search-redirect'

const RESULT_LIMIT = 5

const Kbd = ({ children }: { children: string }) => (
	<kbd className='rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>
		{children}
	</kbd>
)

/**
 * Palitra ichi. Yozish to'xtagach REDIRECT_DELAY_MS dan keyin /shop?q=... ga o'tadi;
 * natija ustida turganda (sichqoncha yoki ↑↓) taymer to'xtaydi — mahsulotni bemalol tanlash uchun.
 */
const SearchPalette = ({ onClose }: { onClose: () => void }) => {
	const [query, setQuery] = useState('')
	const [activeIndex, setActiveIndex] = useState(-1)
	const [hoveringResults, setHoveringResults] = useState(false)

	const trimmed = query.trim()
	const results = trimmed ? searchProducts(trimmed, RESULT_LIMIT) : []
	const total = trimmed ? searchProducts(trimmed).length : 0

	const handleNavigate = useCallback(() => onClose(), [onClose])
	const { armed, go } = useSearchRedirect({
		query,
		paused: activeIndex >= 0 || hoveringResults || total === 0,
		onNavigate: handleNavigate,
	})

	const changeQuery = (value: string) => {
		setQuery(value)
		setActiveIndex(-1)
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'ArrowDown' && results.length > 0) {
			event.preventDefault()
			setActiveIndex(index => (index + 1) % results.length)
		}
		if (event.key === 'ArrowUp' && results.length > 0) {
			event.preventDefault()
			setActiveIndex(index => (index <= 0 ? results.length - 1 : index - 1))
		}
		if (event.key === 'Enter' && trimmed) {
			event.preventDefault()
			go(activeIndex >= 0 ? `/shop/${results[activeIndex].id}` : undefined)
		}
	}

	const status = !trimmed
		? 'Mahsulot, brend yoki kategoriya'
		: total === 0
			? 'Hech narsa topilmadi'
			: trimmed.length < MIN_QUERY_LENGTH
				? `Yana bir harf…`
				: armed
					? `${total} ta natija · ${REDIRECT_DELAY_MS / 1000}s dan keyin do'konga`
					: `${total} ta natija · tanlash uchun to'xtatildi`

	return (
		<>
			<div className='flex items-center gap-3 px-4'>
				<Search className='size-4 shrink-0 text-muted-foreground' />
				<input
					autoFocus
					value={query}
					onChange={event => changeQuery(event.target.value)}
					onKeyDown={handleKeyDown}
					placeholder='Nimani qidiramiz?'
					aria-label='Qidiruv'
					aria-autocomplete='list'
					className='h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground'
				/>
				{query && (
					<button
						type='button'
						onClick={() => changeQuery('')}
						aria-label='Tozalash'
						className='flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground'
					>
						<X className='size-3.5' />
					</button>
				)}
				<Kbd>esc</Kbd>
			</div>

			<RedirectCountdown active={armed} restartKey={trimmed} />

			<div
				onMouseEnter={() => setHoveringResults(true)}
				onMouseLeave={() => setHoveringResults(false)}
				className='max-h-[min(60vh,24rem)] overflow-y-auto'
			>
				{!trimmed ? (
					<SearchSuggestions onPick={changeQuery} />
				) : results.length > 0 ? (
					<SearchResults
						products={results}
						activeIndex={activeIndex}
						onHover={setActiveIndex}
						onSelect={product => go(`/shop/${product.id}`)}
					/>
				) : (
					<p className='px-4 py-10 text-center text-sm text-muted-foreground'>
						&ldquo;{trimmed}&rdquo; bo&apos;yicha hech narsa yo&apos;q. Boshqa so&apos;z bilan
						urinib ko&apos;ring.
					</p>
				)}
			</div>

			<div className='flex items-center justify-between gap-4 border-t bg-muted/30 px-4 py-2.5 font-mono text-[11px] text-muted-foreground'>
				<span aria-live='polite' className='truncate'>
					{status}
				</span>
				<span className='hidden shrink-0 items-center gap-1.5 sm:flex'>
					<Kbd>↑↓</Kbd> tanlash <Kbd>↵</Kbd> ochish
				</span>
			</div>
		</>
	)
}

export default SearchPalette
