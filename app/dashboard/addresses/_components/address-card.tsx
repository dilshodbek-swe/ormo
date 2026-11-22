'use client'

import { ArrowUpRight, Check, Loader2, MapPinOff, Pencil, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type Address, formatPhone } from '../_lib/types'
import { LABEL_ICONS } from './label-icons'
import { formatCoords, googleMapsUrl } from './map/maps-config'

/** ID'dan har doim bir xil "shtrix-kod" chiziqlari (bezak) */
const Barcode = ({ seed }: { seed: string }) => {
	const bars = Array.from(seed.repeat(2).slice(0, 24), char => (char.charCodeAt(0) % 3) + 1)

	return (
		<div aria-hidden className='flex h-5 items-stretch gap-px opacity-60'>
			{bars.map((width, index) => (
				<span key={index} className='bg-foreground' style={{ width }} />
			))}
		</div>
	)
}

interface AddressCardProps {
	address: Address
	index: number
	active: boolean
	busy: boolean
	onSelect: () => void
	onHover: (hovering: boolean) => void
	onEdit: () => void
	onDelete: () => void
	onMakeDefault: () => void
}

/** Manzil — yetkazish yorlig'i ko'rinishida; bosilganda xaritada belgilanadi */
const AddressCard = ({
	address,
	index,
	active,
	busy,
	onSelect,
	onHover,
	onEdit,
	onDelete,
	onMakeDefault,
}: AddressCardProps) => {
	const [confirming, setConfirming] = useState(false)
	const Icon = LABEL_ICONS[address.label]

	return (
		<article
			onMouseEnter={() => onHover(true)}
			onMouseLeave={() => onHover(false)}
			className={cn(
				'group relative flex flex-col border bg-background transition-[box-shadow,border-color] duration-300',
				active
					? 'border-foreground shadow-[0_24px_48px_-28px_rgb(0_0_0/0.35)]'
					: 'hover:border-foreground/30',
				busy && 'opacity-60'
			)}
		>
			{/* Faol kartaning chap chizig'i */}
			<span
				aria-hidden
				className={cn(
					'absolute inset-y-0 -left-px w-0.5 origin-top bg-foreground transition-transform duration-300',
					active ? 'scale-y-100' : 'scale-y-0'
				)}
			/>

			<header className='flex items-center justify-between gap-3 border-b border-dashed px-4 py-2'>
				<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>
					Yetkazish № {String(index + 1).padStart(2, '0')}
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

			{/* Asosiy qism — bosilganda xaritada ko'rsatiladi */}
			<button
				type='button'
				onClick={onSelect}
				aria-pressed={active}
				className='flex flex-1 gap-4 p-4 text-left outline-none focus-visible:bg-muted/40'
			>
				<span
					className={cn(
						'flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors',
						active ? 'border-foreground bg-foreground text-background' : 'bg-muted/40'
					)}
				>
					<Icon className='size-4' />
				</span>
				<span className='min-w-0 space-y-1'>
					<span className='flex items-center gap-2'>
						<span className='font-medium'>{address.label}</span>
						<span className='text-muted-foreground/60'>·</span>
						<span className='truncate text-sm text-muted-foreground'>{address.fullName}</span>
					</span>
					<span className='block text-sm leading-relaxed text-pretty'>{address.street}</span>
					<span className='block text-sm text-muted-foreground'>
						{address.city}, {address.region}
					</span>
					<span className='block pt-1 font-mono text-xs text-muted-foreground'>{formatPhone(address.phone)}</span>
				</span>
			</button>

			<footer className='flex items-center justify-between gap-2 border-t px-4 py-2'>
				{address.location ? (
					<a
						href={googleMapsUrl(address.location)}
						target='_blank'
						rel='noreferrer'
						className='group/link inline-flex min-w-0 items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground'
					>
						<span className='truncate'>{formatCoords(address.location)}</span>
						<ArrowUpRight className='size-3 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5' />
					</a>
				) : (
					<button
						type='button'
						onClick={onEdit}
						className='inline-flex items-center gap-1.5 text-[11px] text-amber-700 transition-colors hover:text-amber-900 dark:text-amber-400'
					>
						<MapPinOff className='size-3.5' />
						Xaritada belgilash
					</button>
				)}

				{confirming ? (
					<div className='animate-in fade-in slide-in-from-right-1 flex shrink-0 items-center gap-1'>
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
					<div className='flex shrink-0 items-center gap-1'>
						<Barcode seed={address.id} />
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
