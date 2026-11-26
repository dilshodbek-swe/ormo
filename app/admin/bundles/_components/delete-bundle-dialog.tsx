'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { AdminBundle } from '../_lib/types'
import BundleEquation from './bundle-equation'

interface DeleteBundleDialogProps {
	bundle: AdminBundle | null
	onClose: () => void
	onConfirm: (bundle: AdminBundle) => void
	onHide: (bundle: AdminBundle) => void
}

/** O'chirish — nomni yozib tasdiqlanadi; sotilgan to'plam uchun "yashirish" muqobili */
const DeleteBundleDialog = ({ bundle, onClose, onConfirm, onHide }: DeleteBundleDialogProps) => (
	<Dialog open={Boolean(bundle)} onOpenChange={open => !open && onClose()}>
		<DialogContent className='gap-0 overflow-hidden p-0 sm:max-w-md' showCloseButton={false}>
			{bundle && <DeleteForm key={bundle.id} bundle={bundle} onClose={onClose} onConfirm={onConfirm} onHide={onHide} />}
		</DialogContent>
	</Dialog>
)

const DeleteForm = ({ bundle, onClose, onConfirm, onHide }: Omit<DeleteBundleDialogProps, 'bundle'> & { bundle: AdminBundle }) => {
	const [typed, setTyped] = useState('')
	const ready = typed.trim() === bundle.name

	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				if (ready) onConfirm(bundle)
			}}
		>
			<div className='space-y-4 p-5'>
				<div className='flex items-center gap-3'>
					<span className='flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
						<Trash2 className='size-4' />
					</span>
					<div>
						<DialogTitle className='font-space-grotesk text-lg font-bold tracking-tight'>To&apos;plamni o&apos;chirish</DialogTitle>
						<DialogDescription className='text-xs'>Mahsulotlar o&apos;zi joyida qoladi — faqat to&apos;plam o&apos;chadi.</DialogDescription>
					</div>
				</div>

				<div className='rounded-lg border bg-muted/30 p-3'>
					<BundleEquation productIds={bundle.productIds} discount={bundle.discount} />
				</div>

				{bundle.sold > 0 && bundle.visible && (
					<p className='text-sm'>
						Bu to&apos;plam <span className='font-medium'>{bundle.sold} marta</span> sotilgan.{' '}
						<button type='button' onClick={() => onHide(bundle)} className='font-medium underline underline-offset-4'>
							O&apos;rniga yashirib qo&apos;yish
						</button>
					</p>
				)}

				<label className='block space-y-2 text-sm'>
					<span>
						Tasdiqlash uchun <span className='rounded bg-muted px-1 font-medium select-all'>{bundle.name}</span> deb yozing:
					</span>
					<Input value={typed} onChange={event => setTyped(event.target.value)} autoFocus autoComplete='off' className='h-9' />
				</label>
			</div>
			<div className='flex justify-end gap-2 border-t bg-muted/30 p-4'>
				<Button type='button' variant='outline' onClick={onClose}>
					Bekor qilish
				</Button>
				<Button type='submit' variant='destructive' disabled={!ready}>
					O&apos;chirish
				</Button>
			</div>
		</form>
	)
}

export default DeleteBundleDialog
