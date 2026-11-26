'use client'

import { AlertTriangle, ArrowDown, ArrowUp, Check, Loader2, Search, X } from 'lucide-react'
import Image from 'next/image'
import { type FormEvent, type ReactNode, useState } from 'react'

import FormField from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { cn, formatPrice } from '@/lib/utils'
import {
	type AdminBundle,
	allProducts,
	type BundleDraft,
	bundleIssues,
	bundleProducts,
	bundleTotals,
	draftFromBundle,
	emptyBundleDraft,
	MAX_DISCOUNT,
	MAX_ITEMS,
	validateBundle,
} from '../_lib/types'
import BundleEquation from './bundle-equation'

export type BundleEditorState = { mode: 'create' } | { mode: 'edit'; bundle: AdminBundle } | null

interface BundleEditorProps {
	state: BundleEditorState
	takenNames: (exceptId?: string) => string[]
	onClose: () => void
	onSave: (draft: BundleDraft, bundle?: AdminBundle) => Promise<void>
}

const BundleEditor = ({ state, takenNames, onClose, onSave }: BundleEditorProps) => (
	<Sheet open={Boolean(state)} onOpenChange={open => !open && onClose()}>
		<SheetContent className='w-full gap-0 overflow-hidden p-0 data-[side=right]:sm:max-w-xl'>
			{state && (
				<EditorForm
					key={state.mode === 'edit' ? state.bundle.id : 'new'}
					bundle={state.mode === 'edit' ? state.bundle : undefined}
					taken={takenNames(state.mode === 'edit' ? state.bundle.id : undefined)}
					onSave={onSave}
					onCancel={onClose}
				/>
			)}
		</SheetContent>
	</Sheet>
)

const PRESETS = [5, 8, 10, 12, 15]

interface EditorFormProps {
	bundle?: AdminBundle
	taken: string[]
	onSave: BundleEditorProps['onSave']
	onCancel: () => void
}

