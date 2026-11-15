import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface FloatingCardProps {
	children: ReactNode
	className?: string
	delay?: number
}

const FloatingCard = ({ children, className, delay = 0 }: FloatingCardProps) => {
	return (
		<div
			className={cn('absolute z-10 motion-safe:animate-float', className)}
			style={{ animationDelay: `${delay}s` }}
		>
			<div
				className='animate-in fade-in slide-in-from-bottom-2 fill-mode-both rounded-lg border bg-background/80 px-3 py-2 shadow-sm backdrop-blur-md duration-700'
				style={{ animationDelay: `${0.3 + delay * 0.2}s` }}
			>
				{children}
			</div>
		</div>
	)
}

export default FloatingCard
