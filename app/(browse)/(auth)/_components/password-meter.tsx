import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { PASSWORD_MIN_LENGTH } from '../_lib/constants'

/** Parol uzunligini minimal talabga nisbatan ko'rsatuvchi ingichka chiziq */
const PasswordMeter = ({ value }: { value: string }) => {
	const progress = Math.min(value.length / PASSWORD_MIN_LENGTH, 1)
	const done = progress === 1

	return (
		<div className='space-y-1.5'>
			<div className='h-0.5 overflow-hidden rounded-full bg-muted'>
				<div
					className={cn(
						'h-full rounded-full transition-all duration-300',
						done ? 'bg-emerald-500' : 'bg-foreground'
					)}
					style={{ width: `${progress * 100}%` }}
				/>
			</div>
			<p className={cn('flex items-center gap-1', done && 'text-emerald-600')}>
				{done && <Check className='size-3' />}
				Kamida {PASSWORD_MIN_LENGTH} ta belgi
				<span className='ml-auto font-mono tabular-nums'>
					{Math.min(value.length, PASSWORD_MIN_LENGTH)}/{PASSWORD_MIN_LENGTH}
				</span>
			</p>
		</div>
	)
}

export default PasswordMeter
