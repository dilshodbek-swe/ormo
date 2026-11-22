import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { AddressLabel } from '../../_lib/types'
import { LABEL_ICONS } from '../label-icons'

interface AddressPinProps {
	label: AddressLabel
	active?: boolean
	isDefault?: boolean
	/** Yangi nuqta (dialogdagi tanlov) — "tomchi" ko'rinish */
	variant?: 'address' | 'draft'
	className?: string
}

/**
 * Xaritadagi belgi — Ormo logotipidagi "romb" shaklida, ichida yorliq ikonkasi.
 * Uchi aynan nuqtaga to'g'ri keladi (AdvancedMarker pastki markazga bog'laydi).
 */
const AddressPin = ({ label, active, isDefault, variant = 'address', className }: AddressPinProps) => {
	const Icon = LABEL_ICONS[label]

	return (
		<div className={cn('relative flex flex-col items-center pb-1', className)}>
			<div
				className={cn(
					'relative flex size-9 items-center justify-center transition-transform duration-300 ease-out',
					active && 'scale-125'
				)}
			>
				{/* Faol belgining atrofida to'lqin */}
				{(active || variant === 'draft') && (
					<span className='absolute inset-0 animate-ping rounded-[10px] bg-foreground/25' />
				)}
				<span
					className={cn(
						'absolute inset-0.5 rotate-45 rounded-[9px] border-2 shadow-[0_8px_20px_-6px_rgb(0_0_0/0.5)] transition-colors',
						active || variant === 'draft'
							? 'border-background bg-foreground'
							: 'border-foreground bg-background'
					)}
				/>
				<Icon
					className={cn(
						'relative size-4',
						active || variant === 'draft' ? 'text-background' : 'text-foreground'
					)}
				/>
				{isDefault && (
					<span className='absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-amber-400 ring-2 ring-background'>
						<Star className='size-2.5 fill-amber-900 text-amber-900' />
					</span>
				)}
			</div>
			{/* "Oyoqcha" — nuqtani aniq ko'rsatadi */}
			<span className='-mt-0.5 h-2 w-0.5 rounded-full bg-foreground' />
			<span className='h-1 w-3 rounded-full bg-black/25 blur-[2px]' />
		</div>
	)
}

export default AddressPin
