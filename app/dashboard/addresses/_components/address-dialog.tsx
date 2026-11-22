'use client'

import { Loader2, Sparkles } from 'lucide-react'
import { type FormEvent, useId, useState, useTransition } from 'react'

import FormAlert from '@/components/shared/form-alert'
import FormField from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { REGIONS } from '@/lib/data/regions'
import { cn } from '@/lib/utils'
import { createAddress, updateAddress } from '../_lib/actions'
import {
	type Address,
	type AddressField,
	type AddressInput,
	ADDRESS_LABELS,
	type AddressResult,
} from '../_lib/types'
import { LABEL_ICONS } from './label-icons'
import type { ResolvedAddress } from './map/geo'
import LocationPicker from './map/location-picker'
import { mapsEnabled } from './map/maps-provider'

const EMPTY: AddressInput = {
	label: 'Uy',
	fullName: '',
	phone: '',
	region: 'Toshkent shahri',
	city: '',
	street: '',
	isDefault: false,
	location: null,
}

/** 998901234567 → "90 123 45 67" (kiritish maydoni uchun, +998 alohida turadi) */
const toLocal = (phone: string) => {
	const d = phone.replace(/\D/g, '').replace(/^998/, '').slice(0, 9)
	return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ')
}

interface AddressDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	/** Tahrirlanayotgan manzil; yo'q bo'lsa — yangi */
	address?: Address
	/** Birinchi manzil avtomatik asosiy bo'ladi — switch ko'rsatilmaydi */
	isFirst: boolean
	onSaved: (result: Extract<AddressResult, { ok: true }>) => void
}

const AddressDialog = ({ open, onOpenChange, address, isFirst, onSaved }: AddressDialogProps) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className={cn('gap-0 overflow-hidden p-0', mapsEnabled ? 'sm:max-w-4xl' : 'sm:max-w-lg')}>
			{/* key — har ochilishda forma toza holatdan boshlanadi */}
			{open && (
				<AddressForm
					key={address?.id ?? 'new'}
					address={address}
					isFirst={isFirst}
					onCancel={() => onOpenChange(false)}
					onSaved={onSaved}
				/>
			)}
		</DialogContent>
	</Dialog>
)

