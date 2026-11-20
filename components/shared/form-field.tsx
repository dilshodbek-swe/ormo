import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'

interface FormFieldProps {
	id: string
	label: string
	error?: string
	hint?: ReactNode
	/** Label yonidagi qo'shimcha element (masalan, "Parolni unutdingizmi?") */
	action?: ReactNode
	children: ReactNode
}

/** Label + input + xato/izoh. Xato bo'lsa izoh o'rniga xato ko'rsatiladi. */
const FormField = ({ id, label, error, hint, action, children }: FormFieldProps) => {
	return (
		<div className='space-y-2'>
			<div className='flex items-center justify-between gap-2'>
				<Label htmlFor={id}>{label}</Label>
				{action}
			</div>
			{children}
			{error ? (
				<p id={`${id}-error`} role='alert' className='animate-in fade-in text-xs text-destructive'>
					{error}
				</p>
			) : (
				hint && <div className='text-xs text-muted-foreground'>{hint}</div>
			)}
		</div>
	)
}

export default FormField
