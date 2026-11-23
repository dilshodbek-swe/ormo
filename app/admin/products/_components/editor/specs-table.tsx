'use client'

import { ClipboardPaste, GripVertical, ListPlus, Plus, X } from 'lucide-react'
import { type KeyboardEvent, useId, useRef, useState } from 'react'

import type { ProductCategory } from '@/lib/data/products'
import { cn } from '@/lib/utils'
import {
	cleanSpecs,
	getSpecErrors,
	MAX_SPECS,
	newSpecId,
	parseSpecsText,
	type ProductSpec,
	SPEC_PRESETS,
} from '../../_lib/types'

interface SpecsTableProps {
	specs: ProductSpec[]
	onChange: (specs: ProductSpec[]) => void
	category: ProductCategory
	/** Saqlashga urinilgandan keyin qator xatolari ko'rsatiladi */
	showErrors: boolean
}

const ALL_PRESETS = [...new Set(Object.values(SPEC_PRESETS).flat())]

/**
 * Texnik xususiyatlar — jadval ko'rinishidagi tahrirlagich: kataklar to'g'ridan-to'g'ri yoziladi,
 * qatorlar sudrab tartiblanadi, Enter keyingi qatorga o'tadi, Excel'dan nusxa ham qabul qilinadi.
 */
const SpecsTable = ({ specs, onChange, category, showErrors }: SpecsTableProps) => {
	const listId = useId()
	const tableRef = useRef<HTMLDivElement>(null)
	const [dragIndex, setDragIndex] = useState<number | null>(null)
	const [overIndex, setOverIndex] = useState<number | null>(null)
	const [handleArmed, setHandleArmed] = useState<number | null>(null)
	const [importing, setImporting] = useState(false)
	const [importText, setImportText] = useState('')

	const errors = showErrors ? getSpecErrors(specs) : {}
	const filled = cleanSpecs(specs).length
	const full = specs.length >= MAX_SPECS
	const usedLabels = new Set(specs.map(spec => spec.label.trim().toLowerCase()))
	const presets = SPEC_PRESETS[category].filter(label => !usedLabels.has(label.toLowerCase()))
	const parsed = importText.trim() ? parseSpecsText(importText) : []

	const focusCell = (index: number, column: 'label' | 'value') =>
		requestAnimationFrame(() =>
			tableRef.current?.querySelector<HTMLInputElement>(`[data-row="${index}"][data-col="${column}"]`)?.focus()
		)

	const update = (id: string, patch: Partial<ProductSpec>) =>
		onChange(specs.map(spec => (spec.id === id ? { ...spec, ...patch } : spec)))

	const addRow = (label = '', focus: 'label' | 'value' = 'label') => {
		if (full) return
		onChange([...specs, { id: newSpecId(), label, value: '' }])
		focusCell(specs.length, focus)
	}

	const removeRow = (index: number) => {
		onChange(specs.filter((_, i) => i !== index))
		if (specs.length > 1) focusCell(Math.max(0, index - 1), 'label')
	}

	const move = (from: number, to: number) => {
		if (from === to) return
		const next = [...specs]
		const [row] = next.splice(from, 1)
		next.splice(to, 0, row)
		onChange(next)
	}

	const importSpecs = () => {
		// Bor nomlar qiymati yangilanadi, yangilari oxiriga qo'shiladi
		const next = [...specs.filter(spec => spec.label.trim() || spec.value.trim())]
		for (const spec of parsed) {
			const existing = next.findIndex(item => item.label.trim().toLowerCase() === spec.label.toLowerCase())
			if (existing >= 0) next[existing] = { ...next[existing], value: spec.value }
			else if (next.length < MAX_SPECS) next.push(spec)
		}
		onChange(next)
		setImportText('')
		setImporting(false)
	}

	const onCellKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number, column: 'label' | 'value') => {
		if (event.key === 'Enter') {
			event.preventDefault()
			if (column === 'label') focusCell(index, 'value')
			else if (index === specs.length - 1) addRow()
			else focusCell(index + 1, 'label')
		}
		// Bo'sh qatorda Backspace — qatorni o'chiradi
		if (event.key === 'Backspace' && column === 'label' && !specs[index].label && !specs[index].value && specs.length > 0) {
			event.preventDefault()
			removeRow(index)
		}
		if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
			event.preventDefault()
			const to = index + (event.key === 'ArrowUp' ? -1 : 1)
			if (to < 0 || to >= specs.length) return
			move(index, to)
			focusCell(to, column)
		}
	}

	return (
		<div className='space-y-3'>
			<datalist id={listId}>
				{ALL_PRESETS.map(label => (
					<option key={label} value={label} />
				))}
			</datalist>

			{specs.length === 0 ? (
				<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-8 text-center'>
					<span className='flex size-10 items-center justify-center rounded-xl border bg-background'>
						<ListPlus className='size-4 text-muted-foreground' />
					</span>
					<div className='space-y-0.5'>
						<p className='text-sm font-medium'>Xususiyatlar hali yo&apos;q</p>
						<p className='text-xs text-muted-foreground'>Quyidagi tayyor nomlardan boshlang yoki jadvalni matndan yopishtiring.</p>
					</div>
				</div>
			) : (
				<div ref={tableRef} className='overflow-hidden rounded-xl border bg-background' role='table' aria-label='Texnik xususiyatlar'>
					<div role='row' className='grid grid-cols-[2.25rem_minmax(0,0.8fr)_minmax(0,1.2fr)_2.25rem] border-b bg-muted/40 font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>
						<span role='columnheader' className='py-2 text-center'>#</span>
						<span role='columnheader' className='border-l px-3 py-2'>Xususiyat</span>
						<span role='columnheader' className='border-l px-3 py-2'>Qiymat</span>
						<span />
					</div>

					<div className='divide-y'>
						{specs.map((spec, index) => {
							const error = errors[spec.id]
							return (
								<div
									key={spec.id}
									role='row'
									draggable={handleArmed === index}
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
										event.preventDefault()
										if (dragIndex !== null) move(dragIndex, index)
									}}
									onDragEnd={() => {
										setDragIndex(null)
										setOverIndex(null)
										setHandleArmed(null)
									}}
									className={cn(
										'group relative grid grid-cols-[2.25rem_minmax(0,0.8fr)_minmax(0,1.2fr)_2.25rem] transition-colors focus-within:bg-muted/30',
										index % 2 === 1 && 'bg-muted/15',
										dragIndex === index && 'opacity-40',
										overIndex === index && dragIndex !== index && 'shadow-[inset_0_2px_0_var(--color-foreground)]',
										error && 'bg-destructive/5'
									)}
								>
									{error && <span aria-hidden className='absolute inset-y-0 left-0 w-0.5 bg-destructive' />}
									<span
										role='cell'
										title="Sudrab tartibni o'zgartiring (Alt + ↑↓)"
										onMouseDown={() => setHandleArmed(index)}
										onMouseUp={() => setHandleArmed(null)}
										className='flex cursor-grab items-center justify-center font-mono text-[10px] text-muted-foreground active:cursor-grabbing'
									>
										<span className='group-hover:hidden'>{String(index + 1).padStart(2, '0')}</span>
										<GripVertical className='hidden size-3.5 group-hover:block' />
									</span>
									<input
										data-row={index}
										data-col='label'
										list={listId}
										value={spec.label}
										onChange={event => update(spec.id, { label: event.target.value })}
										onKeyDown={event => onCellKeyDown(event, index, 'label')}
										placeholder='Matritsa'
										aria-label={`${index + 1}-qator nomi`}
										aria-invalid={Boolean(error)}
										className='min-w-0 border-l bg-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/40 focus:bg-background focus:text-foreground focus:shadow-[inset_0_0_0_1px_var(--color-ring)]'
									/>
									<input
										data-row={index}
										data-col='value'
										value={spec.value}
										onChange={event => update(spec.id, { value: event.target.value })}
										onKeyDown={event => onCellKeyDown(event, index, 'value')}
										placeholder='APS-C, 24.2 MP'
										aria-label={`${index + 1}-qator qiymati`}
										aria-invalid={Boolean(error)}
										className='min-w-0 border-l bg-transparent px-3 py-2.5 font-mono text-sm outline-none placeholder:text-muted-foreground/40 focus:bg-background focus:shadow-[inset_0_0_0_1px_var(--color-ring)]'
									/>
									<button
										type='button'
										aria-label={`${index + 1}-qatorni o'chirish`}
										onClick={() => removeRow(index)}
										className='flex items-center justify-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:text-destructive focus-visible:opacity-100'
									>
										<X className='size-3.5' />
									</button>
									{error && (
										<p className='col-span-4 -mt-1 pb-2 pl-12 text-xs text-destructive' role='alert'>
											{error}
										</p>
									)}
								</div>
							)
						})}
					</div>

					<button
						type='button'
						onClick={() => addRow()}
						disabled={full}
						className='flex w-full items-center gap-2 border-t px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground disabled:pointer-events-none disabled:opacity-50'
					>
						<Plus className='size-4' />
						Qator qo&apos;shish
						<span className='ml-auto font-mono text-[10px]'>
							{filled}/{MAX_SPECS}
						</span>
					</button>
				</div>
			)}

			{/* Tayyor nomlar va matndan import */}
			<div className='flex flex-wrap items-center gap-1.5'>
				{presets.map(label => (
					<button
						key={label}
						type='button'
						disabled={full}
						onClick={() => {
							// Oxirgi qator bo'sh bo'lsa — o'shani to'ldiramiz
							const last = specs[specs.length - 1]
							if (last && !last.label.trim() && !last.value.trim()) {
								update(last.id, { label })
								focusCell(specs.length - 1, 'value')
							} else addRow(label, 'value')
						}}
						className='inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-solid hover:text-foreground disabled:opacity-40'
					>
						<Plus className='size-3' />
						{label}
					</button>
				))}
				<button
					type='button'
					onClick={() => setImporting(value => !value)}
					className={cn(
						'ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors',
						importing ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
					)}
				>
					<ClipboardPaste className='size-3.5' />
					Matndan qo&apos;shish
				</button>
			</div>

			{importing && (
				<div className='space-y-2 rounded-xl border bg-muted/20 p-3 animate-in fade-in slide-in-from-top-1'>
					<textarea
						autoFocus
						value={importText}
						onChange={event => setImportText(event.target.value)}
						rows={5}
						placeholder={'Matritsa: APS-C, 24.2 MP\nVideo — 4K 30p\nOg‘irligi\t403 g'}
						className='w-full resize-y rounded-lg border bg-background p-2.5 font-mono text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/40'
					/>
					<div className='flex items-center gap-2'>
						<p className='flex-1 text-xs text-muted-foreground'>
							Har qatorda <span className='font-mono'>nomi: qiymat</span> — yoki Excel/Sheets&apos;dan 2 ustunni nusxalang.
						</p>
						<button
							type='button'
							disabled={parsed.length === 0}
							onClick={importSpecs}
							className='rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity disabled:opacity-40'
						>
							{parsed.length ? `${parsed.length} ta qo'shish` : "Qo'shish"}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default SpecsTable
