'use client'

import { Check, PackagePlus, PackageSearch, Plus } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import PageHeader from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { sampleProducts } from '../_lib/sample-products'
import {
	type AdminProduct,
	categoryLabel,
	cleanSpecs,
	parseAmount,
	type ProductDraft,
	PRODUCT_STATUS,
	type ProductStatus,
	slugify,
} from '../_lib/types'
import DeleteDialog from './delete-dialog'
import ProductEditor, { type EditorState } from './editor/product-editor'
import type { ProductActions } from './product-bits'
import ProductGrid from './product-grid'
import ProductList from './product-list'
import ProductsStats from './products-stats'
import ProductsToolbar, { type CategoryFilter, type SortKey, type StatusFilter, type ViewMode } from './products-toolbar'

/* Ko'rinish tanlovi (kartalar/ro'yxat) — faqat shu brauzer uchun qulaylik; storage yopiq bo'lsa xotirada */
const VIEW_KEY = 'ormo:admin-products-view'
const VIEW_EVENT = 'ormo:admin-products-view'
let viewFallback: ViewMode = 'grid'

const readView = (): ViewMode => {
	try {
		const saved = localStorage.getItem(VIEW_KEY)
		if (saved === 'grid' || saved === 'list') return saved
	} catch {}
	return viewFallback
}

const subscribeView = (onChange: () => void) => {
	window.addEventListener(VIEW_EVENT, onChange)
	window.addEventListener('storage', onChange)
	return () => {
		window.removeEventListener(VIEW_EVENT, onChange)
		window.removeEventListener('storage', onChange)
	}
}

const sorters: Record<SortKey, (a: AdminProduct, b: AdminProduct) => number> = {
	updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
	name: (a, b) => a.name.localeCompare(b.name),
	price: (a, b) => b.price - a.price,
	stock: (a, b) => a.stock - b.stock,
}

