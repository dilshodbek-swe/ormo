'use client'

import { MapPinPlus, Plus } from 'lucide-react'
import { useState, useTransition } from 'react'

import FormAlert from '@/components/shared/form-alert'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/shared/page-header'
import { deleteAddress, setDefaultAddress } from '../_lib/actions'
import { type Address, type AddressResult, MAX_ADDRESSES } from '../_lib/types'
import AddressCard from './address-card'
import AddressDialog from './address-dialog'
import AddressesMap from './map/addresses-map'
import MapsProvider from './map/maps-provider'

/**
 * Manzillar daftari: chapda yorliq-kartalar, o'ngda barcha nuqtalar bitta xaritada.
 * Karta ustiga kelganda yoki bosilganda xarita o'sha nuqtaga uchadi (MongoDB'da saqlanadi).
 */
const AddressBook = ({ initial }: { initial: Address[] }) => {
	const [addresses, setAddresses] = useState(initial)
	const [selectedId, setSelectedId] = useState(() => initial.find(address => address.isDefault)?.id)
	const [hoveredId, setHoveredId] = useState<string>()
	const [dialog, setDialog] = useState<{ open: boolean; address?: Address }>({ open: false })
	const [busyId, setBusyId] = useState<string>()
	const [error, setError] = useState<string>()
	const [, startTransition] = useTransition()

	const full = addresses.length >= MAX_ADDRESSES
	const activeId = hoveredId ?? selectedId

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

	/** Xaritadagi belgi bosilganda — kartani ko'rinadigan joyga suramiz */
	const selectFromMap = (id: string) => {
		setSelectedId(id)
		document.getElementById(`address-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
	}

	const openNew = () => setDialog({ open: true })

	return (
		<MapsProvider>
			<PageHeader
				eyebrow={`Dashboard · Manzillar · ${addresses.length}/${MAX_ADDRESSES}`}
				title={
					<>
						Manzillar. <span className='text-muted-foreground'>Kuryer adashmaydi.</span>
					</>
				}
				description='Yetkazish manzillaringizni xaritada belgilang — kuryer aynan shu nuqtaga keladi. Asosiy manzil buyurtmada avtomatik tanlanadi.'
				action={
					addresses.length > 0 && (
						<Button onClick={openNew} disabled={full}>
							<Plus />
							Yangi manzil
						</Button>
					)
				}
			/>

			{error && (
				<div className='mb-4'>
					<FormAlert message={error} />
				</div>
			)}

			{addresses.length > 0 ? (
				<div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]'>
					{/* Xarita — mobil ekranda tepada, kattada o'ngda yopishqoq */}
					<AddressesMap
						addresses={addresses}
						activeId={activeId}
						onSelect={selectFromMap}
						className='h-80 lg:sticky lg:top-20 lg:order-last lg:h-[calc(100svh-7rem)] lg:min-h-[32rem]'
					/>

					<div className='space-y-3'>
						{addresses.map((address, index) => (
							<div key={address.id} id={`address-${address.id}`} className='scroll-mt-20'>
								<AddressCard
									address={address}
									index={index}
									active={address.id === activeId}
									busy={busyId === address.id}
									onSelect={() => setSelectedId(address.id)}
									onHover={hovering => setHoveredId(hovering ? address.id : undefined)}
									onEdit={() => setDialog({ open: true, address })}
									onDelete={() => run(address.id, deleteAddress)}
									onMakeDefault={() => run(address.id, setDefaultAddress)}
								/>
							</div>
						))}

						{!full && (
							<button
								type='button'
								onClick={openNew}
								className='group flex w-full items-center justify-center gap-3 border border-dashed py-6 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/30 hover:text-foreground'
							>
								<span className='flex size-8 items-center justify-center rounded-full border bg-background transition-transform group-hover:scale-110'>
									<Plus className='size-4' />
								</span>
								Yana bitta manzil qo&apos;shish
							</button>
						)}
					</div>
				</div>
			) : (
				// Bo'sh holat: xarita fonida taklif kartasi
				<div className='relative'>
					<AddressesMap addresses={[]} onSelect={() => {}} className='h-[28rem]' />
					<div className='absolute inset-0 z-20 flex items-center justify-center p-4'>
						<div className='animate-in fade-in zoom-in-95 flex max-w-sm flex-col items-center gap-4 rounded-2xl border bg-background/95 p-8 text-center shadow-xl backdrop-blur-md'>
							<span className='relative flex size-14 items-center justify-center rounded-full border bg-background'>
								<span className='absolute inset-0 animate-ping rounded-full border opacity-40' />
								<MapPinPlus className='size-6' />
							</span>
							<div className='space-y-1.5'>
								<p className='font-space-grotesk text-2xl font-bold tracking-tight'>Birinchi nuqtani qo&apos;ying</p>
								<p className='text-sm text-muted-foreground'>
									Xaritada uyingiz yoki ishxonangizni belgilang — keyingi buyurtmalar bir bosishda rasmiylashadi.
								</p>
							</div>
							<Button onClick={openNew}>
								<Plus />
								Manzil qo&apos;shish
							</Button>
						</div>
					</div>
				</div>
			)}

			<AddressDialog
				open={dialog.open}
				onOpenChange={open => setDialog(current => ({ ...current, open }))}
				address={dialog.address}
				isFirst={addresses.length === 0}
				onSaved={result => {
					// Yangi yoki tahrirlangan manzilni xaritada darhol ko'rsatamiz
					const known = new Set(addresses.map(address => address.id))
					setSelectedId(dialog.address?.id ?? result.addresses.find(address => !known.has(address.id))?.id)
					apply(result)
					setDialog(current => ({ ...current, open: false }))
				}}
			/>
		</MapsProvider>
	)
}

export default AddressBook
