'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

/** Ikki bosqichli tozalash: avval "Tozalash", so'ng "Rostdanmi? Ha / Yo'q" */
const ClearCartButton = ({ onConfirm }: { onConfirm: () => void }) => {
	const [confirming, setConfirming] = useState(false)

	if (confirming) {
		return (
			<div className='animate-in fade-in flex items-center gap-2 font-mono text-xs duration-200'>
				<span className='text-muted-foreground'>Rostdanmi?</span>
				<button
					type='button'
					onClick={() => {
						onConfirm()
						setConfirming(false)
					}}
					className='rounded-md bg-destructive/10 px-2 py-1 font-semibold text-destructive transition-colors hover:bg-destructive/20'
				>
					Ha, tozalash
				</button>
				<button
					type='button'
					onClick={() => setConfirming(false)}
					className='rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
				>
					Yo&apos;q
				</button>
			</div>
		)
	}

	return (
		<button
			type='button'
			onClick={() => setConfirming(true)}
			className='flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-destructive'
		>
			<Trash2 className='size-3.5' />
			Savatni tozalash
		</button>
	)
}

export default ClearCartButton
