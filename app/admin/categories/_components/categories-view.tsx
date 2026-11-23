'use client'

import { Check, FolderPlus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import PageHeader from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import type { ProductCategory } from '@/lib/data/products'
import { sampleProducts } from '../../products/_lib/sample-products'
import { sampleCategories } from '../_lib/sample-categories'
import { type AdminCategory, type CategoryDraft, getCategoryStats } from '../_lib/types'
import CategoryBoard, { type CategoryActions } from './category-board'
import CategoryEditor, { type CategoryEditorState } from './category-editor'
import CategoryShare from './category-share'
import DeleteCategoryDialog from './delete-category-dialog'
import StorefrontPreview from './storefront-preview'

const pad = (value: number) => String(value).padStart(2, '0')
const nowIso = () => {
	const date = new Date()
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const releaseBlob = (url?: string) => {
	if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
}

/**
 * Kategoriyalar CRUD (namunaviy rejim): tartib, ko'rinish, yaratish/tahrirlash va o'chirish
 * shu sahifa xotirasida. Mahsulotlar soni namunaviy katalogdan hisoblanadi; slug o'zgarsa yoki
 * kategoriya o'chirilsa, mahsulotlar ham shu yerda ko'chiriladi. Backend ulanganda har bir amal —
 * `requireAdmin()` bilan himoyalangan Server Action (o'chirish va ko'chirish bitta tranzaksiyada).
 */
const CategoriesView = () => {
	const [categories, setCategories] = useState(sampleCategories)
	const [products, setProducts] = useState(sampleProducts)
	const [editor, setEditor] = useState<CategoryEditorState>(null)
	const [deleting, setDeleting] = useState<AdminCategory | null>(null)
	const [toast, setToast] = useState<{ id: number; text: string } | null>(null)

	useEffect(() => {
		if (!toast) return
		const timer = setTimeout(() => setToast(null), 3200)
		return () => clearTimeout(timer)
	}, [toast])
	const notify = (text: string) => setToast({ id: Date.now(), text })

	// "N" — yangi kategoriya (matn yozilmayotganda, oyna yopiq bo'lsa)
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			if (event.metaKey || event.ctrlKey || event.altKey || event.key.toLowerCase() !== 'n') return
			if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return
			if (document.querySelector('[role=dialog]')) return
			event.preventDefault()
			setEditor({ mode: 'create' })
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	const stats = Object.fromEntries(categories.map(category => [category.id, getCategoryStats(category.id, products)]))
	const productCount = (id: string) => stats[id]?.total ?? 0
	const visibleCount = categories.filter(category => category.visible).length
	const uncategorized = products.filter(product => !categories.some(category => category.id === product.category)).length

	/** Mahsulotlarni bir kategoriyadan boshqasiga o'tkazadi (slug o'zgarganda yoki o'chirishda) */
	const moveProducts = (from: string, to: string) =>
		setProducts(list => list.map(product => (product.category === from ? { ...product, category: to as ProductCategory } : product)))

	const save = async (draft: CategoryDraft, existing?: AdminCategory) => {
		await new Promise(resolve => setTimeout(resolve, 400)) // namunaviy "tarmoq"
		const now = nowIso()
		const fields = {
			id: draft.slug.trim(),
			title: draft.title.trim(),
			description: draft.description.trim(),
			image: draft.image,
			visible: draft.visible,
			updatedAt: now,
		}

		if (existing) {
			if (existing.image?.url !== draft.image?.url) releaseBlob(existing.image?.url)
			if (fields.id !== existing.id) moveProducts(existing.id, fields.id)
			setCategories(list => list.map(category => (category.id === existing.id ? { ...category, ...fields } : category)))
			notify(`«${fields.title}» saqlandi`)
		} else {
			setCategories(list => [...list, { ...fields, createdAt: now }])
			notify(`«${fields.title}» yaratildi — ro'yxat oxirida`)
		}
		setEditor(null)
	}

	const actions: CategoryActions = {
		onEdit: category => setEditor({ mode: 'edit', category }),
		onToggleVisible: category => {
			setCategories(list => list.map(item => (item.id === category.id ? { ...item, visible: !item.visible, updatedAt: nowIso() } : item)))
			notify(category.visible ? `«${category.title}» do'kondan yashirildi` : `«${category.title}» do'konda ko'rinadi`)
		},
		onMove: (from, to) => {
			if (to < 0 || to >= categories.length || from === to) return
			const next = [...categories]
			const [item] = next.splice(from, 1)
			next.splice(to, 0, item)
			setCategories(next)
			notify(`«${item.title}» ${to + 1}-o'ringa ko'chirildi`)
		},
		onDelete: category => setDeleting(category),
	}

	const confirmDelete = (category: AdminCategory, moveTo?: string) => {
		const count = productCount(category.id)
		if (moveTo) moveProducts(category.id, moveTo)
		releaseBlob(category.image?.url)
		setCategories(list => list.filter(item => item.id !== category.id))
		setDeleting(null)
		const target = categories.find(item => item.id === moveTo)
		notify(target ? `«${category.title}» o'chirildi · ${count} mahsulot → ${target.title}` : `«${category.title}» o'chirildi`)
	}

	return (
		<>
			<PageHeader
				eyebrow={`Admin · Katalog · ${categories.length} ta`}
				title={
					<>
						Kategoriyalar <span className='text-muted-foreground'>· {visibleCount} ko&apos;rinadi</span>
					</>
				}
				description="Tartibni sudrab o'zgartiring — do'kon bosh sahifasi o'ngdagi ko'rinishda darhol yangilanadi."
				action={
					<Button onClick={() => setEditor({ mode: 'create' })} className='h-9'>
						<Plus />
						Yangi kategoriya
						<kbd className='rounded border border-background/30 px-1 font-mono text-[10px] opacity-70'>N</kbd>
					</Button>
				}
			/>

			<div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-start'>
				<div className='space-y-3'>
					{categories.length === 0 ? (
						<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center'>
							<span className='flex size-11 items-center justify-center rounded-xl border bg-background text-muted-foreground'>
								<FolderPlus className='size-5' />
							</span>
							<p className='font-medium'>Kategoriya yo&apos;q</p>
							<Button onClick={() => setEditor({ mode: 'create' })}>Birinchisini yaratish</Button>
						</div>
					) : (
						<CategoryBoard categories={categories} stats={stats} totalProducts={products.length} actions={actions} />
					)}
					<p className='px-1 font-mono text-[11px] text-muted-foreground'>
						{uncategorized > 0 && `${uncategorized} ta mahsulot kategoriyasiz · `}namunaviy rejim — o&apos;zgarishlar sahifa yangilanguncha saqlanadi
					</p>
				</div>

				<aside className='grid gap-4 md:grid-cols-2 md:items-start xl:sticky xl:top-20 xl:grid-cols-1'>
					<StorefrontPreview categories={categories} />
					<CategoryShare categories={categories} stats={stats} totalProducts={products.length} />
				</aside>
			</div>

			<CategoryEditor
				state={editor}
				takenSlugs={exceptId => categories.filter(category => category.id !== exceptId).map(category => category.id)}
				productCount={productCount}
				onClose={() => setEditor(null)}
				onSave={save}
			/>
			<DeleteCategoryDialog
				category={deleting}
				categories={categories}
				productCount={productCount}
				onClose={() => setDeleting(null)}
				onConfirm={confirmDelete}
			/>

			{toast && (
				<div
					key={toast.id}
					role='status'
					className='fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm animate-in items-center gap-2.5 rounded-xl border bg-foreground px-4 py-3 text-sm text-background shadow-2xl fade-in slide-in-from-bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6'
				>
					<span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white'>
						<Check className='size-3' />
					</span>
					<span className='min-w-0 truncate'>{toast.text}</span>
				</div>
			)}
		</>
	)
}

export default CategoriesView
