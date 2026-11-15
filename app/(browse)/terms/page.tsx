import { RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import type { Metadata } from 'next'

import LegalPage from '@/components/shared/legal-page'
import { termsSections } from './_components/terms-sections'

export const metadata: Metadata = {
	title: 'Foydalanish shartlari — Ormo',
	description:
		"Ormo'da buyurtma berish, to'lov, yetkazib berish, qaytarish va kafolat shartlari.",
}

const TermsPage = () => {
	return (
		<LegalPage
			title='Foydalanish shartlari'
			description="Buyurtmadan tortib kafolatgacha — xarid jarayonining barcha qoidalari bir joyda. Qisqa, aniq va ortiqcha mayda harflarsiz."
			lastUpdated='15-noyabr, 2026'
			readingTime='~7 daqiqa'
			highlights={[
				{ icon: Truck, text: "Toshkent bo'ylab 1–2 kunda yetkazish" },
				{ icon: ShieldCheck, text: 'Barcha mahsulotlarga rasmiy kafolat' },
				{ icon: RotateCcw, text: 'Qonun asosida oson qaytarish' },
			]}
			sections={termsSections}
		/>
	)
}

export default TermsPage
