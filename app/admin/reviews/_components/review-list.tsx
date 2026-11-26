'use client'

import { BadgeCheck, Flag, MessageSquareReply, MessageSquareText } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { cn, formatRelative } from '@/lib/utils'
import { flagsOf, type Review, STATUS_META } from '../_lib/reviews'
import Stars from './stars'

interface ReviewListProps {
	reviews: Review[]
	selectedId: string | null
	onSelect: (id: string) => void
}

/** Pochta qutisi kabi ro'yxat: chapda holat chizig'i, yulduzlar, sarlavha, parcha, mahsulot va muallif */
const ReviewList = ({ reviews, selectedId, onSelect }: ReviewListProps) => {
	const listRef = useRef<HTMLUListElement>(null)

	// Klaviatura bilan tanlanganda ko'rinadigan joyga suriladi
	useEffect(() => {
		listRef.current?.querySelector(`[data-id="${selectedId}"]`)?.scrollIntoView({ block: 'nearest' })
	}, [selectedId])

	if (reviews.length === 0) {
		return (
			<div className='flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center'>
				<MessageSquareText className='size-5 text-muted-foreground' />
				<p className='text-sm font-medium'>Bu yerda sharh yo&apos;q</p>
				<p className='text-xs text-muted-foreground'>Navbat bo&apos;sh — barakalla!</p>
			</div>
		)
	}

	return (
		<ul ref={listRef} className='divide-y overflow-hidden rounded-xl border bg-background'>
			{reviews.map(review => {
				const flags = flagsOf(review)
				const selected = review.id === selectedId
				return (
					<li key={review.id} data-id={review.id}>
						<button
							type='button'
							onClick={() => onSelect(review.id)}
							aria-current={selected}
							className={cn('relative flex w-full gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/40', selected && 'bg-muted/70')}
						>
							<span aria-hidden className={cn('absolute inset-y-2 left-0 w-0.5 rounded-r-full', STATUS_META[review.status].dot, !selected && review.status !== 'pending' && 'opacity-40')} />
							<span className='relative size-10 shrink-0 overflow-hidden rounded-md border bg-white'>
								<Image src={review.product.image} alt='' fill sizes='40px' className='object-contain p-1 mix-blend-multiply' />
							</span>
							<span className='min-w-0 flex-1 space-y-1'>
								<span className='flex items-center gap-2'>
									<Stars value={review.rating} />
									{flags.length > 0 && (
										<span className='inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-1.5 text-[10px] text-rose-700 dark:text-rose-400'>
											<Flag className='size-2.5' />
											diqqat
										</span>
									)}
									{review.reply && <MessageSquareReply className='size-3.5 text-muted-foreground' aria-label='Javob berilgan' />}
									<span className='ml-auto shrink-0 text-[11px] text-muted-foreground' suppressHydrationWarning>
										{formatRelative(review.createdAt)}
									</span>
								</span>
								<span className={cn('block truncate text-sm', review.status === 'pending' ? 'font-semibold' : 'font-medium')}>{review.title}</span>
								<span className='line-clamp-1 text-xs text-muted-foreground'>{review.text}</span>
								<span className='flex items-center gap-1.5 truncate text-[11px] text-muted-foreground'>
									<span className='truncate'>{review.customer.name}</span>
									{review.verified && <BadgeCheck className='size-3 shrink-0 text-sky-500' aria-label='Tasdiqlangan xarid' />}
									<span>·</span>
									<span className='truncate'>{review.product.name}</span>
								</span>
							</span>
						</button>
					</li>
				)
			})}
		</ul>
	)
}

export default ReviewList
