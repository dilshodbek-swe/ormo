import { CircleAlert } from 'lucide-react'

/** Maydonga tegishli bo'lmagan umumiy xato */
const FormAlert = ({ message }: { message?: string }) => {
	if (!message) return null

	return (
		<div
			role='alert'
			className='animate-in fade-in slide-in-from-top-1 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive'
		>
			<CircleAlert className='mt-0.5 size-4 shrink-0' />
			<p>{message}</p>
		</div>
	)
}

export default FormAlert
