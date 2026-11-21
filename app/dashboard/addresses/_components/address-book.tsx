'use client'

import { MapPinPlus, Plus } from 'lucide-react'
import { useState, useTransition } from 'react'

import FormAlert from '@/components/shared/form-alert'
import GridFrame from '@/components/shared/grid-frame'
import { Button } from '@/components/ui/button'
import PageHeader from '../../_components/page-header'
import { deleteAddress, setDefaultAddress } from '../_lib/actions'
import { type Address, type AddressResult, MAX_ADDRESSES } from '../_lib/types'
import AddressCard from './address-card'
import AddressDialog from './address-dialog'

/** Manzillar daftari: ro'yxat, qo'shish/tahrirlash dialogi va amallar (MongoDB'da saqlanadi) */
const AddressBook = ({ initial }: { initial: Address[] }) => {
	const [addresses, setAddresses] = useState(initial)
	const [dialog, setDialog] = useState<{ open: boolean; address?: Address }>({ open: false })
	const [busyId, setBusyId] = useState<string>()
	const [error, setError] = useState<string>()
	const [, startTransition] = useTransition()

	const full = addresses.length >= MAX_ADDRESSES

	const apply = (result: AddressResult) => {
		if (result.ok) {
			setAddresses(result.addresses)
			setError(undefined)
		} else {
			setError(result.error)
		}
	}

	const run = (id: string, action: (id: string) => Promise<AddressResult>) => {
		setBusyId(id)
		startTransition(async () => {
			apply(await action(id))
			setBusyId(undefined)
		})
	}

	const openNew = () => setDialog({ open: true })

	return (
		<>
			<PageHeader
				eyebrow={`Dashboard · Manzillar · ${addresses.length}/${MAX_ADDRESSES}`}
				title={
					<>
						Manzillar. <span className='text-muted-foreground'>Kuryer adashmaydi.</span>
					</>
				}
				description='Buyurtma berishda tanlash uchun yetkazish manzillaringizni saqlang. Asosiy manzil avtomatik tanlanadi.'
				action={
					addresses.length > 0 && (
						<Button onClick={openNew} disabled={full}>
							<Plus />
							Yangi manzil
						</Button>
					)
				}
			/>

			<div className='space-y-4'>
				<FormAlert message={error} />

				{addresses.length > 0 ? (
					<div className='grid gap-4 md:grid-cols-2'>
						{addresses.map((address, index) => (
							<AddressCard
								key={address.id}
								address={address}
								index={index}
								busy={busyId === address.id}
								onEdit={() => setDialog({ open: true, address })}
								onDelete={() => run(address.id, deleteAddress)}
								onMakeDefault={() => run(address.id, setDefaultAddress)}
							/>
						))}

						{!full && (
							<button
								type='button'
								onClick={openNew}
								className='group flex min-h-48 flex-col items-center justify-center gap-3 border border-dashed text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/30 hover:text-foreground'
							>
								<span className='flex size-10 items-center justify-center rounded-full border bg-background transition-transform group-hover:scale-110'>
									<Plus className='size-4' />
								</span>
								<span className='text-sm'>Yana bitta manzil qo&apos;shish</span>
							</button>
						)}
					</div>
				) : (
					<GridFrame className='flex flex-col items-center gap-5 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[18px_18px] px-6 py-16 text-center'>
						<span className='relative flex size-14 items-center justify-center rounded-full border bg-background'>
							<span className='absolute inset-0 animate-ping rounded-full border opacity-40' />
							<MapPinPlus className='size-6' />
						</span>
						<div className='space-y-1.5'>
							<p className='font-space-grotesk text-2xl font-bold tracking-tight'>Hali manzil yo&apos;q</p>
							<p className='max-w-sm text-sm text-muted-foreground'>
								Birinchi manzilingizni qo&apos;shing — keyingi buyurtmalar bir bosishda rasmiylashadi.
							</p>
						</div>
						<Button onClick={openNew}>
							<Plus />
							Manzil qo&apos;shish
						</Button>
					</GridFrame>
				)}
			</div>

			<AddressDialog
				open={dialog.open}
				onOpenChange={open => setDialog(current => ({ ...current, open }))}
				address={dialog.address}
				isFirst={addresses.length === 0}
				onSaved={result => {
					apply(result)
					setDialog(current => ({ ...current, open: false }))
				}}
			/>
		</>
	)
}

export default AddressBook
