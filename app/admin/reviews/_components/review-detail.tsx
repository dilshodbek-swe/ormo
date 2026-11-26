'use client'

import { ArrowUpRight, BadgeCheck, Check, EyeOff, Flag, Pencil, ThumbsUp, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { type ReactNode, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn, formatDate } from '@/lib/utils'
import { flagsOf, REPLY_TEMPLATES, type Review, STATUS_META } from '../_lib/reviews'
import Stars from './stars'

const HIDE_REASONS = ['Haqoratli so‘zlar', 'Spam yoki reklama', 'Tekshirilmagan da’vo', 'Mahsulotga aloqasi yo‘q']

export interface ReviewActions {
	onPublish: (id: string) => void
	onHide: (id: string, reason: string) => void
	onReply: (id: string, text: string | null) => void
}

/** Flag so'zlarini matn ichida belgilaydi */
const highlight = (text: string, words: string[]) => {
	if (!words.length) return text
	const pattern = new RegExp(`(${words.join('|')})`, 'gi')
	return text.split(pattern).map((part, index) =>
		words.includes(part.toLowerCase()) ? (
			<mark key={index} className='rounded-[3px] bg-rose-500/15 px-0.5 text-rose-700 dark:text-rose-300'>
				{part}
			</mark>
		) : (
			part
		)
	)
}

/** Tanlangan sharh: mahsulot, muallif, matn, javob va moderatsiya tugmalari */
const ReviewDetail = ({ review, actions }: { review: Review; actions: ReviewActions }) => {
	const flags = flagsOf(review)

	return (
		<div className='flex h-full min-h-0 flex-col'>
			<div className='flex items-center gap-3 border-b p-4 pr-12 lg:pr-4'>
				<span className='relative size-11 shrink-0 overflow-hidden rounded-md border bg-white'>
					<Image src={review.product.image} alt='' fill sizes='44px' className='object-contain p-1 mix-blend-multiply' />
				</span>
				<div className='min-w-0 flex-1'>
					<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{review.product.brand}</p>
					<Link href={`/shop/${review.product.id}`} target='_blank' className='flex items-center gap-1 truncate text-sm font-medium underline-offset-4 hover:underline'>
						<span className='truncate'>{review.product.name}</span>
						<ArrowUpRight className='size-3.5 shrink-0 text-muted-foreground' />
					</Link>
				</div>
				<span className='inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px]'>
					<span className={cn('size-1.5 rounded-full', STATUS_META[review.status].dot)} />
					{STATUS_META[review.status].label}
				</span>
			</div>

			<div className='flex-1 space-y-5 overflow-y-auto p-5'>
				<div className='space-y-2'>
					<div className='flex items-center gap-2 text-sm'>
						<span className='flex size-7 items-center justify-center rounded-full bg-muted font-mono text-[11px] font-semibold'>
							{review.customer.name
								.split(' ')
								.map(part => part[0])
								.join('')}
						</span>
						<span className='font-medium'>{review.customer.name}</span>
						{review.verified ? (
							<span className='inline-flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400'>
								<BadgeCheck className='size-3.5' />
								Tasdiqlangan xarid
							</span>
						) : (
							<span className='text-xs text-muted-foreground'>xarid topilmadi</span>
						)}
					</div>
					<p className='font-mono text-[11px] text-muted-foreground'>
						{formatDate(review.createdAt, { time: true })} · {review.customer.city}
					</p>
				</div>

				<div className='space-y-2'>
					<Stars value={review.rating} className='[&_svg]:size-5' />
					<h2 className='font-space-grotesk text-xl font-bold tracking-tight'>{highlight(review.title, flags)}</h2>
					<p className='leading-relaxed text-muted-foreground'>{highlight(review.text, flags)}</p>
					<div className='flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground'>
						<span className='inline-flex items-center gap-1'>
							<ThumbsUp className='size-3.5' />
							{review.helpful} kishiga foydali
						</span>
						{flags.length > 0 && (
							<span className='inline-flex items-center gap-1 text-rose-600 dark:text-rose-400'>
								<Flag className='size-3.5' />
								Diqqat: {flags.join(', ')}
							</span>
						)}
						{review.hiddenReason && review.status === 'hidden' && <span>Yashirilgan: {review.hiddenReason}</span>}
					</div>
				</div>

				<ReplyBox key={`${review.id}-${review.reply?.at ?? 'none'}`} review={review} onReply={text => actions.onReply(review.id, text)} />
			</div>

			<Moderation key={review.id} review={review} actions={actions} />
		</div>
	)
}

/** Javob: bor bo'lsa — ko'rsatish/tahrirlash/o'chirish, bo'lmasa — shablonli yozish maydoni */
const ReplyBox = ({ review, onReply }: { review: Review; onReply: (text: string | null) => void }) => {
	const [editing, setEditing] = useState(!review.reply)
	const [text, setText] = useState(review.reply?.text ?? '')

	if (review.reply && !editing) {
		return (
			<div className='relative rounded-xl border bg-muted/30 p-4 pl-5'>
				<span aria-hidden className='absolute inset-y-3 left-0 w-0.5 rounded-r-full bg-foreground' />
				<div className='flex items-center justify-between gap-2'>
					<p className='flex items-center gap-2 text-xs font-medium'>
						<span className='size-2.5 rotate-45 rounded-[2px] bg-foreground' />
						Ormo javobi
						<span className='font-mono font-normal text-muted-foreground'>{formatDate(review.reply.at, { year: false, time: true })}</span>
					</p>
					<span className='flex gap-0.5'>
						<IconButton label='Tahrirlash' onClick={() => setEditing(true)}>
							<Pencil />
						</IconButton>
						<IconButton label="Javobni o'chirish" onClick={() => onReply(null)}>
							<Trash2 />
						</IconButton>
					</span>
				</div>
				<p className='mt-2 text-sm'>{review.reply.text}</p>
			</div>
		)
	}

	return (
		<div className='space-y-2 rounded-xl border p-3'>
			<div className='flex flex-wrap gap-1.5'>
				{REPLY_TEMPLATES.map(template => (
					<button
						key={template.label}
						type='button'
						onClick={() => setText(template.text)}
						className='rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-solid hover:text-foreground'
					>
						{template.label}
					</button>
				))}
			</div>
			<textarea
				value={text}
				onChange={event => setText(event.target.value)}
				onKeyDown={event => {
					if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && text.trim()) {
						event.preventDefault()
						onReply(text.trim())
					}
				}}
				rows={3}
				maxLength={600}
				placeholder='Ochiq javob yozing — sharh ostida mijozlar ko‘radi'
				aria-label='Javob matni'
				className='w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground'
			/>
			<div className='flex items-center justify-between gap-2'>
				<span className='font-mono text-[10px] text-muted-foreground'>{text.length}/600 · Ctrl ↵</span>
				<span className='flex gap-2'>
					{review.reply && (
						<Button variant='ghost' size='sm' onClick={() => setEditing(false)}>
							Bekor
						</Button>
					)}
					<Button size='sm' disabled={!text.trim()} onClick={() => onReply(text.trim())}>
						Javob berish
					</Button>
				</span>
			</div>
		</div>
	)
}

