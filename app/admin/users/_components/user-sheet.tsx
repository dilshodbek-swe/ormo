'use client'

import { Check, Copy, Loader2, MapPin, ShieldCheck, UserRound } from 'lucide-react'
import { type ReactNode, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import type { UserRole } from '@/lib/db/models/user'
import { cn, formatDate, formatRelative } from '@/lib/utils'
import { setUserRole } from '../_lib/actions'
import { type AdminUserRow, ROLE_META } from '../_lib/types'
import UserAvatarCell from './user-avatar-cell'

interface UserSheetProps {
	user: AdminUserRow | null
	isSelf: boolean
	adminCount: number
	onClose: () => void
	onDone: (text: string) => void
}

const UserSheet = ({ user, isSelf, adminCount, onClose, onDone }: UserSheetProps) => (
	<Sheet open={Boolean(user)} onOpenChange={open => !open && onClose()}>
		<SheetContent className='w-full gap-0 overflow-hidden p-0 data-[side=right]:sm:max-w-md'>
			{user && <Details key={`${user.id}-${user.role}`} user={user} isSelf={isSelf} adminCount={adminCount} onDone={onDone} />}
		</SheetContent>
	</Sheet>
)

const Details = ({ user, isSelf, adminCount, onDone }: { user: AdminUserRow; isSelf: boolean; adminCount: number; onDone: (text: string) => void }) => {
	const [copied, setCopied] = useState(false)
	const title = user.fullName || (user.username ? `@${user.username}` : user.email)

	const copyId = async () => {
		await navigator.clipboard.writeText(user.id)
		setCopied(true)
		setTimeout(() => setCopied(false), 1400)
	}

	return (
		<>
			<div className='flex items-center gap-4 border-b p-5 pr-12'>
				<UserAvatarCell user={user} size='lg' />
				<div className='min-w-0'>
					<SheetTitle className='truncate font-space-grotesk text-xl font-bold tracking-tight'>{title}</SheetTitle>
					<SheetDescription className='truncate text-xs'>{user.email}</SheetDescription>
				</div>
			</div>

			<div className='flex-1 space-y-6 overflow-y-auto p-5'>
				<dl className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border text-sm'>
					<Cell label="Ro'yxatdan o'tgan">{formatDate(user.createdAt)}</Cell>
					<Cell label='Oxirgi kirish'>
						<span suppressHydrationWarning>{user.lastSignInAt ? formatRelative(user.lastSignInAt) : "ma'lumot yo'q"}</span>
					</Cell>
					<Cell label='Username'>{user.username ? `@${user.username}` : '—'}</Cell>
					<Cell label='Manzillar'>
						<span className='inline-flex items-center gap-1'>
							<MapPin className='size-3.5 text-muted-foreground' />
							{user.addressCount} ta{user.city ? ` · ${user.city}` : ''}
						</span>
					</Cell>
				</dl>

				<div className='space-y-1.5'>
					<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>Clerk ID</p>
					<button
						type='button'
						onClick={copyId}
						className='flex w-full items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2 font-mono text-xs transition-colors hover:bg-muted'
					>
						<span className='truncate'>{user.id}</span>
						{copied ? <Check className='size-3.5 shrink-0 text-emerald-600' /> : <Copy className='size-3.5 shrink-0 text-muted-foreground' />}
					</button>
				</div>

				<RoleControl user={user} isSelf={isSelf} isLastAdmin={user.role === 'admin' && adminCount <= 1} onDone={onDone} />
			</div>
		</>
	)
}

/** Rol: ikki karta (Mijoz/Admin); admin berish/olish ikki bosqichda tasdiqlanadi */
const RoleControl = ({ user, isSelf, isLastAdmin, onDone }: { user: AdminUserRow; isSelf: boolean; isLastAdmin: boolean; onDone: (text: string) => void }) => {
	const [pending, startTransition] = useTransition()
	const [target, setTarget] = useState<UserRole | null>(null)
	const [error, setError] = useState('')
	const locked = isSelf || isLastAdmin

	const confirm = () => {
		if (!target) return
		setError('')
		startTransition(async () => {
			const result = await setUserRole(user.id, target)
			if (result.ok) onDone(target === 'admin' ? `${user.email} endi admin` : `${user.email} endi mijoz`)
			else setError(result.error)
		})
	}

	return (
		<section className='space-y-3'>
			<h3 className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>Rol</h3>
			<div className='grid gap-2' role='radiogroup' aria-label='Rol'>
				{(['customer', 'admin'] as const).map(role => {
					const current = user.role === role
					const chosen = target === role
					const Icon = role === 'admin' ? ShieldCheck : UserRound
					return (
						<button
							key={role}
							type='button'
							role='radio'
							aria-checked={current}
							disabled={current || locked || pending}
							onClick={() => setTarget(role)}
							className={cn(
								'flex items-start gap-3 rounded-xl border p-3 text-left transition-colors disabled:cursor-default',
								current ? 'border-foreground bg-foreground/[0.03] ring-1 ring-foreground' : 'hover:bg-muted/40 disabled:opacity-50',
								chosen && 'border-amber-500 ring-1 ring-amber-500'
							)}
						>
							<span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg border', current && 'bg-foreground text-background')}>
								<Icon className='size-4' />
							</span>
							<span className='min-w-0 flex-1'>
								<span className='flex items-center gap-2 text-sm font-medium'>
									{ROLE_META[role].label}
									{current && <span className='font-mono text-[10px] text-muted-foreground'>joriy</span>}
								</span>
								<span className='block text-xs text-muted-foreground'>{ROLE_META[role].hint}</span>
							</span>
						</button>
					)
				})}
			</div>

			{locked && (
				<p className='text-xs text-muted-foreground'>
					{isSelf ? "Bu sizning akkauntingiz — o'z admin rolingizni olib bo'lmaydi." : 'Bu yagona admin — avval boshqa foydalanuvchini admin qiling.'}
				</p>
			)}

			{target && !locked && (
				<div
					className={cn(
						'space-y-3 rounded-xl border p-3 animate-in fade-in slide-in-from-top-1',
						target === 'admin' ? 'border-amber-500/40 bg-amber-500/5' : 'bg-muted/30'
					)}
				>
					<p className='text-sm'>
						{target === 'admin' ? (
							<>
								<span className='font-medium'>{user.email}</span> admin panelga to&apos;liq kirish huquqini oladi — buyurtmalar, katalog
								va boshqa foydalanuvchilar rollari ham.
							</>
						) : (
							<>
								<span className='font-medium'>{user.email}</span> admin paneldan chiqariladi va oddiy mijoz bo&apos;ladi.
							</>
						)}
					</p>
					{error && <p className='text-xs text-destructive' role='alert'>{error}</p>}
					<div className='flex gap-2'>
						<Button variant='outline' disabled={pending} onClick={() => setTarget(null)}>
							Bekor
						</Button>
						<Button variant={target === 'admin' ? 'default' : 'destructive'} className='flex-1' disabled={pending} onClick={confirm}>
							{pending && <Loader2 className='animate-spin' />}
							{target === 'admin' ? 'Ha, admin qilish' : 'Ha, mijoz qilish'}
						</Button>
					</div>
				</div>
			)}
		</section>
	)
}

const Cell = ({ label, children }: { label: string; children: ReactNode }) => (
	<div className='bg-background p-3'>
		<dt className='text-xs text-muted-foreground'>{label}</dt>
		<dd className='mt-0.5 truncate font-medium'>{children}</dd>
	</div>
)

export default UserSheet
