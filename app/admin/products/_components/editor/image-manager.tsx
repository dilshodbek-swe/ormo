'use client'

import { ArrowLeft, ArrowRight, ImagePlus, Star, Upload, X } from 'lucide-react'
import { type DragEvent, type ReactNode, useId, useState } from 'react'

import { cn } from '@/lib/utils'
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE, MAX_IMAGES, type ProductImage } from '../../_lib/types'
import { ProductImg } from '../product-bits'

interface ImageManagerProps {
	images: ProductImage[]
	onChange: (images: ProductImage[]) => void
	error?: string
}

const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`)

/**
 * Rasmlar: sudrab tashlash yoki tanlash, tartibni sudrab almashtirish, birinchisi — asosiy.
 * Ko'pi bilan MAX_IMAGES ta; tur va hajm tekshiriladi, ortiqchasi sababi bilan rad etiladi.
 */
const ImageManager = ({ images, onChange, error }: ImageManagerProps) => {
	const inputId = useId()
	const [dragOver, setDragOver] = useState(false)
	const [dragIndex, setDragIndex] = useState<number | null>(null)
	const [overIndex, setOverIndex] = useState<number | null>(null)
	const [rejected, setRejected] = useState<string[]>([])

	const free = MAX_IMAGES - images.length

	const addFiles = (files: File[]) => {
		const problems: string[] = []
		const accepted: ProductImage[] = []

		for (const file of files) {
			if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) problems.push(`${file.name} — faqat JPG, PNG, WebP yoki AVIF`)
			else if (file.size > MAX_IMAGE_SIZE) problems.push(`${file.name} — ${formatSize(file.size)}, ko'pi bilan 5 MB`)
			else if (accepted.length >= free) problems.push(`${file.name} — limit: ${MAX_IMAGES} ta rasm`)
			else
				accepted.push({
					id: `new-${crypto.randomUUID()}`,
					url: URL.createObjectURL(file),
					name: file.name,
					file,
				})
		}

		setRejected(problems)
		if (accepted.length) onChange([...images, ...accepted])
	}

	const move = (from: number, to: number) => {
		if (to < 0 || to >= images.length || from === to) return
		const next = [...images]
		const [item] = next.splice(from, 1)
		next.splice(to, 0, item)
		onChange(next)
	}

	const remove = (id: string) => onChange(images.filter(image => image.id !== id))

	// Tashqaridan fayl tashlash (tartibni almashtirishdan farqlash uchun `Files` turi tekshiriladi)
	const isFileDrag = (event: DragEvent) => event.dataTransfer.types.includes('Files')

	return (
		<div className='space-y-3'>
			{/* 10 katakli hisoblagich */}
			<div className='flex items-center gap-3'>
				<div className='flex flex-1 gap-1' aria-hidden>
					{Array.from({ length: MAX_IMAGES }, (_, index) => (
						<span
							key={index}
							className={cn(
								'h-1.5 flex-1 rounded-full transition-colors duration-300',
								index < images.length ? (index === 0 ? 'bg-foreground' : 'bg-foreground/50') : 'bg-border'
							)}
						/>
					))}
				</div>
				<span className={cn('font-mono text-xs tabular-nums', free === 0 ? 'text-foreground' : 'text-muted-foreground')}>
					{images.length}/{MAX_IMAGES}
				</span>
			</div>

			<div
				onDragOver={event => {
					if (!isFileDrag(event)) return
					event.preventDefault()
					setDragOver(true)
				}}
				onDragLeave={() => setDragOver(false)}
				onDrop={event => {
					if (!isFileDrag(event)) return
					event.preventDefault()
					setDragOver(false)
					addFiles([...event.dataTransfer.files])
				}}
				className={cn('grid grid-cols-3 gap-2 rounded-xl transition-colors sm:grid-cols-4', dragOver && 'bg-muted/60 ring-2 ring-foreground/20 ring-offset-4 ring-offset-background')}
			>
				{images.map((image, index) => (
					<div
						key={image.id}
						draggable
						onDragStart={event => {
							setDragIndex(index)
							event.dataTransfer.effectAllowed = 'move'
						}}
						onDragOver={event => {
							if (dragIndex === null) return
							event.preventDefault()
							setOverIndex(index)
						}}
						onDrop={event => {
							if (dragIndex === null) return
							event.preventDefault()
							move(dragIndex, index)
						}}
						onDragEnd={() => {
							setDragIndex(null)
							setOverIndex(null)
						}}
						className={cn(
							'group relative aspect-square cursor-grab overflow-hidden rounded-lg border bg-muted/40 transition-all active:cursor-grabbing',
							index === 0 && 'col-span-2 row-span-2 border-foreground/30',
							dragIndex === index && 'scale-95 opacity-40',
							overIndex === index && dragIndex !== index && 'ring-2 ring-foreground'
						)}
					>
						<ProductImg url={image.url} sizes={index === 0 ? '260px' : '120px'} className={index === 0 ? 'p-6' : 'p-2'} />

						{index === 0 ? (
							<span className='absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background'>
								<Star className='size-3 fill-current' />
								Asosiy
							</span>
						) : (
							<span className='absolute top-1.5 left-1.5 rounded bg-background/90 px-1 font-mono text-[10px] text-muted-foreground'>
								{String(index + 1).padStart(2, '0')}
							</span>
						)}
						{image.file && (
							<span className='absolute right-1.5 bottom-1.5 rounded bg-sky-500 px-1 font-mono text-[9px] font-semibold text-white uppercase'>
								yangi
							</span>
						)}

						{/* Hover amallari: o'chirish, asosiy qilish, chap/o'ng (klaviatura uchun ham) */}
						<button
							type='button'
							aria-label={`${image.name} ni o'chirish`}
							onClick={() => remove(image.id)}
							className='absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-background/95 text-muted-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100'
						>
							<X className='size-3.5' />
						</button>
						<div className='absolute inset-x-1.5 bottom-1.5 flex justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100'>
							{index > 0 && (
								<>
									<TileButton label='Chapga' onClick={() => move(index, index - 1)}>
										<ArrowLeft />
									</TileButton>
									<TileButton label='Asosiy qilish' onClick={() => move(index, 0)}>
										<Star />
									</TileButton>
								</>
							)}
							{index < images.length - 1 && (
								<TileButton label="O'ngga" onClick={() => move(index, index + 1)}>
									<ArrowRight />
								</TileButton>
							)}
						</div>
					</div>
				))}

				{free > 0 && (
					<label
						htmlFor={inputId}
						className={cn(
							'flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed text-center text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/40 hover:text-foreground',
							images.length === 0 && 'col-span-3 aspect-auto py-10 sm:col-span-4',
							error && 'border-destructive/60'
						)}
					>
						{images.length === 0 ? (
							<>
								<span className='flex size-10 items-center justify-center rounded-xl border bg-background'>
									<Upload className='size-4' />
								</span>
								<span className='text-sm font-medium text-foreground'>Rasmlarni shu yerga tashlang</span>
								<span className='text-xs'>yoki bosib tanlang · JPG, PNG, WebP · 5 MB gacha · {MAX_IMAGES} tagacha</span>
							</>
						) : (
							<>
								<ImagePlus className='size-5' />
								<span className='font-mono text-[10px]'>+{free} joy</span>
							</>
						)}
					</label>
				)}
			</div>

			<input
				id={inputId}
				type='file'
				accept={ACCEPTED_IMAGE_TYPES.join(',')}
				multiple
				className='sr-only'
				onChange={event => {
					addFiles([...(event.target.files ?? [])])
					event.target.value = ''
				}}
			/>

			{error && <p className='text-xs text-destructive'>{error}</p>}
			{rejected.length > 0 && (
				<ul className='space-y-1 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300'>
					{rejected.map(problem => (
						<li key={problem}>{problem}</li>
					))}
				</ul>
			)}
			{images.length > 1 && (
				<p className='text-xs text-muted-foreground'>Tartibni sudrab almashtiring — birinchi rasm katalogda asosiy bo&apos;lib ko&apos;rinadi.</p>
			)}
		</div>
	)
}

const TileButton = ({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) => (
	<button
		type='button'
		aria-label={label}
		title={label}
		onClick={onClick}
		className='flex size-6 items-center justify-center rounded-full bg-background/95 text-muted-foreground shadow-sm transition-colors hover:text-foreground [&_svg]:size-3'
	>
		{children}
	</button>
)

export default ImageManager
