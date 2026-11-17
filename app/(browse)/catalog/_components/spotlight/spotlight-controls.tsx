import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'

import { Button } from '@/components/ui/button'
import TimerRing from './timer-ring'

type Props = {
	current: number
	timer: CSSProperties
	onPrev: () => void
	onNext: () => void
}

const SpotlightControls = ({ current, timer, onPrev, onNext }: Props) => {
	return (
		<div className='flex gap-2'>
			<Button
				variant='outline'
				size='icon'
				className='rounded-full'
				onClick={onPrev}
				aria-label='Oldingi'
			>
				<ArrowLeft />
			</Button>

			{/* "Keyingi" tugmasi atrofida aylana taymer */}
			<div className='relative'>
				<TimerRing key={current} style={timer} />
				<Button
					variant='outline'
					size='icon'
					className='rounded-full'
					onClick={onNext}
					aria-label='Keyingi'
				>
					<ArrowRight />
				</Button>
			</div>
		</div>
	)
}

export default SpotlightControls
