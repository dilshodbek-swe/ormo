'use client'

import { Check, Plus, Search, TicketPercent } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import PageHeader from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sampleCoupons } from '../_lib/sample-coupons'
import { type Coupon, type CouponDraft, type CouponStatus, getStatus, parseNumber, STATUS_META, STATUS_ORDER, todayKey } from '../_lib/types'
import CouponEditor, { type CouponEditorState } from './coupon-editor'
import CouponTicket, { type CouponActions } from './coupon-ticket'
import CouponsStats from './coupons-stats'
import DeleteCouponDialog from './delete-coupon-dialog'

/**
 * Kuponlar (namunaviy rejim): yaratish, tahrirlash, to'xtatish, nusxa va o'chirish shu sahifa xotirasida.
 * Holat (faol/rejalashtirilgan/tugagan...) sanalardan va limitdan avtomatik hisoblanadi.
 * Backend ulanganda har bir amal — `requireAdmin()` bilan himoyalangan Server Action.
 */
const CouponsView = () => {
	const [coupons, setCoupons] = useState(sampleCoupons)
	const [status, setStatus] = useState<CouponStatus | 'all'>('all')
	const [query, setQuery] = useState('')
	const [editor, setEditor] = useState<CouponEditorState>(null)
	const [deleting, setDeleting] = useState<Coupon | null>(null)
	const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
	const searchRef = useRef<HTMLInputElement>(null)
	const today = todayKey()

	useEffect(() => {
		if (!toast) return
		const timer = setTimeout(() => setToast(null), 3200)
		return () => clearTimeout(timer)
	}, [toast])
	const notify = (text: string) => setToast({ id: Date.now(), text })

	// "/" — qidiruv, "N" — yangi kupon
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			if (event.metaKey || event.ctrlKey || event.altKey) return
			if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return
			if (document.querySelector('[role=dialog]')) return
			if (event.key === '/') {
				event.preventDefault()
				searchRef.current?.focus()
			} else if (event.key.toLowerCase() === 'n') {
				event.preventDefault()
				setEditor({ mode: 'create' })
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	const statuses = Object.fromEntries(coupons.map(coupon => [coupon.id, getStatus(coupon, today)])) as Record<string, CouponStatus>
	const q = query.trim().toLowerCase()
	const searched = coupons.filter(coupon => !q || `${coupon.code} ${coupon.description}`.toLowerCase().includes(q))
	const counts = Object.fromEntries(STATUS_ORDER.map(key => [key, searched.filter(coupon => statuses[coupon.id] === key).length])) as Record<CouponStatus, number>
	// Holat tartibida (faollar tepada), ichida — yangi boshlanganlari oldin
	const visible = searched
		.filter(coupon => status === 'all' || statuses[coupon.id] === status)
		.sort(
			(a, b) =>
				STATUS_ORDER.indexOf(statuses[a.id]) - STATUS_ORDER.indexOf(statuses[b.id]) || b.startsAt.localeCompare(a.startsAt)
		)

	const save = async (draft: CouponDraft, existing?: Coupon) => {
		await new Promise(resolve => setTimeout(resolve, 400)) // namunaviy "tarmoq"
		const fields = {
			code: draft.code,
			description: draft.description.trim(),
			type: draft.type,
			value: parseNumber(draft.value),
			minOrder: parseNumber(draft.minOrder) || 0,
			maxUses: draft.maxUses.trim() ? parseNumber(draft.maxUses) : null,
			onePerCustomer: draft.onePerCustomer,
			firstOrderOnly: draft.firstOrderOnly,
			categories: draft.categories,
			startsAt: draft.startsAt,
			endsAt: draft.endsAt || null,
			paused: draft.paused,
		}
		if (existing) {
			setCoupons(list => list.map(coupon => (coupon.id === existing.id ? { ...coupon, ...fields } : coupon)))
			notify(`${fields.code} saqlandi`)
		} else {
			setCoupons(list => [
				{ ...fields, id: `cpn_${crypto.randomUUID().slice(0, 8)}`, uses: 0, discountGiven: 0, revenue: 0, createdAt: new Date().toISOString() },
				...list,
			])
			notify(`${fields.code} yaratildi`)
		}
		setEditor(null)
	}

	const togglePause = (coupon: Coupon) => {
		setCoupons(list => list.map(item => (item.id === coupon.id ? { ...item, paused: !item.paused } : item)))
		notify(coupon.paused ? `${coupon.code} yana ishlaydi` : `${coupon.code} to'xtatildi`)
	}

	const actions: CouponActions = {
		onEdit: coupon => setEditor({ mode: 'edit', coupon }),
		onDuplicate: coupon => {
			const taken = new Set(coupons.map(item => item.code))
			let code = `${coupon.code}-2`
			for (let index = 3; taken.has(code); index++) code = `${coupon.code}-${index}`
			setCoupons(list => [
				{
					...coupon,
					id: `cpn_${crypto.randomUUID().slice(0, 8)}`,
					code,
					paused: true,
					uses: 0,
					discountGiven: 0,
					revenue: 0,
					startsAt: today,
					endsAt: coupon.endsAt && coupon.endsAt < today ? null : coupon.endsAt,
					createdAt: new Date().toISOString(),
				},
				...list,
			])
			notify(`${code} — to'xtatilgan nusxa yaratildi`)
		},
		onTogglePause: togglePause,
		onDelete: coupon => setDeleting(coupon),
	}

	return (
		<>
			<PageHeader
				eyebrow={`Admin · Savdo · ${coupons.length} ta`}
				title={
					<>
						Kuponlar <span className='text-muted-foreground'>· {counts.active ?? 0} faol</span>
					</>
				}
				description='Promo-kodlar: foiz yoki summa, minimal buyurtma, limit va muddat. Holat sanalardan avtomatik hisoblanadi.'
				action={
					<Button onClick={() => setEditor({ mode: 'create' })} className='h-9'>
						<Plus />
						Yangi kupon
						<kbd className='rounded border border-background/30 px-1 font-mono text-[10px] opacity-70'>N</kbd>
					</Button>
				}
			/>

			<div className='space-y-6'>
				<CouponsStats coupons={coupons} statuses={statuses} />

				<div className='flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between'>
					<div className='flex flex-wrap gap-1' role='tablist' aria-label="Holat bo'yicha">
						{(['all', ...STATUS_ORDER] as const).map(key => {
							const active = status === key
							return (
								<button
									key={key}
									type='button'
									role='tab'
									aria-selected={active}
									onClick={() => setStatus(key)}
									className={cn(
										'flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
										active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
									)}
								>
									{key !== 'all' && <span className={cn('size-1.5 rounded-full', STATUS_META[key].dot)} />}
									{key === 'all' ? 'Hammasi' : STATUS_META[key].label}
									<span className={cn('rounded-full px-1.5 font-mono text-[10px] tabular-nums', active ? 'bg-background/20' : 'bg-muted')}>
										{key === 'all' ? searched.length : counts[key]}
									</span>
								</button>
							)
						})}
					</div>
					<label className='relative flex h-9 min-w-0 items-center rounded-md border bg-background focus-within:ring-3 focus-within:ring-ring/30 xl:w-64'>
						<Search className='ml-3 size-4 shrink-0 text-muted-foreground' />
						<input
							ref={searchRef}
							value={query}
							onChange={event => setQuery(event.target.value)}
							onKeyDown={event => {
								if (event.key === 'Escape') {
									setQuery('')
									event.currentTarget.blur()
								}
							}}
							placeholder='Kod yoki izoh...'
							aria-label='Kuponlarni qidirish'
							className='h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground'
						/>
						<kbd className='mr-2.5 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground'>/</kbd>
					</label>
				</div>

				{visible.length === 0 ? (
					<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center'>
						<span className='flex size-11 items-center justify-center rounded-xl border bg-background text-muted-foreground'>
							<TicketPercent className='size-5' />
						</span>
						<p className='font-medium'>{coupons.length ? 'Hech narsa topilmadi' : "Hali kupon yo'q"}</p>
						<Button variant='outline' onClick={() => (coupons.length ? (setStatus('all'), setQuery('')) : setEditor({ mode: 'create' }))}>
							{coupons.length ? 'Filtrlarni tozalash' : 'Birinchi kuponni yaratish'}
						</Button>
					</div>
				) : (
					<ul className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
						{visible.map((coupon, index) => (
							<li key={coupon.id} className='min-w-0 animate-in fade-in slide-in-from-bottom-1 fill-mode-backwards' style={{ animationDelay: `${index * 30}ms` }}>
								<CouponTicket coupon={coupon} status={statuses[coupon.id]} today={today} actions={actions} />
							</li>
						))}
					</ul>
				)}

				<p className='px-1 font-mono text-[11px] text-muted-foreground'>
					namunaviy rejim — o&apos;zgarishlar sahifa yangilanguncha saqlanadi · savat hozircha faqat ORMO10 va KADR5 ni qabul qiladi
				</p>
			</div>

			<CouponEditor
				state={editor}
				takenCodes={exceptId => coupons.filter(coupon => coupon.id !== exceptId).map(coupon => coupon.code)}
				onClose={() => setEditor(null)}
				onSave={save}
			/>
			<DeleteCouponDialog
				coupon={deleting}
				onClose={() => setDeleting(null)}
				onConfirm={coupon => {
					setCoupons(list => list.filter(item => item.id !== coupon.id))
					setDeleting(null)
					notify(`${coupon.code} o'chirildi`)
				}}
				onPause={coupon => {
					togglePause(coupon)
					setDeleting(null)
				}}
			/>

			{toast && (
				<div
					key={toast.id}
					role='status'
					className='fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm animate-in items-center gap-2.5 rounded-xl border bg-foreground px-4 py-3 text-sm text-background shadow-2xl fade-in slide-in-from-bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6'
				>
					<span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white'>
						<Check className='size-3' />
					</span>
					<span className='min-w-0 truncate font-mono'>{toast.text}</span>
				</div>
			)}
		</>
	)
}

export default CouponsView
