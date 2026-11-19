import { Equal, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

/** Tenglamadagi "+" yoki "=" belgisi */
const BundleOperator = ({ type, className }: { type: 'plus' | 'equals'; className?: string }) => {
	const Icon = type === 'plus' ? Plus : Equal

	return (
		<span
			aria-hidden
			className={cn(
				'flex size-8 shrink-0 items-center justify-center self-center rounded-full lg:size-10',
				type === 'plus'
					? 'border bg-background text-muted-foreground'
					: 'bg-linear-to-br from-amber-300 via-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30',
				className
			)}
		>
			<Icon className='size-4' strokeWidth={2.5} />
		</span>
	)
}

export default BundleOperator
