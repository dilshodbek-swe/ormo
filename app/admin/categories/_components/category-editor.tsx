'use client'

import { ArrowUpRight, Loader2, RefreshCw, Upload, X } from 'lucide-react'
import { type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react'

import FormField from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn, slugify } from '@/lib/utils'
import {
	ACCEPTED_IMAGE_TYPES,
	type AdminCategory,
	type CategoryDraft,
	DESCRIPTION_LIMIT,
	draftFromCategory,
	emptyCategoryDraft,
	MAX_IMAGE_SIZE,
	validateCategory,
} from '../_lib/types'
import { CategoryImg } from './category-bits'

export type CategoryEditorState = { mode: 'create' } | { mode: 'edit'; category: AdminCategory } | null

interface CategoryEditorProps {
	state: CategoryEditorState
	/** Band manzillar (tahrirlanayotgan kategoriyaning o'zidan tashqari) */
	takenSlugs: (exceptId?: string) => string[]
	productCount: (id: string) => number
	onClose: () => void
	onSave: (draft: CategoryDraft, category?: AdminCategory) => Promise<void>
}

const CategoryEditor = ({ state, takenSlugs, productCount, onClose, onSave }: CategoryEditorProps) => (
	<Sheet open={Boolean(state)} onOpenChange={open => !open && onClose()}>
		<SheetContent className='w-full gap-0 overflow-hidden p-0 data-[side=right]:sm:max-w-xl'>
			{state && (
				<EditorForm
					key={state.mode === 'edit' ? state.category.id : 'new'}
					category={state.mode === 'edit' ? state.category : undefined}
					taken={takenSlugs(state.mode === 'edit' ? state.category.id : undefined)}
					productCount={state.mode === 'edit' ? productCount(state.category.id) : 0}
					onSave={onSave}
					onCancel={onClose}
				/>
			)}
		</SheetContent>
	</Sheet>
)

interface EditorFormProps {
	category?: AdminCategory
	taken: string[]
	productCount: number
	onSave: CategoryEditorProps['onSave']
	onCancel: () => void
}

