'use client'

import { Check, Loader2, Pencil, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type Address, formatPhone } from '../_lib/types'
import { LABEL_ICONS } from './label-icons'

/** ID'dan har doim bir xil "shtrix-kod" chiziqlari (bezak) */
const Barcode = ({ seed }: { seed: string }) => {
	const bars = Array.from(seed.repeat(2).slice(0, 28), char => (char.charCodeAt(0) % 3) + 1)

	return (
		<div aria-hidden className='flex h-6 items-stretch gap-px opacity-70'>
			{bars.map((width, index) => (
				<span key={index} className='bg-foreground' style={{ width }} />
			))}
		</div>
	)
}

interface AddressCardProps {
	address: Address
	index: number
	busy: boolean
	onEdit: () => void
	onDelete: () => void
	onMakeDefault: () => void
}

/** Manzil — yetkazish yorlig'i ko'rinishida */
const AddressCard = ({ address, index, busy, onEdit, onDelete, onMakeDefault }: AddressCardProps) => {
	const [confirming, setConfirming] = useState(false)
	const Icon = LABEL_ICONS[address.label]

	return (
		<article
			className={cn(
				'group relative flex flex-col border bg-background transition-shadow hover:shadow-[0_24px_48px_-32px_rgb(0_0_0/0.3)]',
				address.isDefault && 'border-foreground/60',
				busy && 'opacity-60'
			)}
		>
			{/* Yorliq "sarlavhasi" */}
			<header className='flex items-center justify-between gap-3 border-b border-dashed px-4 py-2.5'>
				<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>
					Ormo · Yetkazish № {String(index + 1).padStart(2, '0')}
				</p>
				{address.isDefault ? (
					<span className='inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium text-background'>
						<Star className='size-3 fill-current' />
						Asosiy
					</span>
				) : (
					<button
						type='button'
						disabled={busy}
						onClick={onMakeDefault}
						className='text-[11px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline disabled:pointer-events-none'
					>
						Asosiy qilish
					</button>
				)}
			</header>

			<div className='flex flex-1 gap-4 p-4'>
				<span className='flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40'>
					<Icon className='size-4' />
				</span>
				<div className='min-w-0 space-y-1'>
					<p className='flex items-center gap-2'>
						<span className='font-medium'>{address.label}</span>
						<span className='text-muted-foreground/60'>·</span>
						<span className='truncate text-sm text-muted-foreground'>{address.fullName}</span>
					</p>
					<p className='text-sm leading-relaxed text-pretty'>{address.street}</p>
					<p className='text-sm text-muted-foreground'>
						{address.city}, {address.region}
					</p>
					<p className='pt-1 font-mono text-xs text-muted-foreground'>{formatPhone(address.phone)}</p>
				</div>
			</div>

			<footer className='flex items-center justify-between gap-2 border-t px-4 py-2'>
				<Barcode seed={address.id} />

				{confirming ? (
					<div className='animate-in fade-in slide-in-from-right-1 flex items-center gap-1'>
						<span className='mr-1 text-xs text-muted-foreground'>O&apos;chirilsinmi?</span>
						<Button size='sm' variant='ghost' onClick={() => setConfirming(false)}>
							Yo&apos;q
						</Button>
						<Button
							size='sm'
							variant='destructive'
							disabled={busy}
							onClick={() => {
								setConfirming(false)
								onDelete()
							}}
						>
							{busy ? <Loader2 className='animate-spin' /> : <Check />}
							Ha
						</Button>
					</div>
				) : (
					<div className='flex items-center gap-1'>
						<Button size='icon-sm' variant='ghost' aria-label='Tahrirlash' disabled={busy} onClick={onEdit}>
							<Pencil />
						</Button>
						<Button
							size='icon-sm'
							variant='ghost'
							aria-label="O'chirish"
							disabled={busy}
							onClick={() => setConfirming(true)}
							className='hover:bg-destructive/10 hover:text-destructive'
						>
							{busy ? <Loader2 className='animate-spin' /> : <Trash2 />}
						</Button>
					</div>
				)}
			</footer>
		</article>
	)
}

export default AddressCard