const EditorForm = ({ bundle, taken, onSave, onCancel }: EditorFormProps) => {
	const [initial] = useState(() => (bundle ? draftFromBundle(bundle) : emptyBundleDraft()))
	const [draft, setDraft] = useState(initial)
	const [query, setQuery] = useState('')
	const [submitted, setSubmitted] = useState(false)
	const [saving, setSaving] = useState(false)

	const errors = submitted ? validateBundle(draft, taken) : {}
	const dirty = JSON.stringify(draft) !== JSON.stringify(initial)
	const set = <K extends keyof BundleDraft>(key: K, value: BundleDraft[K]) => setDraft(current => ({ ...current, [key]: value }))
	const full = draft.productIds.length >= MAX_ITEMS
	const totals = bundleTotals(draft.productIds, draft.discount)
	const issues = bundleIssues(draft.productIds)
	const selected = bundleProducts(draft.productIds)

	const q = query.trim().toLowerCase()
	const options = allProducts.filter(product => !q || `${product.brand} ${product.name}`.toLowerCase().includes(q))

	const toggle = (id: string) =>
		set('productIds', draft.productIds.includes(id) ? draft.productIds.filter(item => item !== id) : full ? draft.productIds : [...draft.productIds, id])

	const move = (from: number, to: number) => {
		const next = [...draft.productIds]
		const [item] = next.splice(from, 1)
		next.splice(to, 0, item)
		set('productIds', next)
	}

	const submit = async (event?: FormEvent) => {
		event?.preventDefault()
		setSubmitted(true)
		if (Object.keys(validateBundle(draft, taken)).length) return
		setSaving(true)
		await onSave(draft, bundle)
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
					{bundle ? `Tahrirlash · ${bundle.sold} marta sotilgan` : "Yangi to'plam"}
				</p>
				<SheetTitle className='mt-1 truncate font-space-grotesk text-2xl font-bold tracking-tight'>{draft.name.trim() || "Nomsiz to'plam"}</SheetTitle>
				<SheetDescription className='sr-only'>To&apos;plam nomi, mahsulotlari va chegirmasi</SheetDescription>
			</div>

			<div className='flex-1 space-y-7 overflow-y-auto p-5'>
				{/* Jonli tenglama */}
				<div className='space-y-3 rounded-xl border bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[14px_14px] p-4'>
					{selected.length ? (
						<BundleEquation productIds={draft.productIds} discount={draft.discount} flagged={new Set(issues.map(issue => issue.productId))} />
					) : (
						<p className='py-4 text-center text-sm text-muted-foreground'>Mahsulot tanlang — tenglama shu yerda yig&apos;iladi</p>
					)}
					{selected.length > 0 && (
						<p className='text-xs text-muted-foreground'>
							Mijoz to&apos;plamni olsa <span className='font-mono font-medium text-foreground'>{formatPrice(totals.savings)}</span> tejaydi
						</p>
					)}
					{issues.length > 0 && (
						<p className='flex gap-1.5 text-xs text-rose-600 dark:text-rose-400'>
							<AlertTriangle className='mt-px size-3.5 shrink-0' />
							{issues.map(issue => issue.text).join('; ')}
						</p>
					)}
				</div>

				<Section index='01' title="Ma'lumot">
					<FormField id='bundle-name' label='Nomi' error={errors.name}>
						<Input
							id='bundle-name'
							value={draft.name}
							onChange={event => set('name', event.target.value)}
							placeholder='Portret ustasi'
							autoFocus={!bundle}
							aria-invalid={Boolean(errors.name)}
							className='h-9'
						/>
					</FormField>
					<FormField id='bundle-tagline' label='Qisqa tavsif' hint="/deals sahifasida nom ostida">
						<Input
							id='bundle-tagline'
							value={draft.tagline}
							onChange={event => set('tagline', event.target.value)}
							placeholder='Kamera, linza va chaqnoq — studiya portretlari uchun.'
							className='h-9'
						/>
					</FormField>
				</Section>

				<Section index='02' title='Mahsulotlar' aside={`${draft.productIds.length}/${MAX_ITEMS}`} error={errors.productIds}>
					{selected.length > 0 && (
						<ol className='space-y-1'>
							{selected.map((product, index) => (
								<li key={product.id} className='flex items-center gap-3 rounded-lg border bg-background p-2'>
									<span className='w-4 text-center font-mono text-[10px] text-muted-foreground'>{index + 1}</span>
									<span className='relative size-9 shrink-0 overflow-hidden rounded-md bg-white'>
										<Image src={product.images[0]?.url ?? ''} alt='' fill sizes='36px' className='object-contain p-1 mix-blend-multiply' />
									</span>
									<span className='min-w-0 flex-1'>
										<span className='block truncate text-sm'>{product.name}</span>
										<span className='block font-mono text-[11px] text-muted-foreground'>{formatPrice(product.price)}</span>
									</span>
									<IconButton label='Yuqoriga' disabled={index === 0} onClick={() => move(index, index - 1)}>
										<ArrowUp />
									</IconButton>
									<IconButton label='Pastga' disabled={index === selected.length - 1} onClick={() => move(index, index + 1)}>
										<ArrowDown />
									</IconButton>
									<IconButton label='Olib tashlash' onClick={() => toggle(product.id)}>
										<X />
									</IconButton>
								</li>
							))}
						</ol>
					)}
					<label className='flex h-9 items-center rounded-md border bg-background focus-within:ring-3 focus-within:ring-ring/30'>
						<Search className='ml-3 size-4 shrink-0 text-muted-foreground' />
						<input
							value={query}
							onChange={event => setQuery(event.target.value)}
							placeholder={full ? `Limit: ${MAX_ITEMS} ta — avval birini olib tashlang` : 'Mahsulot qo‘shish...'}
							aria-label='Mahsulot qidirish'
							className='h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground'
						/>
					</label>
					<ul className='max-h-56 space-y-0.5 overflow-y-auto rounded-lg border p-1'>
						{options.map(product => {
							const checked = draft.productIds.includes(product.id)
							const unavailable = product.status !== 'active' || product.stock === 0
							return (
								<li key={product.id}>
									<button
										type='button'
										aria-pressed={checked}
										disabled={!checked && full}
										onClick={() => toggle(product.id)}
										className={cn('flex w-full items-center gap-3 rounded-md p-1.5 text-left transition-colors disabled:opacity-40', checked ? 'bg-muted' : 'hover:bg-muted/60')}
									>
										<span className={cn('flex size-4 shrink-0 items-center justify-center rounded border', checked && 'border-foreground bg-foreground text-background')}>
											{checked && <Check className='size-3' />}
										</span>
										<span className='min-w-0 flex-1'>
											<span className='block truncate text-sm'>{product.name}</span>
											<span className='block font-mono text-[11px] text-muted-foreground'>
												{product.brand} · {formatPrice(product.price)}
												{unavailable && <span className='text-rose-600 dark:text-rose-400'> · {product.stock === 0 ? "omborda yo'q" : product.status === 'archived' ? 'arxivda' : 'qoralama'}</span>}
											</span>
										</span>
									</button>
								</li>
							)
						})}
					</ul>
				</Section>

				<Section index='03' title='Chegirma' error={errors.discount}>
					<div className='flex items-center gap-4'>
						<span className='w-20 font-space-grotesk text-3xl font-bold tracking-tight tabular-nums'>{draft.discount}%</span>
						<input
							type='range'
							min={1}
							max={MAX_DISCOUNT}
							value={draft.discount}
							onChange={event => set('discount', Number(event.target.value))}
							aria-label="To'plam chegirmasi"
							className='flex-1 accent-foreground'
						/>
					</div>
					<div className='flex flex-wrap gap-1.5'>
						{PRESETS.map(preset => (
							<button
								key={preset}
								type='button'
								onClick={() => set('discount', preset)}
								className={cn(
									'rounded-full border px-2.5 py-1 font-mono text-xs transition-colors',
									draft.discount === preset ? 'border-foreground bg-foreground/5' : 'border-dashed text-muted-foreground hover:border-solid hover:text-foreground'
								)}
							>
								{preset}%
							</button>
						))}
					</div>
					<p className='text-xs text-muted-foreground'>Chegirma faqat to&apos;plamdagi hamma mahsulot savatda bo&apos;lsa ishlaydi.</p>
				</Section>

				<label className='flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/30'>
					<span>
						<span className='block text-sm font-medium'>Do&apos;konda ko&apos;rsatish</span>
						<span className='block text-xs text-muted-foreground'>/deals sahifasidagi &laquo;To&apos;plamlar&raquo; bo&apos;limida</span>
					</span>
					<Switch checked={draft.visible} onCheckedChange={visible => set('visible', visible)} />
				</label>
			</div>

			<div className='flex items-center gap-3 border-t bg-muted/30 p-4'>
				<span className='flex min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground'>
					<span className={cn('size-1.5 shrink-0 rounded-full', dirty ? 'bg-amber-500' : 'bg-emerald-500')} />
					<span className='truncate'>{dirty ? "Saqlanmagan o'zgarishlar" : "O'zgarish yo'q"}</span>
				</span>
				<Button type='button' variant='outline' onClick={onCancel}>
					Bekor qilish
				</Button>
				<Button type='submit' disabled={saving || (Boolean(bundle) && !dirty)}>
					{saving && <Loader2 className='animate-spin' />}
					{bundle ? 'Saqlash' : 'Yaratish'}
				</Button>
			</div>
		</form>
	)
}

const Section = ({ index, title, aside, error, children }: { index: string; title: string; aside?: string; error?: string; children: ReactNode }) => (
	<section className='grid gap-3'>
		<div className='flex items-baseline gap-3 border-b pb-2'>
			<span className='font-mono text-[10px] text-muted-foreground'>{index}</span>
			<h3 className='font-medium'>{title}</h3>
			{error ? (
				<span className='ml-auto text-xs text-destructive' role='alert'>
					{error}
				</span>
			) : (
				aside && <span className='ml-auto font-mono text-xs text-muted-foreground'>{aside}</span>
			)}
		</div>
		{children}
	</section>
)

const IconButton = ({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: ReactNode }) => (
	<button
		type='button'
		aria-label={label}
		title={label}
		disabled={disabled}
		onClick={onClick}
		className='flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30 [&_svg]:size-3.5'
	>
		{children}
	</button>
)

export default BundleEditor
