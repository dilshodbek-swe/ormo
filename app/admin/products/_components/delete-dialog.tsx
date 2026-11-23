'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { AdminProduct } from '../_lib/types'
import { ProductImg } from './product-bits'

interface DeleteDialogProps {
	product: AdminProduct | null
	onClose: () => void
	onConfirm: (product: AdminProduct) => void
}

/** Vercel'dagi kabi: o'chirishni tasdiqlash uchun mahsulot nomini yozish kerak */
const DeleteDialog = ({ product, onClose, onConfirm }: DeleteDialogProps) => (
	<Dialog open={Boolean(product)} onOpenChange={open => !open && onClose()}>
		<DialogContent className='gap-0 overflow-hidden p-0 sm:max-w-md' showCloseButton={false}>
			{product && <DeleteForm key={product.id} product={product} onClose={onClose} onConfirm={onConfirm} />}
		</DialogContent>
	</Dialog>
)

const DeleteForm = ({ product, onClose, onConfirm }: { product: AdminProduct; onClose: () => void; onConfirm: (product: AdminProduct) => void }) => {
	const [typed, setTyped] = useState('')
	const matches = typed.trim() === product.name.trim()
	const cover = product.images[0]

	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				if (matches) onConfirm(product)
			}}
		>
			<div className='space-y-4 p-5'>
				<div className='flex items-center gap-3'>
					<span className='flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
						<Trash2 className='size-4' />
					</span>
					<div>
						<DialogTitle className='font-space-grotesk text-lg font-bold tracking-tight'>Mahsulotni o&apos;chirish</DialogTitle>
						<DialogDescription className='text-xs'>Bu amalni ortga qaytarib bo&apos;lmaydi.</DialogDescription>
					</div>
				</div>

				<div className='flex items-center gap-3 rounded-lg border bg-muted/30 p-3'>
					<span className='relative size-12 shrink-0 overflow-hidden rounded-md border bg-background'>
						{cover && <ProductImg url={cover.url} sizes='48px' className='p-1' />}
					</span>
					<div className='min-w-0 text-sm'>
						<p className='truncate font-medium'>{product.name}</p>
						<p className='truncate font-mono text-xs text-muted-foreground'>
							{product.brand} · {product.images.length} ta rasm · {product.stock} dona omborda
						</p>
					</div>
				</div>

				<p className='text-sm text-muted-foreground'>
					Mahsulot, uning barcha rasmlari va ombor ma&apos;lumoti o&apos;chiriladi. Faqat yashirish kerak bo&apos;lsa —{' '}
					<span className='font-medium text-foreground'>arxivlang</span>.
				</p>

				<label className='block space-y-2 text-sm'>
					<span>
						Tasdiqlash uchun <span className='rounded bg-muted px-1 font-mono font-medium select-all'>{product.name}</span> deb yozing:
					</span>
					<Input value={typed} onChange={event => setTyped(event.target.value)} autoFocus autoComplete='off' className='h-9 font-mono' />
				</label>
			</div>

			<div className='flex justify-end gap-2 border-t bg-muted/30 p-4'>
				<Button type='button' variant='outline' onClick={onClose}>
					Bekor qilish
				</Button>
				<Button type='submit' variant='destructive' disabled={!matches}>
					O&apos;chirish
				</Button>
			</div>
		</form>
	)
}

export default DeleteDialog
