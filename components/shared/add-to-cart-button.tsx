'use client'

import { Check, ShoppingBag } from 'lucide-react'
import { type ComponentProps, type ReactNode, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'

interface AddToCartButtonProps
	extends Omit<ComponentProps<typeof Button>, 'onClick' | 'children'> {
	/** Bitta mahsulot yoki to'plam (bir nechta) */
	productIds: string | string[]
	children?: ReactNode
}

/**
 * Savatga qo'shuvchi to'liq tugma: bosilganda bir lahza "Qo'shildi ✓" ko'rsatadi.
 * Uslubi (rang, o'lcham) `className` va `size` orqali joyiga qarab beriladi.
 */
const AddToCartButton = ({ productIds, children = 'Savatga', ...props }: AddToCartButtonProps) => {
	const addToCart = useStore(state => state.addToCart)
	const [added, setAdded] = useState(false)
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => () => clearTimeout(timer.current), [])

	const handleClick = () => {
		for (const id of [productIds].flat()) addToCart(id)
		setAdded(true)
		clearTimeout(timer.current)
		timer.current = setTimeout(() => setAdded(false), 1400)
	}

	return (
		<Button {...props} onClick={handleClick}>
			{added ? <Check /> : <ShoppingBag />}
			{added ? "Qo'shildi" : children}
		</Button>
	)
}

export default AddToCartButton
