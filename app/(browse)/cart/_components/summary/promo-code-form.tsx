'use client'

import { Tag, X } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/lib/store'

const PromoCodeForm = () => {
	const promo = useStore(state => state.promo)
	const applyPromo = useStore(state => state.applyPromo)
	const removePromo = useStore(state => state.removePromo)
	const [code, setCode] = useState('')
	const [error, setError] = useState(false)

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()
		if (applyPromo(code)) {
			setCode('')
			setError(false)
		} else {
			setError(true)
		}
	}

	if (promo) {
		return (
			<div className='flex items-center justify-between rounded-lg border border-dashed border-emerald-500/50 bg-emerald-500/5 px-3 py-2'>
				<p className='flex items-center gap-2 font-mono text-xs'>
					<Tag className='size-3.5 text-emerald-600' />
					<span className='font-semibold'>{promo.code}</span>
					<span className='text-muted-foreground'>· -{promo.percent}%</span>
				</p>
				<button
					type='button'
					onClick={removePromo}
					aria-label='Promo-kodni olib tashlash'
					className='flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground'
				>
					<X className='size-3.5' />
				</button>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-1.5'>
			<div className='flex gap-2'>
				<Input
					value={code}
					onChange={event => {
						setCode(event.target.value)
						setError(false)
					}}
					placeholder='Promo-kod'
					aria-label='Promo-kod'
					aria-invalid={error}
					className='h-9 font-mono uppercase placeholder:normal-case'
				/>
				<Button type='submit' variant='outline' className='h-9' disabled={!code.trim()}>
					Qo&apos;llash
				</Button>
			</div>
			<p className='font-mono text-[11px] text-muted-foreground'>
				{error ? (
					<span className='text-destructive'>Bunday kod topilmadi</span>
				) : (
					<>
						Sinab ko&apos;ring: <span className='text-foreground'>ORMO10</span>
					</>
				)}
			</p>
		</form>
	)
}

export default PromoCodeForm
