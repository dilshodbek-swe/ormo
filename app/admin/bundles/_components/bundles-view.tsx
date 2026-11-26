'use client'

import { ArrowUpRight, Boxes, Check, Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import PageHeader from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { formatPrice, slugify } from '@/lib/utils'
import { sampleBundles } from '../_lib/sample-bundles'
import { type AdminBundle, type BundleDraft, bundleIssues, bundleTotals } from '../_lib/types'
import BundleCard, { type BundleActions } from './bundle-card'
import BundleEditor, { type BundleEditorState } from './bundle-editor'
import DeleteBundleDialog from './delete-bundle-dialog'

const compact = (value: number) =>
	value >= 1_000_000_000 ? `${(value / 1_000_000_000).toFixed(2)} mlrd` : value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)} mln` : formatPrice(value)

/**
 * To'plamlar (namunaviy rejim): yaratish, tahrirlash, tartib, ko'rinish va o'chirish shu sahifa xotirasida.
 * Backend ulanganda — `requireAdmin()` bilan himoyalangan Server Action'lar.
 */
const BundlesView = () => {
	const [bundles, setBundles] = useState(sampleBundles)
	const [editor, setEditor] = useState<BundleEditorState>(null)
	const [deleting, setDeleting] = useState<AdminBundle | null>(null)
	const [toast, setToast] = useState<{ id: number; text: string } | null>(null)

	useEffect(() => {
		if (!toast) return
		const timer = setTimeout(() => setToast(null), 3200)
		return () => clearTimeout(timer)
	}, [toast])
	const notify = (text: string) => setToast({ id: Date.now(), text })

	// "N" — yangi to'plam
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

	const visible = bundles.filter(bundle => bundle.visible)
	const broken = bundles.filter(bundle => bundle.visible && bundleIssues(bundle.productIds).length > 0)
	const sold = bundles.reduce((sum, bundle) => sum + bundle.sold, 0)
	const revenue = bundles.reduce((sum, bundle) => sum + bundle.revenue, 0)
	const given = bundles.reduce((sum, bundle) => sum + bundle.sold * bundleTotals(bundle.productIds, bundle.discount).savings, 0)

	const save = async (draft: BundleDraft, existing?: AdminBundle) => {
		await new Promise(resolve => setTimeout(resolve, 400)) // namunaviy "tarmoq"
		const fields = { name: draft.name.trim(), tagline: draft.tagline.trim(), discount: draft.discount, productIds: draft.productIds, visible: draft.visible }
		if (existing) {
			setBundles(list => list.map(bundle => (bundle.id === existing.id ? { ...bundle, ...fields } : bundle)))
			notify(`«${fields.name}» saqlandi`)
		} else {
			const base = slugify(fields.name) || 'toplam'
			let id = base
			for (let index = 2; bundles.some(bundle => bundle.id === id); index++) id = `${base}-${index}`
			setBundles(list => [...list, { ...fields, id, sold: 0, revenue: 0, createdAt: new Date().toISOString() }])
			notify(`«${fields.name}» yaratildi — ro'yxat oxirida`)
		}
		setEditor(null)
	}

	const toggleVisible = (bundle: AdminBundle) => {
		setBundles(list => list.map(item => (item.id === bundle.id ? { ...item, visible: !item.visible } : item)))
		notify(bundle.visible ? `«${bundle.name}» yashirildi` : `«${bundle.name}» do'konda ko'rinadi`)
	}

	const actions: BundleActions = {
		onEdit: bundle => setEditor({ mode: 'edit', bundle }),
		onToggleVisible: toggleVisible,
		onMove: (from, to) => {
			const next = [...bundles]
			const [item] = next.splice(from, 1)
			next.splice(to, 0, item)
			setBundles(next)
			notify(`«${item.name}» ${to + 1}-o'ringa ko'chdi`)
		},
		onDelete: bundle => setDeleting(bundle),
	}

	return (
		<>
			<PageHeader
				eyebrow={`Admin · Katalog · ${bundles.length} ta`}
				title={
					<>
						To&apos;plamlar <span className='text-muted-foreground'>· {visible.length} ko&apos;rinadi</span>
					</>
				}
				description="Birga olinsa arzonroq: 2–4 mahsulot va qo'shimcha chegirma. Tartib — /deals sahifasidagi yorliqlar tartibi."
				action={
					<div className='flex gap-2'>
						<Button variant='outline' className='h-9' nativeButton={false} render={<Link href='/deals' target='_blank' />}>
							Do&apos;konda
							<ArrowUpRight />
						</Button>
						<Button onClick={() => setEditor({ mode: 'create' })} className='h-9'>
							<Plus />
							Yangi to&apos;plam
							<kbd className='rounded border border-background/30 px-1 font-mono text-[10px] opacity-70'>N</kbd>
						</Button>
					</div>
				}
			/>

			<div className='space-y-6'>
				<div className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border xl:grid-cols-4'>
					<Stat label="Do'konda" value={`${visible.length}/${bundles.length}`} hint={broken.length ? `${broken.length} tasini sotib bo'lmaydi` : 'hammasi sotuvda'} alert={broken.length > 0} />
					<Stat label='Sotilgan' value={sold} hint="to'liq to'plam" />
					<Stat label='Tushum' value={`${compact(revenue)} so'm`} hint="to'plamlardan" />
					<Stat label='Mijozlar tejadi' value={`${compact(given)} so'm`} hint={given ? `har 1 so'mga ${(revenue / given).toFixed(0)} so'm savdo` : '—'} />
				</div>

				{bundles.length === 0 ? (
					<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center'>
						<span className='flex size-11 items-center justify-center rounded-xl border bg-background text-muted-foreground'>
							<Boxes className='size-5' />
						</span>
						<p className='font-medium'>Hali to&apos;plam yo&apos;q</p>
						<Button onClick={() => setEditor({ mode: 'create' })}>Birinchisini yaratish</Button>
					</div>
				) : (
					<ul className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
						{bundles.map((bundle, index) => (
							<li key={bundle.id} className='min-w-0 animate-in fade-in slide-in-from-bottom-1 fill-mode-backwards' style={{ animationDelay: `${index * 40}ms` }}>
								<BundleCard bundle={bundle} index={index} count={bundles.length} actions={actions} />
							</li>
						))}
						<li className='min-w-0'>
							<button
								type='button'
								onClick={() => setEditor({ mode: 'create' })}
								className='flex h-full min-h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/30 hover:text-foreground'
							>
								<span className='flex size-10 items-center justify-center rounded-full border border-dashed'>
									<Plus className='size-4' />
								</span>
								Yangi to&apos;plam
							</button>
						</li>
					</ul>
				)}

				<p className='px-1 font-mono text-[11px] text-muted-foreground'>
					namunaviy rejim — o&apos;zgarishlar sahifa yangilanguncha saqlanadi · narx va qoldiq — mahsulotlar sahifasidagi namunaviy katalogdan
				</p>
			</div>

			<BundleEditor
				state={editor}
				takenNames={exceptId => bundles.filter(bundle => bundle.id !== exceptId).map(bundle => bundle.name.toLowerCase())}
				onClose={() => setEditor(null)}
				onSave={save}
			/>
			<DeleteBundleDialog
				bundle={deleting}
				onClose={() => setDeleting(null)}
				onConfirm={bundle => {
					setBundles(list => list.filter(item => item.id !== bundle.id))
					setDeleting(null)
					notify(`«${bundle.name}» o'chirildi`)
				}}
				onHide={bundle => {
					toggleVisible(bundle)
					setDeleting(null)
				}}
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

const Stat = ({ label, value, hint, alert = false }: { label: string; value: string | number; hint: string; alert?: boolean }) => (
	<div className='min-w-0 bg-background p-4 sm:p-5'>
		<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{label}</p>
		<p className='mt-2 flex items-center gap-2 font-space-grotesk text-2xl font-bold tracking-tight whitespace-nowrap tabular-nums sm:text-3xl'>
			{value}
			{alert && (
				<span className='relative flex size-2'>
					<span className='absolute inset-0 animate-ping rounded-full bg-rose-500 opacity-70' />
					<span className='relative size-2 rounded-full bg-rose-500' />
				</span>
			)}
		</p>
		<p className='mt-1 truncate text-xs text-muted-foreground'>{hint}</p>
	</div>
)

export default BundlesView