const pad = (value: number) => String(value).padStart(2, '0')
const nowIso = () => {
	const date = new Date()
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/** Boshqa mahsulotda ishlatilmayotgan blob: rasmlarni xotiradan bo'shatadi */
const releaseImages = (removed: AdminProduct['images'], remaining: AdminProduct[]) => {
	const inUse = new Set(remaining.flatMap(product => product.images.map(image => image.url)))
	removed.forEach(image => {
		if (image.url.startsWith('blob:') && !inUse.has(image.url)) URL.revokeObjectURL(image.url)
	})
}

/**
 * Mahsulotlar CRUD (namunaviy rejim): barcha o'zgarishlar shu sahifa xotirasida.
 * Backend ulanganda onSave/onDelete — `requireAdmin()` bilan himoyalangan Server Action'lar,
 * yangi rasmlar (`image.file`) esa saqlashdan oldin storage'ga yuklanadi.
 */
const ProductsView = () => {
	const [products, setProducts] = useState(sampleProducts)
	const [status, setStatus] = useState<StatusFilter>('all')
	const [category, setCategory] = useState<CategoryFilter>('all')
	const [query, setQuery] = useState('')
	const [sort, setSort] = useState<SortKey>('updated')
	const view = useSyncExternalStore(subscribeView, readView, () => 'grid' as ViewMode)
	const [editor, setEditor] = useState<EditorState>(null)
	const [deleting, setDeleting] = useState<AdminProduct | null>(null)
	const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
	const searchRef = useRef<HTMLInputElement>(null)

	const changeView = (value: ViewMode) => {
		viewFallback = value
		try {
			localStorage.setItem(VIEW_KEY, value)
		} catch {}
		window.dispatchEvent(new Event(VIEW_EVENT))
	}

	// "/" — qidiruv, "N" — yangi mahsulot (matn yozilmayotganda, panel yopiq bo'lsa)
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			if (event.metaKey || event.ctrlKey || event.altKey) return
			if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return
			if (document.querySelector('[role=dialog]')) return
			if (event.key === '/') {
				event.preventDefault()
				searchRef.current?.focus()
			} else if (event.key.toLowerCase() === 'n') {
				event.preventDefault()
				setEditor({ mode: 'create' })
			}
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	useEffect(() => {
		if (!toast) return
		const timer = setTimeout(() => setToast(null), 3200)
		return () => clearTimeout(timer)
	}, [toast])
	const notify = (text: string) => setToast({ id: Date.now(), text })

	const q = query.trim().toLowerCase()
	const searched = products.filter(
		product =>
			(category === 'all' || product.category === category) &&
			(!q || `${product.name} ${product.brand} ${product.sku} ${product.id}`.toLowerCase().includes(q))
	)
	const statusCounts = {
		all: searched.length,
		...Object.fromEntries((Object.keys(PRODUCT_STATUS) as ProductStatus[]).map(key => [key, searched.filter(product => product.status === key).length])),
	} as Record<StatusFilter, number>
	const visible = searched.filter(product => status === 'all' || product.status === status).sort(sorters[sort])

	const save = async (draft: ProductDraft, existing?: AdminProduct) => {
		const now = nowIso()
		const price = parseAmount(draft.price)
		const oldPrice = parseAmount(draft.oldPrice)
		const fields = {
			name: draft.name.trim(),
			brand: draft.brand.trim(),
			category: draft.category,
			description: draft.description.trim(),
			price,
			oldPrice: Number.isFinite(oldPrice) && oldPrice > price ? oldPrice : price,
			stock: parseAmount(draft.stock),
			sku: draft.sku.trim(),
			status: draft.status,
			images: draft.images,
			specs: cleanSpecs(draft.specs),
			updatedAt: now,
		}

		// Namunaviy "tarmoq" kechikishi — haqiqiy saqlash shu yerga keladi
		await new Promise(resolve => setTimeout(resolve, 450))

		if (existing) {
			const next = products.map(product => (product.id === existing.id ? { ...product, ...fields } : product))
			releaseImages(existing.images.filter(image => !draft.images.some(kept => kept.id === image.id)), next)
			setProducts(next)
			notify(`«${fields.name}» saqlandi`)
		} else {
			const base = slugify(`${fields.brand} ${fields.name}`) || 'mahsulot'
			let id = base
			for (let index = 2; products.some(product => product.id === id); index++) id = `${base}-${index}`
			setProducts(list => [{ id, ...fields, createdAt: now }, ...list])
			setSort('updated')
			notify(`«${fields.name}» qo'shildi · ${categoryLabel(fields.category)}`)
		}
		setEditor(null)
	}

	const actions: ProductActions = {
		onEdit: product => setEditor({ mode: 'edit', product }),
		onDuplicate: product => {
			const now = nowIso()
			let id = `${product.id}-nusxa`
			for (let index = 2; products.some(item => item.id === id); index++) id = `${product.id}-nusxa-${index}`
			const copy: AdminProduct = {
				...product,
				id,
				name: `${product.name} (nusxa)`,
				sku: product.sku ? `${product.sku}-COPY` : '',
				status: 'draft',
				images: product.images.map(image => ({ ...image, id: `${image.id}-${id}` })),
				createdAt: now,
				updatedAt: now,
			}
			setProducts(list => [copy, ...list])
			notify('Nusxa qoralama sifatida yaratildi')
		},
		onToggleArchive: product => {
			const archived = product.status === 'archived'
			setProducts(list =>
				list.map(item => (item.id === product.id ? { ...item, status: archived ? 'draft' : 'archived', updatedAt: nowIso() } : item))
			)
			notify(archived ? `«${product.name}» qoralamaga qaytarildi` : `«${product.name}» arxivlandi`)
		},
		onDelete: product => setDeleting(product),
	}

	const confirmDelete = (product: AdminProduct) => {
		const next = products.filter(item => item.id !== product.id)
		releaseImages(product.images, next)
		setProducts(next)
		setDeleting(null)
		notify(`«${product.name}» o'chirildi`)
	}

	const resetFilters = () => {
		setStatus('all')
		setCategory('all')
		setQuery('')
	}

	return (
		<>
			<PageHeader
				eyebrow={`Admin · Katalog · ${products.length} ta`}
				title='Mahsulotlar'
				description="Katalogni boshqaring: qo'shing, tahrirlang, arxivlang. Har bir mahsulotga 10 tagacha rasm."
				action={
					<Button onClick={() => setEditor({ mode: 'create' })} className='h-9'>
						<Plus />
						Yangi mahsulot
						<kbd className='rounded border border-background/30 px-1 font-mono text-[10px] opacity-70'>N</kbd>
					</Button>
				}
			/>

			<div className='space-y-6'>
				<ProductsStats products={products} />

				<ProductsToolbar
					status={status}
					onStatusChange={setStatus}
					statusCounts={statusCounts}
					category={category}
					onCategoryChange={setCategory}
					query={query}
					onQueryChange={setQuery}
					sort={sort}
					onSortChange={setSort}
					view={view}
					onViewChange={changeView}
					searchRef={searchRef}
				/>

				{products.length === 0 ? (
					<EmptyState
						icon={<PackagePlus className='size-5' />}
						title="Katalog bo'sh"
						text="Birinchi mahsulotni qo'shing — u shu yerda paydo bo'ladi."
						action={<Button onClick={() => setEditor({ mode: 'create' })}>Mahsulot qo&apos;shish</Button>}
					/>
				) : visible.length === 0 ? (
					<EmptyState
						icon={<PackageSearch className='size-5' />}
						title='Hech narsa topilmadi'
						text="Filtr yoki qidiruv so'zini o'zgartirib ko'ring."
						action={
							<button type='button' onClick={resetFilters} className='text-sm underline underline-offset-4'>
								Filtrlarni tozalash
							</button>
						}
					/>
				) : view === 'grid' ? (
					<ProductGrid products={visible} actions={actions} />
				) : (
					<ProductList products={visible} actions={actions} />
				)}

				<p className='px-1 font-mono text-[11px] text-muted-foreground'>
					{visible.length} / {products.length} ta · namunaviy rejim — o&apos;zgarishlar sahifa yangilanguncha saqlanadi
				</p>
			</div>

			<ProductEditor state={editor} onClose={() => setEditor(null)} onSave={save} />
			<DeleteDialog product={deleting} onClose={() => setDeleting(null)} onConfirm={confirmDelete} />

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

const EmptyState = ({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action: ReactNode }) => (
	<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center'>
		<span className='flex size-11 items-center justify-center rounded-xl border bg-background text-muted-foreground'>{icon}</span>
		<div className='space-y-1'>
			<p className='font-medium'>{title}</p>
			<p className='text-sm text-muted-foreground'>{text}</p>
		</div>
		{action}
	</div>
)

export default ProductsView
