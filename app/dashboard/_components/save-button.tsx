import { Check, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'

export type SaveState = 'idle' | 'saving' | 'saved'

interface SaveButtonProps {
	state: SaveState
	disabled?: boolean
	children?: ReactNode
	variant?: 'default' | 'destructive'
}

/** Saqlash tugmasi: jarayonda spinner, muvaffaqiyatdan keyin bir lahza "Saqlandi" */
const SaveButton = ({ state, disabled, children = 'Saqlash', variant = 'default' }: SaveButtonProps) => {
	return (
		<Button type='submit' variant={variant} disabled={disabled || state === 'saving'} className='min-w-24'>
			{state === 'saving' && <Loader2 className='animate-spin' />}
			{state === 'saved' ? (
				<>
					<Check />
					Saqlandi
				</>
			) : (
				children
			)}
		</Button>
	)
}

export default SaveButton
