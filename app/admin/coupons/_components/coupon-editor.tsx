'use client'

import { Loader2, Wand2 } from 'lucide-react'
import { type FormEvent, type ReactNode, useState } from 'react'

import FormField from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { cn, formatPrice } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '../../products/_lib/types'
import {
	type Coupon,
	type CouponDraft,
	draftFromCoupon,
	emptyCouponDraft,
	generateCode,
	getStatus,
	normalizeCode,
	parseNumber,
	todayKey,
	validateCoupon,
} from '../_lib/types'
import CouponTicket from './coupon-ticket'

export type CouponEditorState = { mode: 'create' } | { mode: 'edit'; coupon: Coupon } | null

interface CouponEditorProps {
	state: CouponEditorState
	takenCodes: (exceptId?: string) => string[]
	onClose: () => void
	onSave: (draft: CouponDraft, coupon?: Coupon) => Promise<void>
}

const CouponEditor = ({ state, takenCodes, onClose, onSave }: CouponEditorProps) => (
	<Sheet open={Boolean(state)} onOpenChange={open => !open && onClose()}>
		<SheetContent className='w-full gap-0 overflow-hidden p-0 data-[side=right]:sm:max-w-xl'>
			{state && (
				<EditorForm
					key={state.mode === 'edit' ? state.coupon.id : 'new'}
					coupon={state.mode === 'edit' ? state.coupon : undefined}
					taken={takenCodes(state.mode === 'edit' ? state.coupon.id : undefined)}
					onSave={onSave}
					onCancel={onClose}
				/>
			)}
		</SheetContent>
	</Sheet>
)

const addDays = (days: number) => {
	const date = new Date()
	date.setDate(date.getDate() + days)
	return todayKey(date)
}

const PERCENT_PRESETS = [5, 10, 15, 25]
const FIXED_PRESETS = [50_000, 100_000, 250_000, 500_000]

interface EditorFormProps {
	coupon?: Coupon
	taken: string[]
	onSave: CouponEditorProps['onSave']
	onCancel: () => void
}

