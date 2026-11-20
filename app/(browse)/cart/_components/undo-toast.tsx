import { RotateCcw } from 'lucide-react'

type Props = {
	name: string
	onUndo: () => void
	/** Toast ko'rinib turadigan vaqt — pastdagi chiziq shu vaqt ichida tugaydi */
	durationMs: number
}

/** "X olib tashlandi — Qaytarish": o'chirishni bekor qilish imkoniyati */
const UndoToast = ({ name, onUndo, durationMs }: Props) => {
	return (
		<div
			role='status'
			className='animate-in fade-in slide-in-from-bottom-4 fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md overflow-hidden rounded-xl border bg-foreground text-background shadow-2xl duration-300 sm:inset-x-auto sm:right-6 sm:bottom-6'
		>
			<div className='flex items-center justify-between gap-4 px-4 py-3'>
				<p className='min-w-0 truncate text-sm'>
					<span className='font-medium'>{name}</span>
					<span className='text-background/60'> olib tashlandi</span>
				</p>
				<button
					type='button'
					onClick={onUndo}
					className='flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs font-semibold text-orange-300 transition-colors hover:bg-background/10'
				>
					<RotateCcw className='size-3.5' />
					Qaytarish
				</button>
			</div>
			{/* Qolgan vaqt — chiziq qisqarib boradi */}
			<span
				aria-hidden
				className='block h-0.5 origin-left bg-linear-to-r from-orange-500 to-rose-500 motion-safe:animate-shrink'
				style={{ animationDuration: `${durationMs}ms` }}
			/>
		</div>
	)
}

export default UndoToast
