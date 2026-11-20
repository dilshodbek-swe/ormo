import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface AuthCardProps {
	title: string
	description?: ReactNode
	/** Sarlavha ustidagi kichik belgi (ikonka) */
	icon?: ReactNode
	children: ReactNode
	/** Karta pastidagi ajratilgan qism — odatda "Akkauntingiz yo'qmi?" havolasi */
	footer?: ReactNode
	className?: string
}

/** Har bir auth bosqichi uchun bir xil sarlavha + tana + pastki qism tuzilmasi */
const AuthCard = ({ title, description, icon, children, footer, className }: AuthCardProps) => {
	return (
		<div className={cn('animate-in fade-in slide-in-from-bottom-2 duration-500', className)}>
			<div className='space-y-6 p-6 sm:p-8'>
				<header className='space-y-2'>
					{icon && (
						<span className='mb-4 flex size-10 items-center justify-center rounded-full border bg-muted/50 [&_svg]:size-4.5'>
							{icon}
						</span>
					)}
					<h1 className='font-space-grotesk text-2xl font-bold tracking-tight'>{title}</h1>
					{description && (
						<p className='text-sm leading-relaxed text-muted-foreground'>{description}</p>
					)}
				</header>
				{children}
			</div>
			{footer && (
				<div className='border-t bg-muted/30 px-6 py-4 text-center text-sm text-muted-foreground sm:px-8'>
					{footer}
				</div>
			)}
		</div>
	)
}

export default AuthCard
