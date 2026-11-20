/** Shu summadan boshlab yetkazish bepul */
export const FREE_SHIPPING_FROM = 5_000_000
export const SHIPPING_FEE = 49_000

/** Mock promo-kodlar: kod → chegirma foizi */
export const PROMO_CODES: Record<string, number> = {
	ORMO10: 10,
	KADR5: 5,
}

export interface AppliedPromo {
	code: string
	percent: number
}

export const findPromo = (code: string): AppliedPromo | null => {
	const normalized = code.trim().toUpperCase()
	const percent = PROMO_CODES[normalized]
	return percent ? { code: normalized, percent } : null
}

export interface CartTotals {
	subtotal: number
	promoDiscount: number
	shipping: number
	total: number
	/** Bepul yetkazishgacha qolgan summa (0 — allaqachon bepul) */
	untilFreeShipping: number
}

export const computeTotals = (subtotal: number, promoPercent = 0): CartTotals => {
	const promoDiscount = Math.round((subtotal * promoPercent) / 100)
	const afterPromo = subtotal - promoDiscount
	const isFree = subtotal === 0 || afterPromo >= FREE_SHIPPING_FROM

	return {
		subtotal,
		promoDiscount,
		shipping: isFree ? 0 : SHIPPING_FEE,
		total: afterPromo + (isFree ? 0 : SHIPPING_FEE),
		untilFreeShipping:
			subtotal === 0 ? FREE_SHIPPING_FROM : Math.max(0, FREE_SHIPPING_FROM - afterPromo),
	}
}
