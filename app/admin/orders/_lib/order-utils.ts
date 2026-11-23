import { getOrderCount, getOrderTotal, type OrderStatus, type OrderStep, STATUS_LABELS } from '@/lib/data/orders'
import type { AdminOrder } from './sample-orders'

export type StatusFilter = 'all' | OrderStatus

export const STATUS_ORDER: OrderStatus[] = ['processing', 'shipped', 'delivered', 'cancelled']

/** Pipeline va filtrlar uchun ranglar (StatusBadge bilan bir xil palitra) */
export const STATUS_COLORS: Record<OrderStatus, string> = {
	processing: 'bg-amber-500',
	shipped: 'bg-sky-500',
	delivered: 'bg-emerald-500',
	cancelled: 'bg-muted-foreground/40',
}

export interface NextAction {
	label: string
	hint: string
	step: OrderStep
	status: OrderStatus
}

/** Buyurtmani keyingi bosqichga o'tkazish: qabul → qadoqlandi → yo'lda → yetkazildi */
export const getNextAction = (order: AdminOrder): NextAction | null => {
	if (order.status === 'processing' && !order.events.packed)
		return { label: 'Qadoqlandi deb belgilash', hint: 'Mahsulotlar qutiga joylandi', step: 'packed', status: 'processing' }
	if (order.status === 'processing')
		return { label: "Yo'lga chiqarish", hint: 'Kuryerga topshirildi', step: 'shipped', status: 'shipped' }
	if (order.status === 'shipped')
		return { label: 'Yetkazildi deb belgilash', hint: 'Mijoz qabul qilib oldi', step: 'delivered', status: 'delivered' }
	return null
}

/** Faqat hali jo'natilmagan buyurtmani bekor qilish mumkin */
export const canCancel = (order: AdminOrder) => order.status === 'processing'

const pad = (value: number) => String(value).padStart(2, '0')
export const nowIso = () => {
	const date = new Date()
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

export const matchesQuery = (order: AdminOrder, query: string) => {
	const q = query.trim().toLowerCase()
	if (!q) return true
	const haystack = [
		order.id,
		order.customer.name,
		order.customer.phone.replace(/\s/g, ''),
		order.customer.email,
		order.customer.city,
		...order.items.map(({ product }) => `${product.brand} ${product.name}`),
	]
		.join(' ')
		.toLowerCase()
	return haystack.includes(q.replace(/\s/g, '')) || haystack.includes(q)
}

export const getStatusCounts = (list: AdminOrder[]) =>
	STATUS_ORDER.reduce(
		(acc, status) => ({ ...acc, [status]: list.filter(order => order.status === status).length }),
		{} as Record<OrderStatus, number>
	)

/** KPI va 14 kunlik daromad grafigi (oxirgi buyurtma kunidan orqaga) */
export const getOrdersSummary = (list: AdminOrder[]) => {
	const paid = list.filter(order => order.status !== 'cancelled')
	const revenue = paid.reduce((sum, order) => sum + getOrderTotal(order), 0)
	const units = paid.reduce((sum, order) => sum + getOrderCount(order), 0)

	const latest = list.reduce((max, order) => (order.createdAt > max ? order.createdAt : max), '')
	const end = latest ? new Date(latest.slice(0, 10)) : new Date()
	const days = Array.from({ length: 14 }, (_, index) => {
		const day = new Date(end)
		day.setDate(end.getDate() - (13 - index))
		const key = `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`
		const value = paid
			.filter(order => order.createdAt.startsWith(key))
			.reduce((sum, order) => sum + getOrderTotal(order), 0)
		return { key, value }
	})

	return {
		revenue,
		units,
		count: list.length,
		average: paid.length ? Math.round(revenue / paid.length) : 0,
		waiting: list.filter(order => order.status === 'processing').length,
		cancelled: list.length - paid.length,
		days,
	}
}

/** Ko'rinib turgan buyurtmalarni CSV qilib yuklab beradi (Excel uchun BOM bilan) */
export const downloadOrdersCsv = (list: AdminOrder[]) => {
	const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
	const header = ['ID', 'Sana', 'Holat', 'Mijoz', 'Telefon', 'Email', 'Manzil', "To'lov", 'Mahsulotlar', 'Soni', 'Yetkazish', 'Jami']
	const rows = list.map(order => [
		order.id,
		order.createdAt.replace('T', ' ').slice(0, 16),
		STATUS_LABELS[order.status],
		order.customer.name,
		order.customer.phone,
		order.customer.email,
		order.address,
		order.payment,
		order.items.map(line => `${line.product.brand} ${line.product.name} ×${line.quantity}`).join('; '),
		getOrderCount(order),
		order.shipping,
		getOrderTotal(order),
	])

	const csv = '﻿' + [header, ...rows].map(row => row.map(escape).join(',')).join('\n')
	const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
	const link = Object.assign(document.createElement('a'), { href: url, download: `ormo-buyurtmalar-${nowIso().slice(0, 10)}.csv` })
	link.click()
	URL.revokeObjectURL(url)
}
