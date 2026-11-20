import { Minus, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

interface QuantityStepperProps {
	value: number
	max: number
	onChange: (value: number) => void
	/** sm — savat qatorlari uchun ixcham variant */
	size?: 'sm' | 'default'
	className?: string
}

const QuantityStepper = ({ value, max, onChange, size = 'default', className }: QuantityStepperProps) => {
	return (
		<div
			className={cn(
				'flex items-center rounded-lg border',
				size === 'sm' ? 'h-9' : 'h-11',
				className
			)}
		>
			<button
				type='button'
				onClick={() => onChange(value - 1)}
				disabled={value <= 1}
				aria-label='Kamaytirish'
				className='flex h-full w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30'
			>
				<Minus className='size-4' />
			</button>
			<span
				aria-live='polite'
				className='w-8 text-center font-mono text-sm font-semibold tabular-nums'
			>
				{value}
			</span>
			<button
				type='button'
				onClick={() => onChange(value + 1)}
				disabled={value >= max}
				aria-label="Ko'paytirish"
				className='flex h-full w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30'
			>
				<Plus className='size-4' />
			</button>
		</div>
	)
}

export default QuantityStepper