const AddressForm = ({
	address,
	isFirst,
	onCancel,
	onSaved,
}: Omit<AddressDialogProps, 'open' | 'onOpenChange'> & { onCancel: () => void }) => {
	const uid = useId()
	const [values, setValues] = useState<AddressInput>(() =>
		address ? { ...address, phone: toLocal(address.phone) } : EMPTY
	)
	const [errors, setErrors] = useState<Partial<Record<AddressField, string>>>({})
	const [error, setError] = useState<string>()
	const [pending, startTransition] = useTransition()
	/** Xaritadan avtomatik to'ldirilgan bo'lsa — kichik belgi ko'rsatamiz */
	const [autoFilled, setAutoFilled] = useState(false)

	const set = <K extends keyof AddressInput>(key: K, value: AddressInput[K]) => {
		setValues(current => ({ ...current, [key]: value }))
		if (key in errors) setErrors(current => ({ ...current, [key]: undefined }))
	}

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(undefined)
		startTransition(async () => {
			const result = address ? await updateAddress(address.id, values) : await createAddress(values)
			if (result.ok) return onSaved(result)
			setErrors(result.fieldErrors ?? {})
			setError(result.error)
		})
	}

	/** Xaritada topilgan manzil bilan viloyat, shahar va ko'chani to'ldiradi */
	const applyResolved = ({ region, city, street }: ResolvedAddress) => {
		setValues(current => ({
			...current,
			region: region ?? current.region,
			city: city ?? current.city,
			street: street ?? current.street,
		}))
		setErrors(current => ({ ...current, region: undefined, city: undefined, street: undefined }))
		if (region || city || street) setAutoFilled(true)
	}

	const field = (name: AddressField) => ({
		id: `${uid}-${name}`,
		'aria-invalid': Boolean(errors[name]) || undefined,
		'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined,
	})

	return (
		<form noValidate onSubmit={submit}>
			<DialogHeader className='border-b p-5'>
				<DialogTitle className='font-space-grotesk text-xl font-bold tracking-tight'>
					{address ? 'Manzilni tahrirlash' : 'Yangi manzil'}
				</DialogTitle>
				<DialogDescription>Kuryer buyurtmani shu manzilga olib keladi.</DialogDescription>
			</DialogHeader>

			<div className={cn(mapsEnabled && 'grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]')}>
				{mapsEnabled && (
					<div className='h-64 border-b md:h-auto md:border-r md:border-b-0'>
						<LocationPicker
							value={values.location ?? null}
							label={values.label}
							onChange={location => set('location', location)}
							onResolved={applyResolved}
						/>
					</div>
				)}
			<div className='max-h-[65svh] space-y-5 overflow-y-auto p-5'>
				{/* Yorliq — segmentli tanlov */}
				<fieldset className='space-y-2'>
					<legend className='mb-2 text-sm font-medium'>Yorliq</legend>
					<div className='grid grid-cols-3 gap-1 rounded-lg border p-1'>
						{ADDRESS_LABELS.map(label => {
							const Icon = LABEL_ICONS[label]
							const active = values.label === label
							return (
								<button
									key={label}
									type='button'
									aria-pressed={active}
									onClick={() => set('label', label)}
									className={cn(
										'flex items-center justify-center gap-2 rounded-md py-1.5 text-sm transition-colors [&_svg]:size-4',
										active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
									)}
								>
									<Icon />
									{label}
								</button>
							)
						})}
					</div>
				</fieldset>

				<div className='grid gap-4 sm:grid-cols-2'>
					<FormField id={`${uid}-fullName`} label='Qabul qiluvchi' error={errors.fullName}>
						<Input
							{...field('fullName')}
							autoComplete='name'
							value={values.fullName}
							onChange={event => set('fullName', event.target.value)}
							placeholder='Ism Familiya'
							className='h-10'
						/>
					</FormField>

					<FormField id={`${uid}-phone`} label='Telefon' error={errors.phone}>
						<div className='flex h-10 items-center rounded-lg border focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20'>
							<span className='border-r px-3 font-mono text-sm text-muted-foreground'>+998</span>
							<input
								{...field('phone')}
								type='tel'
								inputMode='numeric'
								autoComplete='tel-national'
								value={values.phone}
								onChange={event => set('phone', toLocal(event.target.value))}
								placeholder='90 123 45 67'
								className='h-full min-w-0 flex-1 bg-transparent px-3 font-mono text-sm outline-none placeholder:text-muted-foreground'
							/>
						</div>
					</FormField>

					<FormField id={`${uid}-region`} label='Viloyat' error={errors.region}>
						<select
							{...field('region')}
							value={values.region}
							onChange={event => set('region', event.target.value)}
							className='h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'
						>
							{REGIONS.map(region => (
								<option key={region} value={region}>
									{region}
								</option>
							))}
						</select>
					</FormField>

					<FormField id={`${uid}-city`} label='Shahar / tuman' error={errors.city}>
						<Input
							{...field('city')}
							autoComplete='address-level2'
							value={values.city}
							onChange={event => set('city', event.target.value)}
							placeholder='Yunusobod tumani'
							className='h-10'
						/>
					</FormField>
				</div>

				<FormField
					id={`${uid}-street`}
					label='Ko‘cha, uy, xonadon'
					error={errors.street}
					action={
						autoFilled && (
							<span className='animate-in fade-in inline-flex items-center gap-1 text-[11px] text-muted-foreground'>
								<Sparkles className='size-3' />
								Xaritadan to‘ldirildi
							</span>
						)
					}
					hint={
						mapsEnabled
							? 'Xaritada nuqtani belgilang — maydonlar o‘zi to‘ladi. Xonadon va mo‘ljalni qo‘shing.'
							: 'Mo‘ljal yoki domofon kodini ham yozib qo‘yishingiz mumkin'
					}
				>
					<Textarea
						{...field('street')}
						autoComplete='street-address'
						rows={2}
						value={values.street}
						onChange={event => set('street', event.target.value)}
						placeholder="Amir Temur ko'chasi 108, 12-xonadon"
						className='resize-none'
					/>
				</FormField>

				{!isFirst && !address?.isDefault && (
					<div className='flex items-center justify-between gap-4 rounded-lg border p-3'>
						<div>
							<Label htmlFor={`${uid}-default`}>Asosiy manzil qilish</Label>
							<p className='text-xs text-muted-foreground'>Buyurtmada avtomatik tanlanadi</p>
						</div>
						<Switch
							id={`${uid}-default`}
							checked={values.isDefault}
							onCheckedChange={checked => set('isDefault', checked)}
						/>
					</div>
				)}

				<FormAlert message={error} />
			</div>
			</div>

			<DialogFooter className='m-0 rounded-b-xl border-t bg-muted/40 p-4'>
				<Button type='button' variant='outline' onClick={onCancel}>
					Bekor qilish
				</Button>
				<Button type='submit' disabled={pending} className='min-w-28'>
					{pending && <Loader2 className='animate-spin' />}
					{address ? 'Saqlash' : 'Qo‘shish'}
				</Button>
			</DialogFooter>
		</form>
	)
}

export default AddressDialog
