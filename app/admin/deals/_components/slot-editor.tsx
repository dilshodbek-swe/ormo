'use client'

import { Check, Search } from 'lucide-react'
import Image from 'next/image'
import { type ReactNode, useState } from 'react'

import FormField from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { catalogProducts } from '@/lib/data/catalog'
import { cn, formatPrice } from '@/lib/utils'
import { discountOf, getProduct, priceFromDiscount, WEEKDAYS, type WeekSlot } from '../_lib/deals'

interface SlotEditorProps {
	slot: WeekSlot | null
	/** Boshqa kunlarga qo'yilgan mahsulotlar (kun nomi bilan) — takrorlanmasin */
	usedElsewhere: (day: number) => Map<string, string>
	/** Bugungi kun indeksi — boshlanmagan kunlarda sotuv hisoblanmaydi */
	todayIndex: number | null
	onClose: () => void
	onSave: (slot: WeekSlot) => void
	onClear: (day: number) => void
}

const SlotEditor = ({ slot, usedElsewhere, todayIndex, onClose, onSave, onClear }: SlotEditorProps) => (
	<Sheet open={Boolean(slot)} onOpenChange={open => !open && onClose()}>
		<SheetContent className='w-full gap-0 overflow-hidden p-0 data-[side=right]:sm:max-w-lg'>
			{slot && (
				<EditorForm
					key={slot.day}
					slot={slot}
					sold={todayIndex !== null && slot.day <= todayIndex ? slot.sold : 0}
					used={usedElsewhere(slot.day)}
					onSave={onSave}
					onClear={onClear}
					onCancel={onClose}
				/>
			)}
		</SheetContent>
	</Sheet>
)

interface EditorFormProps {
	slot: WeekSlot
	/** Shu kun boshlangan bo'lsa — sotilgan dona, aks holda 0 */
	sold: number
	used: Map<string, string>
	onSave: SlotEditorProps['onSave']
	onClear: SlotEditorProps['onClear']
	onCancel: () => void
}

