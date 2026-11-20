export interface CartLine {
	id: string
	quantity: number
}

const STORAGE_KEY = 'ormo-cart'
const EMPTY: CartLine[] = []

let lines: CartLine[] = EMPTY
let loaded = false
const listeners = new Set<() => void>()

const read = (): CartLine[] => {
	try {
		const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
		return Array.isArray(parsed)
			? parsed.filter(
					(line): line is CartLine =>
						typeof line?.id === 'string' && Number.isInteger(line?.quantity) && line.quantity > 0
				)
			: EMPTY
	} catch {
		return EMPTY
	}
}

const ensureLoaded = () => {
	if (loaded || typeof window === 'undefined') return
	lines = read()
	loaded = true

	// Boshqa tabda savat o'zgarsa — shu tab ham yangilanadi
	window.addEventListener('storage', event => {
		if (event.key !== STORAGE_KEY) return
		lines = read()
		listeners.forEach(listener => listener())
	})
}

const commit = (next: CartLine[]) => {
	lines = next
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
	} catch {
		// Xususiy rejim yoki to'lgan xotira — savat shu sessiya davomida ishlayveradi
	}
	listeners.forEach(listener => listener())
}

/**
 * Savat — butun ilova uchun bitta tashqi store (useSyncExternalStore bilan o'qiladi).
 * Serverda doim bo'sh, brauzerda localStorage'dan tiklanadi.
 */
export const cartStore = {
	subscribe(listener: () => void) {
		ensureLoaded()
		listeners.add(listener)
		return () => {
			listeners.delete(listener)
		}
	},

	getSnapshot() {
		ensureLoaded()
		return lines
	},

	getServerSnapshot() {
		return EMPTY
	},

	/** Qo'shadi; `max` berilsa — ombordagi sondan oshirmaydi */
	add(id: string, quantity = 1, max = Infinity) {
		ensureLoaded()
		const existing = lines.find(line => line.id === id)
		const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, max)
		if (nextQuantity <= 0) return

		commit(
			existing
				? lines.map(line => (line.id === id ? { ...line, quantity: nextQuantity } : line))
				: [...lines, { id, quantity: nextQuantity }]
		)
	},

	setQuantity(id: string, quantity: number) {
		ensureLoaded()
		commit(
			quantity > 0
				? lines.map(line => (line.id === id ? { ...line, quantity } : line))
				: lines.filter(line => line.id !== id)
		)
	},

	/** O'chirilgan qatorni avvalgi joyiga qaytaradi ("Qaytarish" tugmasi uchun) */
	restore(line: CartLine, index: number) {
		ensureLoaded()
		if (lines.some(item => item.id === line.id)) return
		const next = [...lines]
		next.splice(Math.min(index, next.length), 0, line)
		commit(next)
	},

	remove(id: string) {
		ensureLoaded()
		commit(lines.filter(line => line.id !== id))
	},

	clear() {
		commit(EMPTY)
	},
}
