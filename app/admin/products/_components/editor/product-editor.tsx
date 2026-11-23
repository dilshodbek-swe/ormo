'use client'

import { Loader2, Wand2 } from 'lucide-react'
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'

import FormField from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { cn, formatPrice } from '@/lib/utils'
import {
	type AdminProduct,
	draftFromProduct,
	emptyDraft,
	parseAmount,
	PRODUCT_CATEGORIES,
	PRODUCT_STATUS,
	type ProductDraft,
	type ProductStatus,
	suggestSku,
	validateDraft,
} from '../../_lib/types'
import ImageManager from './image-manager'
import SpecsTable from './specs-table'

export type EditorState = { mode: 'create' } | { mode: 'edit'; product: AdminProduct } | null

interface ProductEditorProps {
	state: EditorState
	onClose: () => void
	/** Saqlash; xato bo'lsa matn qaytaradi */
	onSave: (draft: ProductDraft, product?: AdminProduct) => Promise<void>
}

/** O'ngdan chiqadigan keng panel: yaratish va tahrirlash uchun bitta forma */
const ProductEditor = ({ state, onClose, onSave }: ProductEditorProps) => {
	const [guardOpen, setGuardOpen] = useState(false)
	const dirtyRef = useRef(false)

	const requestClose = () => {
		if (dirtyRef.current) setGuardOpen(true)
		else onClose()
	}

	return (
		<Sheet open={Boolean(state)} onOpenChange={open => !open && requestClose()}>
			<SheetContent className='w-full gap-0 overflow-hidden p-0 data-[side=right]:sm:max-w-2xl'>
				{state && (
					<EditorForm
						key={state.mode === 'edit' ? state.product.id : 'new'}
						product={state.mode === 'edit' ? state.product : undefined}
						onSave={onSave}
						onCancel={requestClose}
						onDirtyChange={dirty => {
							dirtyRef.current = dirty
						}}
						guardOpen={guardOpen}
						onGuard={discard => {
							setGuardOpen(false)
							if (discard) {
								dirtyRef.current = false
								onClose()
							}
						}}
					/>
				)}
			</SheetContent>
		</Sheet>
	)
}

interface EditorFormProps {
	product?: AdminProduct
	onSave: ProductEditorProps['onSave']
	onCancel: () => void
	onDirtyChange: (dirty: boolean) => void
	guardOpen: boolean
	onGuard: (discard: boolean) => void
}