const EditorForm = ({ category, taken, productCount, onSave, onCancel }: EditorFormProps) => {
	const [initial] = useState(() => (category ? draftFromCategory(category) : emptyCategoryDraft()))
	const [draft, setDraft] = useState(initial)
	const [submitted, setSubmitted] = useState(false)
	const [saving, setSaving] = useState(false)
	const [fileError, setFileError] = useState('')
	const [dragOver, setDragOver] = useState(false)
	const inputId = useId()

	const errors = submitted ? validateCategory(draft, taken) : {}
	// Manzil bandligi darhol ko'rinsin — saqlashni kutmasdan
	const slugTaken = draft.slug.trim() && taken.includes(draft.slug.trim())
	const dirty = JSON.stringify({ ...draft, image: draft.image?.url }) !== JSON.stringify({ ...initial, image: initial.image?.url })
	const slugChanged = category && draft.slug.trim() !== category.id

	// Saqlanmasdan yopilsa — shu sessiyada tanlangan rasmning blob URL'ini bo'shatamiz
	const imageRef = useRef(draft.image)
	const savedRef = useRef(false)
	useEffect(() => {
		imageRef.current = draft.image
	}, [draft.image])
	useEffect(
		() => () => {
			const url = imageRef.current?.url
			if (!savedRef.current && url?.startsWith('blob:') && url !== initial.image?.url) URL.revokeObjectURL(url)
		},
		[initial]
	)

	const setTitle = (title: string) =>
		setDraft(current => ({ ...current, title, slug: current.slugTouched ? current.slug : slugify(title) }))

	const pickFile = (file?: File) => {
		if (!file) return
		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return setFileError('Faqat JPG, PNG, WebP yoki AVIF')
		if (file.size > MAX_IMAGE_SIZE) return setFileError("Rasm 5 MB dan oshmasin")
		setFileError('')
		const previous = draft.image?.url
		if (previous?.startsWith('blob:') && previous !== initial.image?.url) URL.revokeObjectURL(previous)
		setDraft(current => ({ ...current, image: { url: URL.createObjectURL(file), name: file.name, file } }))
	}

	const submit = async (event?: FormEvent) => {
		event?.preventDefault()
		setSubmitted(true)
		if (Object.keys(validateCategory(draft, taken)).length) return
		setSaving(true)
		savedRef.current = true
		await onSave(draft, category)
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
					{category ? `Tahrirlash · ${productCount} mahsulot` : 'Yangi kategoriya'}
				</p>
				<SheetTitle className='mt-1 truncate font-space-grotesk text-2xl font-bold tracking-tight'>
					{draft.title.trim() || 'Nomsiz kategoriya'}
				</SheetTitle>
				<SheetDescription className='mt-0.5 truncate font-mono text-xs'>/catalog?category={draft.slug || '…'}</SheetDescription>
			</div>

			<div className='flex-1 space-y-6 overflow-y-auto p-5'>
				{/* Rasm + do'kondagi karta ko'rinishi yonma-yon */}
				<div className='grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]'>
					<div className='space-y-2'>
						<p className='text-sm font-medium'>Rasm</p>
						<label
							htmlFor={inputId}
							onDragOver={event => {
								event.preventDefault()
								setDragOver(true)
							}}
							onDragLeave={() => setDragOver(false)}
							onDrop={event => {
								event.preventDefault()
								setDragOver(false)
								pickFile(event.dataTransfer.files[0])
							}}
							className={cn(
								'group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[14px_14px] text-center transition-colors hover:border-foreground/40',
								dragOver && 'border-foreground bg-muted/50',
								(errors.image || fileError) && 'border-destructive/60'
							)}
						>
							{draft.image ? (
								<>
									<CategoryImg image={draft.image} sizes='320px' className='p-6' />
									<span className='absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-background/90 py-2 text-xs opacity-0 backdrop-blur transition-opacity group-hover:opacity-100'>
										<RefreshCw className='size-3.5' />
										Almashtirish
									</span>
								</>
							) : (
								<>
									<span className='flex size-10 items-center justify-center rounded-xl border bg-background'>
										<Upload className='size-4 text-muted-foreground' />
									</span>
									<span className='text-sm font-medium'>Rasmni tashlang yoki tanlang</span>
									<span className='text-xs text-muted-foreground'>Oq yoki shaffof fon · 5 MB gacha</span>
								</>
							)}
						</label>
						<input
							id={inputId}
							type='file'
							accept={ACCEPTED_IMAGE_TYPES.join(',')}
							className='sr-only'
							onChange={event => {
								pickFile(event.target.files?.[0])
								event.target.value = ''
							}}
						/>
						<div className='flex items-center justify-between gap-2 text-xs'>
							<span className={cn('truncate', errors.image || fileError ? 'text-destructive' : 'text-muted-foreground')}>
								{fileError || errors.image || draft.image?.name || 'Rasm tanlanmagan'}
							</span>
							{draft.image && (
								<button
									type='button'
									onClick={() => setDraft(current => ({ ...current, image: null }))}
									className='inline-flex shrink-0 items-center gap-1 text-muted-foreground hover:text-destructive'
								>
									<X className='size-3' />
									Olib tashlash
								</button>
							)}
						</div>
					</div>

					<div className='space-y-2'>
						<p className='text-sm font-medium'>Do&apos;konda</p>
						<div className={cn('flex flex-col overflow-hidden rounded-xl border bg-background', !draft.visible && 'opacity-50')}>
							<div className='relative aspect-square bg-white dark:bg-muted/40'>
								<CategoryImg image={draft.image} sizes='176px' className='p-4' />
							</div>
							<div className='flex items-start justify-between gap-2 border-t p-3'>
								<div className='min-w-0 space-y-0.5'>
									<p className='truncate font-space-grotesk text-sm font-semibold'>{draft.title || 'Nomi'}</p>
									<p className='line-clamp-2 text-[10px] leading-snug text-muted-foreground'>{draft.description || 'Qisqa tavsif'}</p>
								</div>
								<ArrowUpRight className='size-3.5 shrink-0 text-muted-foreground' />
							</div>
						</div>
						{!draft.visible && <p className='text-center font-mono text-[10px] text-muted-foreground'>yashirin</p>}
					</div>
				</div>

				<FormField id='category-title' label='Nomi' error={errors.title}>
					<Input
						id='category-title'
						value={draft.title}
						onChange={event => setTitle(event.target.value)}
						placeholder='Kameralar'
						autoFocus={!category}
						aria-invalid={Boolean(errors.title)}
						className='h-9'
					/>
				</FormField>

				<FormField
					id='category-slug'
					label='Manzil'
					error={errors.slug || (slugTaken ? `«${draft.slug.trim()}» band — boshqa nom tanlang` : undefined)}
					action={
						draft.slugTouched && (
							<button
								type='button'
								onClick={() => setDraft(current => ({ ...current, slug: slugify(current.title), slugTouched: false }))}
								className='text-xs text-muted-foreground hover:text-foreground'
							>
								Nomdan yaratish
							</button>
						)
					}
					hint={
						slugChanged && productCount > 0
							? `${productCount} ta mahsulot yangi manzilga ko'chiriladi; eski havolalar ishlamay qoladi`
							: 'Katalog havolasida ishlatiladi'
					}
				>
					<div className='flex h-9 overflow-hidden rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 aria-invalid:border-destructive'>
						<span className='flex items-center border-r bg-muted/50 px-2.5 font-mono text-xs text-muted-foreground'>?category=</span>
						<input
							id='category-slug'
							value={draft.slug}
							onChange={event =>
								setDraft(current => ({ ...current, slug: event.target.value.toLowerCase().replace(/\s+/g, '-'), slugTouched: true }))
							}
							placeholder='kameralar'
							aria-invalid={Boolean(errors.slug || slugTaken)}
							className='min-w-0 flex-1 bg-transparent px-2.5 font-mono text-sm outline-none'
						/>
					</div>
				</FormField>

				<FormField
					id='category-description'
					label='Tavsif'
					error={errors.description}
					action={
						<span className={cn('font-mono text-[10px]', draft.description.length > DESCRIPTION_LIMIT ? 'text-destructive' : 'text-muted-foreground')}>
							{draft.description.length}/{DESCRIPTION_LIMIT}
						</span>
					}
				>
					<Textarea
						id='category-description'
						value={draft.description}
						onChange={event => setDraft(current => ({ ...current, description: event.target.value }))}
						rows={3}
						placeholder="Bosh sahifadagi kartada nom ostida ko'rinadi"
						aria-invalid={Boolean(errors.description)}
					/>
				</FormField>

				<label className='flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/30'>
					<span>
						<span className='block text-sm font-medium'>Do&apos;konda ko&apos;rsatish</span>
						<span className='block text-xs text-muted-foreground'>
							O&apos;chirilsa, kategoriya va uning filtri katalogdan yashiriladi — mahsulotlar joyida qoladi
						</span>
					</span>
					<Switch checked={draft.visible} onCheckedChange={visible => setDraft(current => ({ ...current, visible }))} />
				</label>
			</div>

			<Footer>
				<span className='flex min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground'>
					<span className={cn('size-1.5 shrink-0 rounded-full', dirty ? 'bg-amber-500' : 'bg-emerald-500')} />
					<span className='truncate'>{dirty ? "Saqlanmagan o'zgarishlar" : "O'zgarish yo'q"}</span>
				</span>
				<Button type='button' variant='outline' onClick={onCancel}>
					Bekor qilish
				</Button>
				<Button type='submit' disabled={saving || (Boolean(category) && !dirty)}>
					{saving && <Loader2 className='animate-spin' />}
					{category ? 'Saqlash' : 'Yaratish'}
				</Button>
			</Footer>
		</form>
	)
}

const Footer = ({ children }: { children: ReactNode }) => <div className='flex items-center gap-3 border-t bg-muted/30 p-4'>{children}</div>

export default CategoryEditor
