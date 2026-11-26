'use client'

import { Check, PartyPopper, Search } from 'lucide-react'
import { useEffect, useState, useSyncExternalStore } from 'react'

import PageHeader from '@/components/shared/page-header'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ratingStats, type Review, type ReviewStatus, sampleReviews, STATUS_META, STATUS_ORDER } from '../_lib/reviews'
import RatingSummary from './rating-summary'
import ReviewDetail, { type ReviewActions } from './review-detail'
import ReviewList from './review-list'

/* Keng ekran (lg) — ikki panel; torroqda tafsilot o'ngdan chiqadigan panelda */
const LG_QUERY = '(min-width: 1024px)'
const subscribeLg = (onChange: () => void) => {
	const media = window.matchMedia(LG_QUERY)
	media.addEventListener('change', onChange)
	return () => media.removeEventListener('change', onChange)
}
const useIsLarge = () => useSyncExternalStore(subscribeLg, () => window.matchMedia(LG_QUERY).matches, () => true)

const pad = (value: number) => String(value).padStart(2, '0')
const nowIso = () => {
	const date = new Date()
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

/**
 * Sharhlar moderatsiyasi (namunaviy rejim) — "pochta qutisi": chapda ro'yxat, o'ngda tafsilot.
 * Klaviatura: J/K — keyingi/oldingi, A — chop etish, H — yashirish. Qaror qabul qilingach
 * navbatdagi keyingi sharhga o'tadi ("inbox zero"). Backend ulanganda — `requireAdmin()` Server Action'lar.
 */
const ReviewsView = () => {
	const [reviews, setReviews] = useState(sampleReviews)
	const [status, setStatus] = useState<ReviewStatus | 'all'>('pending')
	const [rating, setRating] = useState<number | null>(null)
	const [query, setQuery] = useState('')
	const [selectedId, setSelectedId] = useState<string | null>(() => sampleReviews.find(review => review.status === 'pending')?.id ?? null)
	const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
	const [sheetOpen, setSheetOpen] = useState(false)
	const isLarge = useIsLarge()

	useEffect(() => {
		if (!toast) return
		const timer = setTimeout(() => setToast(null), 2600)
		return () => clearTimeout(timer)
	}, [toast])
	const notify = (text: string) => setToast({ id: Date.now(), text })

	const stats = ratingStats(reviews)
	const q = query.trim().toLowerCase()
	const filtered = reviews.filter(
		review =>
			(rating === null || review.rating === rating) &&
			(!q || `${review.title} ${review.text} ${review.customer.name} ${review.product.name}`.toLowerCase().includes(q))
	)
	const counts = Object.fromEntries(STATUS_ORDER.map(key => [key, filtered.filter(review => review.status === key).length])) as Record<ReviewStatus, number>
	const visible = filtered.filter(review => status === 'all' || review.status === status)
	const selected = reviews.find(review => review.id === selectedId) ?? null

	const select = (id: string) => {
		setSelectedId(id)
		if (!isLarge) setSheetOpen(true)
	}

	/** Qarordan keyin: joriy ro'yxatda keyingisiga (yoki oldingisiga) o'tish */
	const advanceFrom = (id: string) => {
		if (status === 'all') return
		const index = visible.findIndex(review => review.id === id)
		const next = visible[index + 1] ?? visible[index - 1]
		setSelectedId(next && next.id !== id ? next.id : null)
		if (!next || next.id === id) setSheetOpen(false)
	}

	const update = (id: string, change: (review: Review) => Review) => setReviews(list => list.map(review => (review.id === id ? change(review) : review)))

	const actions: ReviewActions = {
		onPublish: id => {
			update(id, review => ({ ...review, status: 'published', hiddenReason: undefined }))
			notify('Sharh chop etildi')
			advanceFrom(id)
		},
		onHide: (id, reason) => {
			update(id, review => ({ ...review, status: 'hidden', hiddenReason: reason }))
			notify(`Yashirildi · ${reason}`)
			advanceFrom(id)
		},
		onReply: (id, text) => {
			update(id, review => ({ ...review, reply: text ? { text, at: nowIso() } : undefined }))
			notify(text ? 'Javob saqlandi' : "Javob o'chirildi")
		},
	}

	// J/K/A/H — matn yozilmayotganda
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			if (event.metaKey || event.ctrlKey || event.altKey) return
			if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return
			const key = event.key.toLowerCase()
			const index = visible.findIndex(review => review.id === selectedId)
			if (key === 'j' || key === 'k') {
				event.preventDefault()
				const next = visible[key === 'j' ? Math.min(index + 1, visible.length - 1) : Math.max(index - 1, 0)]
				if (next) setSelectedId(next.id)
			} else if (key === 'a' && selected && selected.status !== 'published') {
				event.preventDefault()
				actions.onPublish(selected.id)
			} else if (key === 'h' && selected && selected.status !== 'hidden') {
				event.preventDefault()
				actions.onHide(selected.id, 'Moderator qarori')
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	})

	return (
		<>
			<PageHeader
				eyebrow={`Admin · Katalog · ${reviews.length} ta sharh`}
				title={
					stats.pending ? (
						<>
							{stats.pending} ta sharh <span className='text-muted-foreground'>navbatda.</span>
						</>
					) : (
						<>
							Navbat bo&apos;sh. <span className='text-muted-foreground'>Barakalla!</span>
						</>
					)
				}
				description="Sharhlarni tasdiqlang, yashiring yoki ochiq javob yozing. J/K — o'tish, A — chop etish, H — yashirish."
			/>

			<div className='space-y-6'>
				<RatingSummary stats={stats} ratingFilter={rating} onRatingFilter={setRating} />

				<div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
					<div className='flex flex-wrap gap-1' role='tablist' aria-label="Holat bo'yicha">
						{([...STATUS_ORDER, 'all'] as const).map(key => {
							const active = status === key
							return (
								<button
									key={key}
									type='button'
									role='tab'
									aria-selected={active}
									onClick={() => setStatus(key)}
									className={cn(
										'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
										active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
									)}
								>
									{key !== 'all' && <span className={cn('size-1.5 rounded-full', STATUS_META[key].dot)} />}
									{key === 'all' ? 'Hammasi' : STATUS_META[key].label}
									<span className={cn('rounded-full px-1.5 font-mono text-[10px] tabular-nums', active ? 'bg-background/20' : 'bg-muted')}>
										{key === 'all' ? filtered.length : counts[key]}
									</span>
								</button>
							)
						})}
					</div>
					<label className='flex h-9 min-w-0 items-center rounded-md border bg-background focus-within:ring-3 focus-within:ring-ring/30 lg:w-72'>
						<Search className='ml-3 size-4 shrink-0 text-muted-foreground' />
						<input
							value={query}
							onChange={event => setQuery(event.target.value)}
							placeholder='Matn, mijoz yoki mahsulot...'
							aria-label='Sharhlarni qidirish'
							className='h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground'
						/>
					</label>
				</div>

				<div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start'>
					<ReviewList reviews={visible} selectedId={selectedId} onSelect={select} />

					{isLarge && (
						<aside className='sticky top-20 h-[calc(100svh-7rem)] overflow-hidden rounded-xl border bg-background'>
							{selected ? (
								<ReviewDetail review={selected} actions={actions} />
							) : (
								<div className='flex h-full flex-col items-center justify-center gap-3 p-8 text-center'>
									<span className='flex size-12 items-center justify-center rounded-2xl border bg-muted/40'>
										<PartyPopper className='size-5' />
									</span>
									<p className='font-space-grotesk text-lg font-bold'>{status === 'pending' && counts.pending === 0 ? 'Inbox zero' : 'Sharh tanlang'}</p>
									<p className='max-w-xs text-sm text-muted-foreground'>
										{status === 'pending' && counts.pending === 0 ? "Navbatdagi hamma sharh ko'rib chiqildi." : "Chapdagi ro'yxatdan sharhni bosing yoki J tugmasini bosing."}
									</p>
								</div>
							)}
						</aside>
					)}
				</div>

				<p className='px-1 font-mono text-[11px] text-muted-foreground'>
					namunaviy rejim — qarorlar sahifa yangilanguncha saqlanadi · do&apos;kon hozircha faqat umumiy reytingni ko&apos;rsatadi
				</p>
			</div>

			{!isLarge && (
				<Sheet open={sheetOpen && Boolean(selected)} onOpenChange={setSheetOpen}>
					<SheetContent className='w-full gap-0 overflow-hidden p-0 data-[side=right]:sm:max-w-lg'>
						<SheetTitle className='sr-only'>Sharh</SheetTitle>
						{selected && <ReviewDetail review={selected} actions={actions} />}
					</SheetContent>
				</Sheet>
			)}

			{toast && (
				<div
					key={toast.id}
					role='status'
					className='fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xs animate-in items-center gap-2.5 rounded-xl border bg-foreground px-4 py-3 text-sm text-background shadow-2xl fade-in slide-in-from-bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6'
				>
					<span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white'>
						<Check className='size-3' />
					</span>
					<span className='min-w-0 truncate'>{toast.text}</span>
				</div>
			)}
		</>
	)
}

export default ReviewsView