const EditorForm = ({ product, onSave, onCancel, onDirtyChange, guardOpen, onGuard }: EditorFormProps) => {
	const [initial] = useState(() => (product ? draftFromProduct(product) : emptyDraft()))
	const [draft, setDraft] = useState(initial)
	const [submitted, setSubmitted] = useState(false)
	const [saving, setSaving] = useState(false)
	const formRef = useRef<HTMLFormElement>(null)

	const errors = submitted ? validateDraft(draft) : {}
	const dirty = JSON.stringify({ ...draft, images: draft.images.map(image => image.id) }) !==
		JSON.stringify({ ...initial, images: initial.images.map(image => image.id) })

	useEffect(() => {
		onDirtyChange(dirty)
	}, [dirty, onDirtyChange])

	// Yopilganda (saqlanmasdan) shu sessiyada tanlangan fayllarning blob URL'larini bo'shatamiz
	const draftRef = useRef(draft)
	useEffect(() => {
		draftRef.current = draft
	}, [draft])
	const savedRef = useRef(false)
	useEffect(
		() => () => {
			if (savedRef.current) return
			const kept = new Set(initial.images.map(image => image.url))
			draftRef.current.images.forEach(image => {
				if (image.url.startsWith('blob:') && !kept.has(image.url)) URL.revokeObjectURL(image.url)
			})
		},
		[initial]
	)

	const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft(current => ({ ...current, [key]: value }))

	const submit = async (event?: FormEvent) => {
		event?.preventDefault()
		setSubmitted(true)
		const found = validateDraft(draft)
		if (Object.keys(found).length) {
			// Birinchi xatoli maydonga
			const first = Object.keys(found)[0]
			formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
			return
		}
		setSaving(true)
		savedRef.current = true
		await onSave(draft, product)
		setSaving(false)
	}

	const price = parseAmount(draft.price)
	const oldPrice = parseAmount(draft.oldPrice)
	const discount = Number.isFinite(price) && Number.isFinite(oldPrice) && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

	return (
		<form
			ref={formRef}
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
					{product ? 'Tahrirlash' : 'Yangi mahsulot'}
				</p>
				<SheetTitle className='mt-1 truncate font-space-grotesk text-2xl font-bold tracking-tight'>
					{draft.name.trim() || (product ? product.name : 'Nomsiz mahsulot')}
				</SheetTitle>
				<SheetDescription className='mt-0.5 font-mono text-xs'>
					{product ? `/${product.id}` : "Saqlangach do'kon katalogiga qo'shiladi"}
				</SheetDescription>
			</div>

			<div className='flex-1 space-y-8 overflow-y-auto p-5'>
				<Section index='01' title='Rasmlar' description="Birinchi rasm — asosiy. Tartibni sudrab o'zgartiring.">
					<div data-field='images'>
						<ImageManager images={draft.images} onChange={images => set('images', images)} error={errors.images} />
					</div>
				</Section>

				<Section index='02' title="Asosiy ma'lumot">
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='sm:col-span-2' data-field='name'>
							<FormField id='product-name' label='Nomi' error={errors.name}>
								<Input
									id='product-name'
									value={draft.name}
									onChange={event => set('name', event.target.value)}
									placeholder='Alpha a6400 Body'
									aria-invalid={Boolean(errors.name)}
									autoFocus={!product}
									className='h-9'
								/>
							</FormField>
						</div>
						<div data-field='brand'>
							<FormField id='product-brand' label='Brend' error={errors.brand}>
								<Input
									id='product-brand'
									value={draft.brand}
									onChange={event => set('brand', event.target.value)}
									placeholder='Sony'
									aria-invalid={Boolean(errors.brand)}
									className='h-9'
								/>
							</FormField>
						</div>
						<FormField id='product-category' label='Kategoriya'>
							<select
								id='product-category'
								value={draft.category}
								onChange={event => set('category', event.target.value as ProductDraft['category'])}
								className='h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'
							>
								{PRODUCT_CATEGORIES.map(category => (
									<option key={category.id} value={category.id}>
										{category.label}
									</option>
								))}
							</select>
						</FormField>
						<div className='sm:col-span-2'>
							<FormField
								id='product-description'
								label='Tavsif'
								hint={<span className='font-mono'>{draft.description.length} belgi</span>}
							>
								<Textarea
									id='product-description'
									value={draft.description}
									onChange={event => set('description', event.target.value)}
									placeholder='Mahsulotning asosiy afzalliklari, kimga mos...'
									rows={4}
								/>
							</FormField>
						</div>
					</div>
				</Section>

				<Section index='03' title='Texnik xususiyatlar' description="Do'konda jadval bo'lib ko'rinadi. Enter — keyingi qator.">
					<div data-field='specs'>
						<SpecsTable specs={draft.specs} onChange={specs => set('specs', specs)} category={draft.category} showErrors={submitted} />
						{errors.specs && <p className='mt-2 text-xs text-destructive'>{errors.specs}</p>}
					</div>
				</Section>

				<Section index='04' title='Narx va ombor'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div data-field='price'>
							<FormField
								id='product-price'
								label="Narx (so'm)"
								error={errors.price}
								hint={Number.isFinite(price) && price > 0 ? <span className='font-mono'>{formatPrice(price)}</span> : undefined}
							>
								<Input
									id='product-price'
									inputMode='numeric'
									value={draft.price}
									onChange={event => set('price', event.target.value)}
									placeholder='9 790 000'
									aria-invalid={Boolean(errors.price)}
									className='h-9 font-mono'
								/>
							</FormField>
						</div>
						<div data-field='oldPrice'>
							<FormField
								id='product-old-price'
								label='Eski narx'
								error={errors.oldPrice}
								action={
									discount > 0 ? (
										<span className='rounded-md bg-foreground px-1.5 py-0.5 font-mono text-[10px] font-semibold text-background animate-in zoom-in-90'>
											−{discount}%
										</span>
									) : (
										<span className='text-xs text-muted-foreground'>ixtiyoriy</span>
									)
								}
								hint='Chegirma ko‘rsatish uchun — narxdan katta bo‘lsin'
							>
								<Input
									id='product-old-price'
									inputMode='numeric'
									value={draft.oldPrice}
									onChange={event => set('oldPrice', event.target.value)}
									placeholder='11 990 000'
									aria-invalid={Boolean(errors.oldPrice)}
									className='h-9 font-mono'
								/>
							</FormField>
						</div>
						<div data-field='stock'>
							<FormField id='product-stock' label='Qoldiq (dona)' error={errors.stock}>
								<div className='flex'>
									<StepButton side='left' onClick={() => set('stock', String(Math.max(0, (parseAmount(draft.stock) || 0) - 1)))}>
										−
									</StepButton>
									<Input
										id='product-stock'
										inputMode='numeric'
										value={draft.stock}
										onChange={event => set('stock', event.target.value)}
										aria-invalid={Boolean(errors.stock)}
										className='h-9 rounded-none text-center font-mono'
									/>
									<StepButton side='right' onClick={() => set('stock', String((parseAmount(draft.stock) || 0) + 1))}>
										+
									</StepButton>
								</div>
							</FormField>
						</div>
						<FormField
							id='product-sku'
							label='SKU'
							action={
								<button
									type='button'
									onClick={() => set('sku', suggestSku(draft.brand, draft.name))}
									disabled={!draft.name.trim()}
									className='inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40'
								>
									<Wand2 className='size-3' />
									Yaratish
								</button>
							}
						>
							<Input
								id='product-sku'
								value={draft.sku}
								onChange={event => set('sku', event.target.value.toUpperCase())}
								placeholder='SONY-ALPHA-A6400'
								className='h-9 font-mono uppercase'
							/>
						</FormField>
					</div>
				</Section>

				<Section index='05' title='Holat'>
					<div className='grid gap-2 sm:grid-cols-3' role='radiogroup' aria-label='Holat'>
						{(Object.keys(PRODUCT_STATUS) as ProductStatus[]).map(value => {
							const checked = draft.status === value
							return (
								<button
									key={value}
									type='button'
									role='radio'
									aria-checked={checked}
									onClick={() => set('status', value)}
									className={cn(
										'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors',
										checked ? 'border-foreground bg-foreground/[0.03] ring-1 ring-foreground' : 'hover:bg-muted/50'
									)}
								>
									<span className={cn('mt-1 flex size-3.5 shrink-0 items-center justify-center rounded-full border', checked && 'border-foreground')}>
										{checked && <span className={cn('size-1.5 rounded-full', PRODUCT_STATUS[value].dot)} />}
									</span>
									<span>
										<span className='block text-sm font-medium'>{PRODUCT_STATUS[value].label}</span>
										<span className='block text-xs text-muted-foreground'>{PRODUCT_STATUS[value].hint}</span>
									</span>
								</button>
							)
						})}
					</div>
				</Section>
			</div>

			<div className='border-t bg-muted/30 p-4'>
				{guardOpen ? (
					<div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
						<p className='flex-1 text-sm'>Saqlanmagan o&apos;zgarishlar yo&apos;qoladi. Yopilsinmi?</p>
						<div className='flex gap-2'>
							<Button type='button' variant='outline' onClick={() => onGuard(false)}>
								Qolish
							</Button>
							<Button type='button' variant='destructive' onClick={() => onGuard(true)}>
								Ha, yopish
							</Button>
						</div>
					</div>
				) : (
					<div className='flex items-center gap-3'>
						<span className='flex min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground'>
							<span className={cn('size-1.5 shrink-0 rounded-full', dirty ? 'bg-amber-500' : 'bg-emerald-500')} />
							<span className='truncate'>{dirty ? "Saqlanmagan o'zgarishlar" : "O'zgarish yo'q"}</span>
							<kbd className='hidden rounded border bg-background px-1 font-mono text-[10px] sm:inline'>Ctrl ↵</kbd>
						</span>
						<Button type='button' variant='outline' onClick={onCancel}>
							Bekor qilish
						</Button>
						<Button type='submit' disabled={saving || (Boolean(product) && !dirty)}>
							{saving && <Loader2 className='animate-spin' />}
							{product ? 'Saqlash' : "Qo'shish"}
						</Button>
					</div>
				)}
			</div>
		</form>
	)
}

const Section = ({ index, title, description, children }: { index: string; title: string; description?: string; children: ReactNode }) => (
	<section className='grid gap-4'>
		<div className='flex items-baseline gap-3 border-b pb-2'>
			<span className='font-mono text-[10px] text-muted-foreground'>{index}</span>
			<h3 className='font-medium'>{title}</h3>
			{description && <p className='ml-auto hidden text-xs text-muted-foreground sm:block'>{description}</p>}
		</div>
		{children}
	</section>
)

const StepButton = ({ side, onClick, children }: { side: 'left' | 'right'; onClick: () => void; children: ReactNode }) => (
	<button
		type='button'
		onClick={onClick}
		className={cn(
			'flex w-9 shrink-0 items-center justify-center border border-input font-mono text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
			side === 'left' ? 'rounded-l-lg border-r-0' : 'rounded-r-lg border-l-0'
		)}
	>
		{children}
	</button>
)

export default ProductEditor