const EditorForm = ({ slot, sold, used, onSave, onClear, onCancel }: EditorFormProps) => {
	const [productId, setProductId] = useState(slot.productId)
	const [price, setPrice] = useState(slot.productId ? String(slot.dealPrice) : '')
	const [limit, setLimit] = useState(slot.limit === null ? '' : String(slot.limit))
	const [query, setQuery] = useState('')
	const [submitted, setSubmitted] = useState(false)

	const product = getProduct(productId)
	const priceValue = Number(price.replace(/\s/g, ''))
	const limitValue = limit.trim() ? Number(limit) : null
	const discount = product && Number.isFinite(priceValue) ? discountOf(product, priceValue) : 0

	const errors: Record<string, string> = {}
	if (!product) errors.product = 'Mahsulot tanlang'
	if (product && (!Number.isInteger(priceValue) || priceValue <= 0)) errors.price = 'Musbat narx kiriting'
	else if (product && priceValue > product.price) errors.price = `Odatiy narxdan (${formatPrice(product.price)}) oshmasin`
	if (limitValue !== null && (!Number.isInteger(limitValue) || limitValue < 1)) errors.limit = 'Kamida 1 dona'
	else if (limitValue !== null && product?.id === slot.productId && limitValue < sold) errors.limit = `Allaqachon ${sold} dona sotilgan`
	const shown = submitted ? errors : {}

	const q = query.trim().toLowerCase()
	const options = catalogProducts.filter(item => !q || `${item.brand} ${item.name}`.toLowerCase().includes(q))

	const pick = (id: string) => {
		const next = getProduct(id)
		if (!next) return
		setProductId(id)
		// Yangi mahsulotda — uning hozirgi chegirmali narxidan boshlaymiz
		if (id !== productId) setPrice(String(next.price))
	}

	return (
		<form
			noValidate
			onSubmit={event => {
				event.preventDefault()
				setSubmitted(true)
				if (Object.keys(errors).length || !product) return
				onSave({ ...slot, productId: product.id, dealPrice: priceValue, limit: limitValue, sold: product.id === slot.productId ? slot.sold : 0 })
			}}
			className='flex h-full min-h-0 flex-col'
		>
			<div className='border-b p-5 pr-12'>
				<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>Kun taklifi</p>
				<SheetTitle className='mt-1 font-space-grotesk text-2xl font-bold tracking-tight'>{WEEKDAYS[slot.day]}</SheetTitle>
				<SheetDescription className='text-xs'>Shu kuni /deals sahifasida 00:00 dan 23:59 gacha ko&apos;rinadi</SheetDescription>
			</div>

			<div className='flex-1 space-y-6 overflow-y-auto p-5'>
				<Section index='01' title='Mahsulot' error={shown.product}>
					<label className='flex h-9 items-center rounded-md border bg-background focus-within:ring-3 focus-within:ring-ring/30'>
						<Search className='ml-3 size-4 shrink-0 text-muted-foreground' />
						<input
							value={query}
							onChange={event => setQuery(event.target.value)}
							placeholder='Mahsulot yoki brend...'
							aria-label='Mahsulot qidirish'
							className='h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground'
						/>
					</label>
					<ul className='max-h-64 space-y-0.5 overflow-y-auto rounded-lg border p-1' role='listbox' aria-label='Mahsulotlar'>
						{options.map(item => {
							const selected = item.id === productId
							const elsewhere = used.get(item.id)
							return (
								<li key={item.id}>
									<button
										type='button'
										role='option'
										aria-selected={selected}
										onClick={() => pick(item.id)}
										className={cn('flex w-full items-center gap-3 rounded-md p-1.5 text-left transition-colors', selected ? 'bg-foreground text-background' : 'hover:bg-muted')}
									>
										<span className='relative size-10 shrink-0 overflow-hidden rounded-md bg-white'>
											<Image src={item.image} alt='' fill sizes='40px' className='object-contain p-1 mix-blend-multiply' />
										</span>
										<span className='min-w-0 flex-1'>
											<span className='block truncate text-sm'>{item.name}</span>
											<span className={cn('block font-mono text-[11px]', selected ? 'text-background/70' : 'text-muted-foreground')}>
												{item.brand} · {formatPrice(item.price)}
												{elsewhere && ` · ${elsewhere}da bor`}
											</span>
										</span>
										{selected && <Check className='size-4 shrink-0' />}
									</button>
								</li>
							)
						})}
						{options.length === 0 && <li className='p-4 text-center text-xs text-muted-foreground'>Topilmadi</li>}
					</ul>
				</Section>

				{product && (
					<Section index='02' title='Kun narxi'>
						{/* Chegirma surgichi — narx bilan ikki tomonlama bog'langan */}
						<div className='space-y-3 rounded-xl border p-4'>
							<div className='flex items-end justify-between gap-3'>
								<div>
									<p className='font-space-grotesk text-3xl font-bold tracking-tight tabular-nums'>−{discount}%</p>
									<p className='text-xs text-muted-foreground'>asl narx {formatPrice(product.oldPrice)} dan</p>
								</div>
								<div className='text-right'>
									<p className='font-mono text-sm font-semibold tabular-nums'>{Number.isFinite(priceValue) ? formatPrice(priceValue) : '—'}</p>
									<p className='font-mono text-[11px] text-emerald-600 dark:text-emerald-400'>
										{Number.isFinite(priceValue) && product.oldPrice > priceValue ? `${formatPrice(product.oldPrice - priceValue)} tejaydi` : ''}
									</p>
								</div>
							</div>
							<input
								type='range'
								min={discountOf(product, product.price)}
								max={80}
								step={1}
								value={Math.min(Math.max(discount, discountOf(product, product.price)), 80)}
								onChange={event => setPrice(String(priceFromDiscount(product, Number(event.target.value))))}
								aria-label='Chegirma foizi'
								className='w-full accent-foreground'
							/>
							<div className='flex justify-between font-mono text-[10px] text-muted-foreground'>
								<span>odatiy −{discountOf(product, product.price)}%</span>
								<span>−80%</span>
							</div>
						</div>
						<FormField id='deal-price' label="Aniq narx (so'm)" error={shown.price} hint={`Odatiy narx: ${formatPrice(product.price)}`}>
							<Input
								id='deal-price'
								inputMode='numeric'
								value={price}
								onChange={event => setPrice(event.target.value)}
								aria-invalid={Boolean(shown.price)}
								className='h-9 font-mono'
							/>
						</FormField>
					</Section>
				)}

				{product && (
					<Section index='03' title='Limit'>
						<FormField
							id='deal-limit'
							label='Shu kunga dona'
							error={shown.limit}
							hint={limit.trim() ? `Tugagach "Tugadi" deb ko'rsatiladi · ${product.id === slot.productId ? sold : 0} sotilgan` : 'Bo‘sh — ombordagi qoldiqcha'}
						>
							<Input
								id='deal-limit'
								inputMode='numeric'
								value={limit}
								onChange={event => setLimit(event.target.value)}
								placeholder='∞'
								aria-invalid={Boolean(shown.limit)}
								className='h-9 w-32 font-mono'
							/>
						</FormField>
					</Section>
				)}
			</div>

			<div className='flex items-center gap-2 border-t bg-muted/30 p-4'>
				{slot.productId && (
					<Button type='button' variant='ghost' className='text-destructive hover:bg-destructive/10 hover:text-destructive' onClick={() => onClear(slot.day)}>
						Kunni bo&apos;shatish
					</Button>
				)}
				<span className='flex-1' />
				<Button type='button' variant='outline' onClick={onCancel}>
					Bekor qilish
				</Button>
				<Button type='submit'>Saqlash</Button>
			</div>
		</form>
	)
}

const Section = ({ index, title, error, children }: { index: string; title: string; error?: string; children: ReactNode }) => (
	<section className='grid gap-3'>
		<div className='flex items-baseline gap-3 border-b pb-2'>
			<span className='font-mono text-[10px] text-muted-foreground'>{index}</span>
			<h3 className='font-medium'>{title}</h3>
			{error && <span className='ml-auto text-xs text-destructive' role='alert'>{error}</span>}
		</div>
		{children}
	</section>
)

export default SlotEditor