const EditorForm = ({ coupon, taken, onSave, onCancel }: EditorFormProps) => {
	const [initial] = useState(() => (coupon ? draftFromCoupon(coupon) : { ...emptyCouponDraft(), code: generateCode() }))
	const [draft, setDraft] = useState(initial)
	const [submitted, setSubmitted] = useState(false)
	const [saving, setSaving] = useState(false)

	const uses = coupon?.uses ?? 0
	const errors = submitted ? validateCoupon(draft, taken, uses) : {}
	const codeTaken = taken.includes(draft.code)
	const dirty = JSON.stringify(draft) !== JSON.stringify(initial)
	const set = <K extends keyof CouponDraft>(key: K, value: CouponDraft[K]) => setDraft(current => ({ ...current, [key]: value }))

	// Jonli ko'rinish uchun qoralamadan vaqtinchalik kupon
	const value = parseNumber(draft.value)
	const minOrder = parseNumber(draft.minOrder) || 0
	const previewCoupon: Coupon = {
		id: coupon?.id ?? 'preview',
		code: draft.code,
		description: draft.description,
		type: draft.type,
		value: Number.isFinite(value) ? value : 0,
		minOrder,
		maxUses: draft.maxUses.trim() ? parseNumber(draft.maxUses) || null : null,
		onePerCustomer: draft.onePerCustomer,
		firstOrderOnly: draft.firstOrderOnly,
		categories: draft.categories,
		startsAt: draft.startsAt || todayKey(),
		endsAt: draft.endsAt || null,
		paused: draft.paused,
		uses,
		discountGiven: coupon?.discountGiven ?? 0,
		revenue: coupon?.revenue ?? 0,
		createdAt: coupon?.createdAt ?? '',
	}
	const today = todayKey()

	// "Masalan" hisob-kitobi: minimal summadan yoki 4 mln so'mlik savatdan
	const sampleCart = Math.max(minOrder, 4_000_000)
	const sampleDiscount = Number.isFinite(value) && value > 0 ? (draft.type === 'percent' ? Math.round((sampleCart * Math.min(value, 90)) / 100) : Math.min(value, sampleCart)) : 0

	const submit = async (event?: FormEvent) => {
		event?.preventDefault()
		setSubmitted(true)
		if (Object.keys(validateCoupon(draft, taken, uses)).length) return
		setSaving(true)
		await onSave(draft, coupon)
		setSaving(false)
	}

	return (
		<form
			onSubmit={submit}
			onKeyDown={event => {
				if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
					event.preventDefault()
					void submit()
				}
			}}
			noValidate
			className='flex h-full min-h-0 flex-col'
		>
			<div className='border-b p-5 pr-12'>
				<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>
					{coupon ? `Tahrirlash · ${uses} marta ishlatilgan` : 'Yangi kupon'}
				</p>
				<SheetTitle className='mt-1 font-space-grotesk text-2xl font-bold tracking-tight'>{coupon ? coupon.code : 'Kupon yaratish'}</SheetTitle>
				<SheetDescription className='sr-only'>Kupon kodi, chegirma, shartlar va muddat</SheetDescription>
			</div>

			<div className='flex-1 space-y-7 overflow-y-auto p-5'>
				{/* Jonli chipta */}
				<div className='rounded-xl bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[14px_14px] p-3'>
					<CouponTicket coupon={previewCoupon} status={getStatus(previewCoupon, today)} today={today} preview />
					<p className='mt-2.5 text-center text-xs text-muted-foreground'>
						Masalan, {formatPrice(sampleCart)}lik savatda:{' '}
						<span className='font-mono font-medium text-foreground'>−{formatPrice(sampleDiscount)}</span>
					</p>
				</div>

				<Section index='01' title='Kod'>
					<FormField
						id='coupon-code'
						label='Promo-kod'
						error={errors.code || (codeTaken ? `«${draft.code}» allaqachon bor` : undefined)}
						hint={coupon && uses > 0 && draft.code !== coupon.code ? 'Eski kod endi ishlamaydi — mijozlarga xabar bering' : 'Mijoz savatda shu kodni kiritadi'}
						action={
							<button
								type='button'
								onClick={() => set('code', generateCode())}
								className='inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground'
							>
								<Wand2 className='size-3' />
								Tasodifiy
							</button>
						}
					>
						<Input
							id='coupon-code'
							value={draft.code}
							onChange={event => set('code', normalizeCode(event.target.value))}
							placeholder='QORAJUMA25'
							aria-invalid={Boolean(errors.code || codeTaken)}
							className='h-10 font-mono text-base tracking-wider uppercase'
						/>
					</FormField>
					<FormField id='coupon-description' label='Ichki izoh'>
						<Input
							id='coupon-description'
							value={draft.description}
							onChange={event => set('description', event.target.value)}
							placeholder="Masalan: Instagram obunachilari uchun"
							className='h-9'
						/>
					</FormField>
				</Section>

				<Section index='02' title='Chegirma'>
					<div className='flex h-9 w-fit rounded-md border p-0.5' role='radiogroup' aria-label='Chegirma turi'>
						{(
							[
								['percent', 'Foiz %'],
								['fixed', "Summa so'm"],
							] as const
						).map(([type, label]) => (
							<button
								key={type}
								type='button'
								role='radio'
								aria-checked={draft.type === type}
								onClick={() => setDraft(current => ({ ...current, type, value: type === 'percent' ? '10' : '50000' }))}
								className={cn(
									'rounded-[5px] px-3 text-sm transition-colors',
									draft.type === type ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
								)}
							>
								{label}
							</button>
						))}
					</div>
					<FormField id='coupon-value' label={draft.type === 'percent' ? 'Foiz' : "Summa (so'm)"} error={errors.value}>
						<div className='flex gap-2'>
							<Input
								id='coupon-value'
								inputMode='numeric'
								value={draft.value}
								onChange={event => set('value', event.target.value)}
								aria-invalid={Boolean(errors.value)}
								className='h-9 w-32 font-mono'
							/>
							<div className='flex flex-wrap gap-1'>
								{(draft.type === 'percent' ? PERCENT_PRESETS : FIXED_PRESETS).map(preset => (
									<button
										key={preset}
										type='button'
										onClick={() => set('value', String(preset))}
										className={cn(
											'h-9 rounded-md border px-2.5 font-mono text-xs transition-colors',
											value === preset ? 'border-foreground bg-foreground/5' : 'text-muted-foreground hover:text-foreground'
										)}
									>
										{draft.type === 'percent' ? `${preset}%` : `${preset / 1000}K`}
									</button>
								))}
							</div>
						</div>
					</FormField>
				</Section>

				<Section index='03' title='Shartlar'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<FormField id='coupon-min' label='Minimal buyurtma' error={errors.minOrder} hint='Bo‘sh — cheklovsiz'>
							<Input
								id='coupon-min'
								inputMode='numeric'
								value={draft.minOrder}
								onChange={event => set('minOrder', event.target.value)}
								placeholder='0'
								aria-invalid={Boolean(errors.minOrder)}
								className='h-9 font-mono'
							/>
						</FormField>
						<FormField id='coupon-max' label='Ishlatish limiti' error={errors.maxUses} hint='Bo‘sh — cheksiz'>
							<Input
								id='coupon-max'
								inputMode='numeric'
								value={draft.maxUses}
								onChange={event => set('maxUses', event.target.value)}
								placeholder='∞'
								aria-invalid={Boolean(errors.maxUses)}
								className='h-9 font-mono'
							/>
						</FormField>
					</div>
					<div className='divide-y rounded-xl border'>
						<Toggle label='Bir mijozga bir marta' hint='Takroriy ishlatishning oldini oladi' checked={draft.onePerCustomer} onChange={checked => set('onePerCustomer', checked)} />
						<Toggle label='Faqat birinchi xarid' hint="Ilgari buyurtma bermagan mijozlarga" checked={draft.firstOrderOnly} onChange={checked => set('firstOrderOnly', checked)} />
					</div>
					<div className='space-y-2'>
						<p className='text-sm font-medium'>Kategoriyalar</p>
						<div className='flex flex-wrap gap-1.5'>
							<CategoryChip active={draft.categories.length === 0} onClick={() => set('categories', [])}>
								Hammasi
							</CategoryChip>
							{PRODUCT_CATEGORIES.map(category => {
								const active = draft.categories.includes(category.id)
								return (
									<CategoryChip
										key={category.id}
										active={active}
										onClick={() =>
											set('categories', active ? draft.categories.filter(id => id !== category.id) : [...draft.categories, category.id])
										}
									>
										{category.label}
									</CategoryChip>
								)
							})}
						</div>
					</div>
				</Section>

				<Section index='04' title='Muddat'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<FormField id='coupon-start' label='Boshlanadi' error={errors.startsAt}>
							<Input id='coupon-start' type='date' value={draft.startsAt} onChange={event => set('startsAt', event.target.value)} className='h-9 font-mono' />
						</FormField>
						<FormField id='coupon-end' label='Tugaydi' error={errors.endsAt} hint={draft.endsAt ? undefined : 'Muddatsiz'}>
							<Input
								id='coupon-end'
								type='date'
								value={draft.endsAt}
								min={draft.startsAt}
								onChange={event => set('endsAt', event.target.value)}
								aria-invalid={Boolean(errors.endsAt)}
								className='h-9 font-mono'
							/>
						</FormField>
					</div>
					<div className='flex flex-wrap gap-1.5'>
						{[
							['7 kun', 7],
							['30 kun', 30],
							['90 kun', 90],
						].map(([label, days]) => (
							<button
								key={label}
								type='button'
								onClick={() => set('endsAt', addDays(Number(days)))}
								className='rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-solid hover:text-foreground'
							>
								+{label}
							</button>
						))}
						<button
							type='button'
							onClick={() => set('endsAt', '')}
							className={cn(
								'rounded-full border px-2.5 py-1 text-xs transition-colors',
								!draft.endsAt ? 'border-foreground bg-foreground/5' : 'border-dashed text-muted-foreground hover:text-foreground'
							)}
						>
							Muddatsiz
						</button>
					</div>
					<div className='rounded-xl border'>
						<Toggle label="To'xtatilgan" hint='Kod vaqtincha ishlamaydi, sozlamalar saqlanadi' checked={draft.paused} onChange={checked => set('paused', checked)} />
					</div>
				</Section>
			</div>

			<div className='flex items-center gap-3 border-t bg-muted/30 p-4'>
				<span className='flex min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground'>
					<span className={cn('size-1.5 shrink-0 rounded-full', dirty ? 'bg-amber-500' : 'bg-emerald-500')} />
					<span className='truncate'>{dirty ? "Saqlanmagan o'zgarishlar" : "O'zgarish yo'q"}</span>
					<kbd className='hidden rounded border bg-background px-1 font-mono text-[10px] sm:inline'>Ctrl ↵</kbd>
				</span>
				<Button type='button' variant='outline' onClick={onCancel}>
					Bekor qilish
				</Button>
				<Button type='submit' disabled={saving || (Boolean(coupon) && !dirty)}>
					{saving && <Loader2 className='animate-spin' />}
					{coupon ? 'Saqlash' : 'Yaratish'}
				</Button>
			</div>
		</form>
	)
}

const Section = ({ index, title, children }: { index: string; title: string; children: ReactNode }) => (
	<section className='grid gap-4'>
		<div className='flex items-baseline gap-3 border-b pb-2'>
			<span className='font-mono text-[10px] text-muted-foreground'>{index}</span>
			<h3 className='font-medium'>{title}</h3>
		</div>
		{children}
	</section>
)

const Toggle = ({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (checked: boolean) => void }) => (
	<label className='flex cursor-pointer items-center justify-between gap-4 p-3.5 transition-colors hover:bg-muted/30'>
		<span>
			<span className='block text-sm font-medium'>{label}</span>
			<span className='block text-xs text-muted-foreground'>{hint}</span>
		</span>
		<Switch checked={checked} onCheckedChange={onChange} />
	</label>
)

const CategoryChip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) => (
	<button
		type='button'
		aria-pressed={active}
		onClick={onClick}
		className={cn(
			'rounded-full border px-3 py-1 text-xs transition-colors',
			active ? 'border-foreground bg-foreground/5 font-medium text-foreground' : 'border-dashed text-muted-foreground hover:border-solid hover:text-foreground'
		)}
	>
		{children}
	</button>
)

export default CouponEditor
