'use client'

import { Check, ShoppingBag } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import QuantityStepper from '@/components/shared/quantity-stepper'
import { Button } from '@/components/ui/button'
import useCart from '@/lib/cart/use-cart'
import type { ProductWithDetails } from '@/lib/data/product-details'
import { formatPrice } from '@/lib/utils'

/** Miqdor tanlash va savatga qo'shish — savatdagi mavjud sonni hisobga oladi */
const ProductPurchase = ({ product }: { product: ProductWithDetails }) => {
	const { add, quantityOf } = useCart()
	const [quantity, setQuantity] = useState(1)
	const [added, setAdded] = useState(false)
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => () => clearTimeout(timer.current), [])

	const inCart = quantityOf(product.id)
	// Ombordan ortiq qo'shib bo'lmaydi
	const available = Math.max(0, product.stock - inCart)
	const clamped = Math.min(quantity, Math.max(available, 1))

	const handleAdd = () => {
		add(product.id, clamped)
		setQuantity(1)
		setAdded(true)
		clearTimeout(timer.current)
		timer.current = setTimeout(() => setAdded(false), 1600)
	}

	return (
		<div className='space-y-3'>
			<div className='flex gap-2'>
				<QuantityStepper value={clamped} max={available} onChange={setQuantity} />
				<Button
					size='lg'
					onClick={handleAdd}
					disabled={available === 0}
					className='h-11 flex-1 justify-between px-4'
				>
					<span className='flex items-center gap-2'>
						{added ? <Check /> : <ShoppingBag />}
						{added ? "Qo'shildi" : available === 0 ? 'Savatda hammasi' : 'Savatga'}
					</span>
					{available > 0 && (
						<span className='hidden font-mono text-xs tabular-nums opacity-70 sm:inline'>
							{formatPrice(product.price * clamped)}
						</span>
					)}
				</Button>
			</div>

			<p className='h-4 font-mono text-xs text-muted-foreground'>
				{inCart > 0 && `Savatda: ${inCart} dona`}
			</p>
		</div>
	)
}

export default ProductPurchase
