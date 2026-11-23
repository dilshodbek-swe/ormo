'use client'

import { Download } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import PageHeader from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { getOrderTotal } from '@/lib/data/orders'
import {
	downloadOrdersCsv,
	getNextAction,
	getOrdersSummary,
	getStatusCounts,
	matchesQuery,
	nowIso,
	type StatusFilter,
} from '../_lib/order-utils'
import { type AdminOrder, adminOrders } from '../_lib/sample-orders'
import OrderSheet from './order-sheet'
import OrdersStats from './orders-stats'
import OrdersTable from './orders-table'
import OrdersToolbar, { type SortKey } from './orders-toolbar'
import StatusPipeline from './status-pipeline'

const sorters: Record<SortKey, (a: AdminOrder, b: AdminOrder) => number> = {
	newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
	oldest: (a, b) => a.createdAt.localeCompare(b.createdAt),
	total: (a, b) => getOrderTotal(b) - getOrderTotal(a),
}

/**
 * Admin buyurtmalari. Holat o'zgarishlari hozircha faqat shu sahifa xotirasida (namunaviy rejim) —
 * backend ulanganda onAdvance/onCancel `requireAdmin()` bilan himoyalangan Server Action'ga almashadi.
 */
const OrdersView = () => {
	const [orders, setOrders] = useState(adminOrders)
	const [status, setStatus] = useState<StatusFilter>('all')
	const [query, setQuery] = useState('')
	const [sort, setSort] = useState<SortKey>('newest')
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const searchRef = useRef<HTMLInputElement>(null)

	// "/" — qidiruvga fokus (matn yozilayotgan bo'lmasa)
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			if (event.key !== '/' || target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return
			event.preventDefault()
			searchRef.current?.focus()
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	const summary = getOrdersSummary(orders)
	const counts = getStatusCounts(orders)
	const searched = orders.filter(order => matchesQuery(order, query))
	const visible = searched.filter(order => status === 'all' || order.status === status).sort(sorters[sort])
	const selected = orders.find(order => order.id === selectedId) ?? null

	const update = (id: string, change: (order: AdminOrder) => AdminOrder) =>
		setOrders(list => list.map(order => (order.id === id ? change(order) : order)))

	const advance = (id: string) =>
		update(id, order => {
			const next = getNextAction(order)
			if (!next) return order
			return {
				...order,
				status: next.status,
				events: { ...order.events, [next.step]: nowIso() },
				eta: next.status === 'delivered' ? undefined : order.eta,
			}
		})

	const cancel = (id: string) =>
		update(id, order => ({ ...order, status: 'cancelled', eta: undefined, cancelReason: 'Administrator tomonidan bekor qilindi' }))

	const reset = () => {
		setStatus('all')
		setQuery('')
	}

	return (
		<>
			<PageHeader
				eyebrow={`Admin · Savdo · ${orders.length} ta`}
				title={
					summary.waiting > 0 ? (
						<>
							{summary.waiting} ta buyurtma <span className='text-muted-foreground'>jo&apos;natishni kutmoqda.</span>
						</>
					) : (
						'Buyurtmalar'
					)
				}
				description="Holat bo'yicha saralang, qatorni bosib tafsilotlarni oching va buyurtmani keyingi bosqichga o'tkazing."
				action={
					<Button variant='outline' onClick={() => downloadOrdersCsv(visible)} disabled={visible.length === 0}>
						<Download />
						CSV eksport
						<span className='font-mono text-xs text-muted-foreground'>{visible.length}</span>
					</Button>
				}
			/>

			<div className='space-y-6'>
				<OrdersStats summary={summary} />
				<StatusPipeline counts={counts} value={status} onChange={setStatus} />

				<div className='space-y-3'>
					<OrdersToolbar
						status={status}
						onStatusChange={setStatus}
						counts={getStatusCounts(searched)}
						total={searched.length}
						query={query}
						onQueryChange={setQuery}
						sort={sort}
						onSortChange={setSort}
						searchRef={searchRef}
					/>
					<OrdersTable orders={visible} query={query} selectedId={selectedId} onSelect={setSelectedId} onReset={reset} />
					<p className='px-1 font-mono text-[11px] text-muted-foreground'>
						{visible.length} / {orders.length} ta ko&apos;rsatilmoqda · namunaviy ma&apos;lumotlar, o&apos;zgarishlar sahifa
						yangilanguncha saqlanadi
					</p>
				</div>
			</div>

			<OrderSheet order={selected} onClose={() => setSelectedId(null)} onAdvance={advance} onCancel={cancel} />
		</>
	)
}

export default OrdersView
