'use client'

import { Eye, EyeOff } from 'lucide-react'
import { type ComponentProps, useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/** Ko'rsatish/yashirish tugmasi bor parol maydoni */
const PasswordInput = ({ className, ...props }: Omit<ComponentProps<'input'>, 'type'>) => {
	const [visible, setVisible] = useState(false)

	return (
		<div className='relative'>
			<Input
				type={visible ? 'text' : 'password'}
				className={cn('h-10 pr-10', className)}
				{...props}
			/>
			<button
				type='button'
				onClick={() => setVisible(value => !value)}
				aria-label={visible ? 'Parolni yashirish' : "Parolni ko'rsatish"}
				aria-pressed={visible}
				className='absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground'
			>
				{visible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
			</button>
		</div>
	)
}

export default PasswordInput
