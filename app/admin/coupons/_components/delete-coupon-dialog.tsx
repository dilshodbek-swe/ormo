'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import { type Coupon, describeValue } from '../_lib/types'

interface DeleteCouponDialogProps {
	coupon: Coupon | null
	onClose: () => void
	onConfirm: (coupon: Coupon) => void
	/** Ishlatilgan kuponni o'chirish o'rniga to'xtatish taklifi */
	onPause: (coupon: Coupon) => void
}

/** O'chirish — kodni yozib tasdiqlanadi; ishlatilgan kupon uchun "to'xtatish" muqobili taklif qilinadi */
const DeleteCouponDialog = ({ coupon, onClose, onConfirm, onPause }: DeleteCouponDialogProps) => (
	<Dialog open={Boolean(coupon)} onOpenChange={open => !open && onClose()}>
		<DialogContent className='gap-0 overflow-hidden p-0 sm:max-w-md' showCloseButton={false}>
			{coupon && <DeleteForm key={coupon.id} coupon={coupon} onClose={onClose} onConfirm={onConfirm} onPause={onPause} />}
		</DialogContent>
	</Dialog>
)

const DeleteForm = ({ coupon, onClose, onConfirm, onPause }: Omit<DeleteCouponDialogProps, 'coupon'> & { coupon: Coupon }) => {
	const [typed, setTyped] = useState('')
	const ready = typed.trim().toUpperCase() === coupon.code

	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				if (ready) onConfirm(coupon)
			}}
		>
			<div className='space-y-4 p-5'>
				<div className='flex items-center gap-3'>
					<span className='flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
						<Trash2 className='size-4' />
					</span>
					<div>
						<DialogTitle className='font-space-grotesk text-lg font-bold tracking-tight'>Kuponni o&apos;chirish</DialogTitle>
						<DialogDescription className='text-xs'>
							<span className='font-mono'>{coupon.code}</span> · {describeValue(coupon)}
						</DialogDescription>
					</div>
				</div>

				{coupon.uses > 0 && (
					<div className='space-y-2 rounded-lg border bg-muted/30 p-3 text-sm'>
						<p>
							Bu kupon <span className='font-medium'>{coupon.uses} marta</span> ishlatilgan va{' '}
							<span className='font-mono'>{formatPrice(coupon.revenue)}</span> savdo keltirgan. O&apos;chirilsa, statistikasi ham
							yo&apos;qoladi.
						</p>
						{!coupon.paused && (
							<button type='button' onClick={() => onPause(coupon)} className='text-xs font-medium underline underline-offset-4'>
								O&apos;rniga to&apos;xtatib qo&apos;yish
							</button>
						)}
					</div>
				)}

				<label className='block space-y-2 text-sm'>
					<span>
						Tasdiqlash uchun <span className='rounded bg-muted px-1 font-mono font-medium select-all'>{coupon.code}</span> deb yozing:
					</span>
					<Input value={typed} onChange={event => setTyped(event.target.value)} autoFocus autoComplete='off' className='h-9 font-mono uppercase' />
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

export default DeleteCouponDialog
