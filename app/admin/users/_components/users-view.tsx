'use client'

import { ArrowDownWideNarrow, Check, Search, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'

import PageHeader from '@/components/shared/page-header'
import { cn, formatDate, formatRelative } from '@/lib/utils'
import { type AdminUserRow, ROLE_META } from '../_lib/types'
import UserAvatarCell from './user-avatar-cell'
import UserSheet from './user-sheet'

type RoleFilter = 'all' | 'customer' | 'admin'
type SortKey = 'newest' | 'active' | 'name'
const SORTS: { value: SortKey; label: string }[] = [
	{ value: 'newest', label: 'Yangilari' },
	{ value: 'active', label: 'Faollik' },
	{ value: 'name', label: 'Ism' },
]

const DAY = 86_400_000
const COLUMNS = 'md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_7rem_8rem_8rem]'

interface UsersViewProps {
	users: AdminUserRow[]
	currentId: string | null
}

/**
 * Foydalanuvchilar — haqiqiy ma'lumot (MongoDB, Clerk webhook orqali sinxron).
 * Rol o'zgartirish Server Action orqali; sahifa `refresh()` bilan yangilanadi.
 */
const UsersView = ({ users, currentId }: UsersViewProps) => {
	const [role, setRole] = useState<RoleFilter>('all')
	const [query, setQuery] = useState('')
	const [sort, setSort] = useState<SortKey>('newest')
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
	// "Hozir" — render paytida emas, mount'da bir marta (7/30 kunlik hisoblar uchun)
	const [now] = useState(() => Date.now())

	useEffect(() => {
		if (!toast) return
		const timer = setTimeout(() => setToast(null), 3200)
		return () => clearTimeout(timer)
	}, [toast])

	const admins = users.filter(user => user.role === 'admin').length
	const newThisWeek = users.filter(user => now - new Date(user.createdAt).getTime() < 7 * DAY).length
	const activeThisWeek = users.filter(user => user.lastSignInAt && now - new Date(user.lastSignInAt).getTime() < 7 * DAY).length

	// So'nggi 30 kunda ro'yxatdan o'tganlar — kunlik ustunlar
	const days = Array.from({ length: 30 }, (_, index) => {
		const start = new Date(now - (29 - index) * DAY)
		start.setHours(0, 0, 0, 0)
		const end = start.getTime() + DAY
		return { date: start, count: users.filter(user => { const time = new Date(user.createdAt).getTime(); return time >= start.getTime() && time < end }).length }
	})
	const dayMax = Math.max(...days.map(day => day.count), 1)

	const q = query.trim().toLowerCase()
	const searched = users.filter(user => !q || `${user.fullName} ${user.username ?? ''} ${user.email} ${user.city ?? ''}`.toLowerCase().includes(q))
	const visible = searched
		.filter(user => role === 'all' || user.role === role)
		.sort((a, b) =>
			sort === 'name'
				? (a.fullName || a.email).localeCompare(b.fullName || b.email)
				: sort === 'active'
					? (b.lastSignInAt ?? '').localeCompare(a.lastSignInAt ?? '')
					: b.createdAt.localeCompare(a.createdAt)
		)
	const selected = users.find(user => user.id === selectedId) ?? null
	const nextSort = SORTS[(SORTS.findIndex(item => item.value === sort) + 1) % SORTS.length]

	return (
		<>
			<PageHeader
				eyebrow={`Admin · Mijozlar · ${users.length} ta`}
				title={
					<>
						Foydalanuvchilar <span className='text-muted-foreground'>· {admins} admin</span>
					</>
				}
				description="Clerk orqali ro'yxatdan o'tganlar. Qatorni bosib profil va rolni ko'ring — admin huquqi shu yerdan beriladi."
			/>

			<div className='space-y-6'>
				<div className='grid gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]'>
					<div className='grid grid-cols-2 gap-px bg-border'>
						<Stat label='Jami' value={users.length} hint={`${admins} admin · ${users.length - admins} mijoz`} />
						<Stat label='Yangi' value={newThisWeek} hint="so'nggi 7 kunda" />
						<Stat label='Faol' value={activeThisWeek} hint="7 kunda kirganlar" />
						<Stat label='Manzil qo‘shgan' value={users.filter(user => user.addressCount > 0).length} hint='buyurtmaga tayyor' />
					</div>
					<div className='flex flex-col bg-background p-5'>
						<div className='flex items-baseline justify-between'>
							<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>Ro&apos;yxatdan o&apos;tish · 30 kun</p>
							<p className='font-mono text-xs text-muted-foreground tabular-nums'>{days.reduce((sum, day) => sum + day.count, 0)} ta</p>
						</div>
						<div className='mt-4 flex flex-1 items-end gap-0.75' style={{ minHeight: '5rem' }}>
							{days.map((day, index) => (
								<span
									key={index}
									title={`${formatDate(day.date, { year: false })}: ${day.count}`}
									className={cn('flex-1 rounded-t-[3px] transition-colors', day.count ? 'bg-foreground/70 hover:bg-foreground' : 'bg-border')}
									style={{ height: `${Math.max((day.count / dayMax) * 100, 4)}%` }}
								/>
							))}
						</div>
						<div className='mt-2 flex justify-between font-mono text-[10px] text-muted-foreground'>
							<span>{formatDate(days[0].date, { year: false })}</span>
							<span>bugun</span>
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
					<div className='flex flex-wrap gap-1' role='tablist' aria-label="Rol bo'yicha">
						{(
							[
								['all', 'Hammasi', searched.length],
								['customer', 'Mijozlar', searched.filter(user => user.role === 'customer').length],
								['admin', 'Adminlar', searched.filter(user => user.role === 'admin').length],
							] as const
						).map(([value, label, count]) => (
							<button
								key={value}
								type='button'
								role='tab'
								aria-selected={role === value}
								onClick={() => setRole(value)}
								className={cn(
									'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
									role === value ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
								)}
							>
								{label}
								<span className={cn('rounded-full px-1.5 font-mono text-[10px] tabular-nums', role === value ? 'bg-background/20' : 'bg-muted')}>{count}</span>
							</button>
						))}
					</div>
					<div className='flex gap-2'>
						<label className='flex h-9 min-w-0 flex-1 items-center rounded-md border bg-background focus-within:ring-3 focus-within:ring-ring/30 md:w-72 md:flex-none'>
							<Search className='ml-3 size-4 shrink-0 text-muted-foreground' />
							<input
								value={query}
								onChange={event => setQuery(event.target.value)}
								placeholder='Ism, email, username...'
								aria-label='Foydalanuvchilarni qidirish'
								className='h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground'
							/>
						</label>
						<button
							type='button'
							onClick={() => setSort(nextSort.value)}
							title={`Keyingisi: ${nextSort.label}`}
							className='flex h-9 shrink-0 items-center gap-2 rounded-md border bg-background px-3 text-sm transition-colors hover:bg-muted'
						>
							<ArrowDownWideNarrow className='size-4 text-muted-foreground' />
							<span className='hidden sm:inline'>{SORTS.find(item => item.value === sort)?.label}</span>
						</button>
					</div>
				</div>

				{visible.length === 0 ? (
					<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center'>
						<UsersRound className='size-5 text-muted-foreground' />
						<p className='font-medium'>{users.length ? 'Hech kim topilmadi' : "Hali foydalanuvchi yo'q"}</p>
					</div>
				) : (
					<div className='overflow-hidden rounded-xl border bg-background'>
						<div className={cn('hidden gap-4 border-b bg-muted/40 px-4 py-2.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase md:grid', COLUMNS)}>
							<span>Foydalanuvchi</span>
							<span>Email</span>
							<span>Rol</span>
							<span>Qo&apos;shilgan</span>
							<span>Oxirgi kirish</span>
						</div>
						<ul className='divide-y'>
							{visible.map(user => (
								<li key={user.id}>
									<button
										type='button'
										onClick={() => setSelectedId(user.id)}
										className={cn('grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 text-left transition-colors hover:bg-muted/40 md:grid', COLUMNS)}
									>
										<span className='flex min-w-0 items-center gap-3'>
											<UserAvatarCell user={user} />
											<span className='min-w-0'>
												<span className='flex items-center gap-2 truncate text-sm font-medium'>
													<span className='truncate'>{user.fullName || user.email.split('@')[0]}</span>
													{user.id === currentId && <span className='shrink-0 rounded-full border px-1.5 text-[10px] font-normal text-muted-foreground'>siz</span>}
												</span>
												<span className='block truncate font-mono text-[11px] text-muted-foreground'>
													{user.username ? `@${user.username}` : '—'}
													{user.city ? ` · ${user.city}` : ''}
												</span>
											</span>
										</span>
										<span className='order-3 col-span-2 truncate text-sm text-muted-foreground md:order-0 md:col-span-1'>{user.email}</span>
										<span>
											<span
												className={cn(
													'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
													user.role === 'admin' ? 'border-foreground bg-foreground text-background' : 'text-muted-foreground'
												)}
											>
												{ROLE_META[user.role].label}
											</span>
										</span>
										<span className='hidden font-mono text-xs text-muted-foreground md:block'>{formatDate(user.createdAt, { year: false })}</span>
										<span className='hidden text-xs text-muted-foreground md:block' suppressHydrationWarning>
											{user.lastSignInAt ? formatRelative(user.lastSignInAt) : '—'}
										</span>
									</button>
								</li>
							))}
						</ul>
					</div>
				)}

				<p className='px-1 font-mono text-[11px] text-muted-foreground'>
					haqiqiy ma&apos;lumot — MongoDB (Clerk webhook orqali) · rol o&apos;zgarishi darhol saqlanadi
				</p>
			</div>

			<UserSheet
				user={selected}
				isSelf={selected?.id === currentId}
				adminCount={admins}
				onClose={() => setSelectedId(null)}
				onDone={text => {
					setToast({ id: Date.now(), text })
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
					<span className='min-w-0 truncate'>{toast.text}</span>
				</div>
			)}
		</>
	)
}

const Stat = ({ label, value, hint }: { label: string; value: number; hint: string }) => (
	<div className='bg-background p-4'>
		<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{label}</p>
		<p className='mt-1.5 font-space-grotesk text-2xl font-bold tracking-tight tabular-nums'>{value}</p>
		<p className='truncate text-xs text-muted-foreground'>{hint}</p>
	</div>
)

export default UsersView