/** Pastki panel: chop etish / yashirish (sabab bilan) + klaviatura yorliqlari */
const Moderation = ({ review, actions }: { review: Review; actions: ReviewActions }) => {
	const [hiding, setHiding] = useState(false)

	if (hiding) {
		return (
			<div className='space-y-2 border-t bg-muted/30 p-4'>
				<p className='text-sm font-medium'>Nega yashiramiz?</p>
				<div className='flex flex-wrap gap-1.5'>
					{HIDE_REASONS.map(reason => (
						<button
							key={reason}
							type='button'
							onClick={() => actions.onHide(review.id, reason)}
							className='rounded-full border bg-background px-3 py-1 text-xs transition-colors hover:border-foreground'
						>
							{reason}
						</button>
					))}
				</div>
				<Button variant='ghost' size='sm' onClick={() => setHiding(false)}>
					Bekor
				</Button>
			</div>
		)
	}

	return (
		<div className='flex flex-wrap items-center gap-2 border-t bg-muted/30 p-4'>
			{review.status !== 'published' && (
				<Button onClick={() => actions.onPublish(review.id)}>
					<Check />
					{review.status === 'hidden' ? 'Qayta chop etish' : 'Chop etish'}
					<kbd className='rounded border border-background/30 px-1 font-mono text-[10px] opacity-70'>A</kbd>
				</Button>
			)}
			{review.status !== 'hidden' && (
				<Button variant='outline' onClick={() => setHiding(true)}>
					<EyeOff />
					Yashirish
					<kbd className='rounded border px-1 font-mono text-[10px] text-muted-foreground'>H</kbd>
				</Button>
			)}
			<span className='ml-auto hidden font-mono text-[10px] text-muted-foreground sm:block'>J / K — keyingi / oldingi</span>
		</div>
	)
}

const IconButton = ({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) => (
	<button
		type='button'
		aria-label={label}
		title={label}
		onClick={onClick}
		className='flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground [&_svg]:size-3.5'
	>
		{children}
	</button>
)

export default ReviewDetail
