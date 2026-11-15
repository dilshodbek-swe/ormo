import { Lock, ShieldCheck, Trash2 } from 'lucide-react'
import type { Metadata } from 'next'

import LegalPage from '@/components/shared/legal-page'
import { privacySections } from './_components/privacy-sections'

export const metadata: Metadata = {
	title: 'Maxfiylik siyosati — Ormo',
	description:
		"Ormo shaxsga doir ma'lumotlaringizni qanday yig'ishi, ishlatishi va himoya qilishi haqida.",
}

const PrivacyPage = () => {
	return (
		<LegalPage
			title='Maxfiylik siyosati'
			description="Ishonch — har bir xaridning asosi. Bu yerda qanday ma'lumotlarni yig'ishimiz va ularni qanday himoya qilishimizni oddiy tilda tushuntiramiz."
			lastUpdated='15-noyabr, 2026'
			readingTime='~5 daqiqa'
			highlights={[
				{ icon: ShieldCheck, text: "Ma'lumotlaringizni hech kimga sotmaymiz" },
				{ icon: Lock, text: 'Karta raqamlari bizda saqlanmaydi' },
				{ icon: Trash2, text: "Istalgan payt o'chirishni so'rashingiz mumkin" },
			]}
			sections={privacySections}
		/>
	)
}

export default PrivacyPage
