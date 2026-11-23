'use client'

import { ArrowRight, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { type AdminCategory, toneAt } from '../_lib/types'
import { CategoryImg } from './category-bits'

interface DeleteCategoryDialogProps {
	category: AdminCategory | null
	categories: AdminCategory[]
	productCount: (id: string) => number
	onClose: () => void
	/** moveTo — mahsulotlar ko'chiriladigan kategoriya (mahsulot bo'lmasa — undefined) */
	onConfirm: (category: AdminCategory, moveTo?: string) => void
}

/**
 * O'chirish: kategoriyada mahsulot bo'lsa, avval ular boshqa kategoriyaga ko'chiriladi
 * (mahsulot "egasiz" qolmasin). Tasdiqlash uchun manzil (slug) yoziladi.
 */
const DeleteCategoryDialog = ({ category, categories, productCount, onClose, onConfirm }: DeleteCategoryDialogProps) => (
	<Dialog open={Boolean(category)} onOpenChange={open => !open && onClose()}>
		<DialogContent className='gap-0 overflow-hidden p-0 sm:max-w-md' showCloseButton={false}>
			{category && (
				<DeleteForm
					key={category.id}
					category={category}
					others={categories.filter(item => item.id !== category.id)}
					allIds={categories.map(item => item.id)}
					count={productCount(category.id)}
					onClose={onClose}
					onConfirm={onConfirm}
				/>
			)}
		</DialogContent>
	</Dialog>
)

interface DeleteFormProps {
	category: AdminCategory
	others: AdminCategory[]
	allIds: string[]
	count: number
	onClose: () => void
	onConfirm: DeleteCategoryDialogProps['onConfirm']
}

const DeleteForm = ({ category, others, allIds, count, onClose, onConfirm }: DeleteFormProps) => {
	const [typed, setTyped] = useState('')
	const [target, setTarget] = useState(others[0]?.id ?? '')
	const needsMove = count > 0
	const blocked = needsMove && others.length === 0
	const ready = typed.trim() === category.id && !blocked && (!needsMove || target)

	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				if (ready) onConfirm(category, needsMove ? target : undefined)
			}}
		>
			<div className='space-y-4 p-5'>
				<div className='flex items-center gap-3'>
					<span className='flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
						<Trash2 className='size-4' />
					</span>
					<div>
						<DialogTitle className='font-space-grotesk text-lg font-bold tracking-tight'>Kategoriyani o&apos;chirish</DialogTitle>
						<DialogDescription className='text-xs'>Bu amalni ortga qaytarib bo&apos;lmaydi.</DialogDescription>
					</div>
				</div>

				{needsMove && (
					<div className='space-y-3 rounded-lg border bg-muted/30 p-3'>
						<p className='text-sm'>
							<span className='font-medium'>{count} ta mahsulot</span>{' '}
							<span className='text-muted-foreground'>shu kategoriyada. Ularni qayerga ko&apos;chiramiz?</span>
						</p>
						{blocked ? (
							<p className='text-sm text-destructive'>Boshqa kategoriya yo&apos;q — avval yangisini yarating.</p>
						) : (
							<div className='flex items-center gap-2'>
								<span className='relative size-10 shrink-0 overflow-hidden rounded-md border bg-white dark:bg-muted/40'>
									<CategoryImg image={category.image} sizes='40px' className='p-1' />
								</span>
								<ArrowRight className='size-4 shrink-0 text-muted-foreground' />
								<div className='grid flex-1 gap-1' role='radiogroup' aria-label="Ko'chiriladigan kategoriya">
									{others.map(item => (
										<button
											key={item.id}
											type='button'
											role='radio'
											aria-checked={target === item.id}
											onClick={() => setTarget(item.id)}
											className={cn(
												'flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-sm transition-colors',
												target === item.id ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background'
											)}
										>
											<span className={cn('size-2 rounded-[2px]', toneAt(allIds.indexOf(item.id)))} />
											{item.title}
											{!item.visible && <span className='ml-auto text-[10px]'>yashirin</span>}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				<label className='block space-y-2 text-sm'>
					<span>
						Tasdiqlash uchun <span className='rounded bg-muted px-1 font-mono font-medium select-all'>{category.id}</span> deb yozing:
					</span>
					<Input value={typed} onChange={event => setTyped(event.target.value)} autoFocus autoComplete='off' disabled={blocked} className='h-9 font-mono' />
				</label>
			</div>

			<div className='flex justify-end gap-2 border-t bg-muted/30 p-4'>
				<Button type='button' variant='outline' onClick={onClose}>
					Bekor qilish
				</Button>
				<Button type='submit' variant='destructive' disabled={!ready}>
					{needsMove ? "Ko'chirish va o'chirish" : "O'chirish"}
				</Button>
			</div>
		</form>
	)
}

export default DeleteCategoryDialog
