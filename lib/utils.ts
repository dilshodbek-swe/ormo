export { cn } from "cn"

/** 12450000 → "12 450 000 so'm" */
export const formatPrice = (value: number) =>
	`${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`

/** Chegirma foizi: (12 000 000, 9 000 000) → 25 */
export const getDiscount = (oldPrice: number, price: number) =>
	Math.round(((oldPrice - price) / oldPrice) * 100)
