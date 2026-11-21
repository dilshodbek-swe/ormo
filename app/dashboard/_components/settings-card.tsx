import type { FormEventHandler, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface SettingsCardProps {
	title: string
	description?: ReactNode
	children?: ReactNode
	/** Pastki chiziqdagi izoh (chapda) */
	hint?: ReactNode
	/** Pastki chiziqdagi amal (o'ngda), odatda "Saqlash" tugmasi */
	action?: ReactNode
	/** Berilsa, karta <form> sifatida render bo'ladi */
	onSubmit?: FormEventHandler<HTMLFormElement>
	tone?: 'default' | 'danger'
	className?: string
}

/**
 * Vercel sozlamalaridagi kabi karta: sarlavha, tavsif va kontent,
 * pastda esa izoh + amal joylashgan alohida chiziq.
 */
const SettingsCard = ({
	title,
	description,
	children,
	hint,
	action,
	onSubmit,
	tone = 'default',
	className,
}: SettingsCardProps) => {
	const danger = tone === 'danger'
	const content = (
		<>
			<div className='space-y-4 p-5 sm:p-6'>
				<div className='space-y-1.5'>
					<h2 className='font-space-grotesk text-xl font-bold tracking-tight'>{title}</h2>
					{description && (
						<p className='text-sm leading-relaxed text-muted-foreground'>{description}</p>
					)}
				</div>
				{children}
			</div>
			{(hint || action) && (
				<div
					className={cn(
						'flex flex-col gap-3 border-t px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6',
						danger ? 'border-destructive/30 bg-destructive/5' : 'bg-muted/40'
					)}
				>
					<div className='text-sm text-muted-foreground'>{hint}</div>
					{action && <div className='flex shrink-0 gap-2'>{action}</div>}
				</div>
			)}
		</>
	)

	const classes = cn(
		'border bg-background',
		danger && 'border-destructive/40',
		className
	)

	return onSubmit ? (
		<form noValidate onSubmit={onSubmit} className={classes}>
			{content}
		</form>
	) : (
		<section className={classes}>{content}</section>
	)
}

export default SettingsCard
