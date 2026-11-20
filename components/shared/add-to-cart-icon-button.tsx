'use client'

import { Check, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface AddToCartIconButtonProps {
	productId: string
	productName: string
	className?: string
}

/** Kartadagi kichik "+" tugma: bosilganda savatga qo'shadi va bir lahza "✓" ko'rsatadi */
const AddToCartIconButton = ({ productId, productName, className }: AddToCartIconButtonProps) => {
	const addToCart = useStore(state => state.addToCart)
	const [added, setAdded] = useState(false)
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => () => clearTimeout(timer.current), [])

	const handleClick = () => {
		addToCart(productId)
		setAdded(true)
		clearTimeout(timer.current)
		timer.current = setTimeout(() => setAdded(false), 1200)
	}

	return (
		<Button
			variant='outline'
			size='icon-sm'
			onClick={handleClick}
			aria-label={`${productName} — savatga qo'shish`}
			className={cn(
				'rounded-full backdrop-blur',
				added ? 'border-foreground bg-foreground text-background' : 'bg-background/90',
				className
			)}
		>
			{added ? <Check /> : <Plus />}
		</Button>
	)
}

export default AddToCartIconButton
