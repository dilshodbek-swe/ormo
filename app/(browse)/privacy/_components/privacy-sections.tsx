import Link from 'next/link'

import {
	LegalList as List,
	LegalStrong as Strong,
	type LegalSection,
} from '@/components/shared/legal-page'

export const privacySections: LegalSection[] = [
	{
		id: 'umumiy-qoidalar',
		title: 'Umumiy qoidalar',
		content: (
			<>
				<p>
					Ushbu Maxfiylik siyosati Ormo internet-do&apos;koni (keyingi
					o&apos;rinlarda — &laquo;Ormo&raquo;, &laquo;biz&raquo;) saytdan
					foydalanuvchilarning shaxsga doir ma&apos;lumotlarini qanday
					yig&apos;ishi, ishlatishi va himoya qilishini tushuntiradi.
				</p>
				<p>
					Saytdan foydalanish yoki buyurtma berish orqali siz ushbu siyosat
					shartlariga rozilik bildirasiz. Ma&apos;lumotlarni qayta ishlash
					O&apos;zbekiston Respublikasining &laquo;Shaxsga doir
					ma&apos;lumotlar to&apos;g&apos;risida&raquo;gi Qonuniga muvofiq
					amalga oshiriladi.
				</p>
			</>
		),
	},
	{
		id: 'yigiladigan-malumotlar',
		title: "Qanday ma'lumotlarni yig'amiz",
		content: (
			<>
				<p>Biz faqat xizmat ko&apos;rsatish uchun zarur bo&apos;lgan ma&apos;lumotlarni yig&apos;amiz:</p>
				<List
					items={[
						<>
							<Strong>Aloqa ma&apos;lumotlari</Strong> — ism,
							telefon raqami, email manzil.
						</>,
						<>
							<Strong>Yetkazib berish ma&apos;lumotlari</Strong>{' '}
							— shahar, manzil va qabul qiluvchi.
						</>,
						<>
							<Strong>Buyurtmalar tarixi</Strong> — xarid
							qilingan mahsulotlar, sanalar va summalar.
						</>,
						<>
							<Strong>Texnik ma&apos;lumotlar</Strong> — IP
							manzil, brauzer turi, qurilma va saytdagi harakatlar.
						</>,
					]}
				/>
				<p>
					Bank kartasi ma&apos;lumotlari biz tomonda saqlanmaydi — to&apos;lovlar
					to&apos;g&apos;ridan-to&apos;g&apos;ri to&apos;lov tizimlari orqali
					amalga oshiriladi.
				</p>
			</>
		),
	},
	{
		id: 'foydalanish',
		title: "Ma'lumotlardan qanday foydalanamiz",
		content: (
			<List
				items={[
					'Buyurtmalarni rasmiylashtirish, to\'lovni qabul qilish va yetkazib berish.',
					'Buyurtma holati haqida SMS yoki email orqali xabar berish.',
					'Kafolat va qaytarish so\'rovlarini ko\'rib chiqish.',
					'Sayt ishlashini yaxshilash va xatolarni aniqlash.',
					'Siz rozilik bergan bo\'lsangiz — yangiliklar va maxsus takliflarni yuborish.',
				]}
			/>
		),
	},
	{
		id: 'cookie',
		title: 'Cookie fayllar',
		content: (
			<>
				<p>
					Sayt savat tarkibini eslab qolish, tizimga kirish holatini saqlash va
					tashriflar statistikasini yuritish uchun cookie fayllardan
					foydalanadi.
				</p>
				<p>
					Brauzer sozlamalari orqali cookie fayllarni o&apos;chirib qo&apos;yishingiz
					mumkin, ammo bu holda saytning ayrim funksiyalari to&apos;liq ishlamasligi
					mumkin.
				</p>
			</>
		),
	},
	{
		id: 'uchinchi-shaxslar',
		title: "Uchinchi shaxslarga berish",
		content: (
			<>
				<p>
					Biz ma&apos;lumotlaringizni <Strong>sotmaymiz</Strong>.
					Ular faqat xizmatni bajarish uchun zarur bo&apos;lgan hamkorlarga
					beriladi:
				</p>
				<List
					items={[
						'Yetkazib berish xizmatlari — manzil va telefon raqami.',
						'To\'lov tizimlari — to\'lovni amalga oshirish uchun zarur ma\'lumotlar.',
						'Davlat organlari — faqat qonunchilikda belgilangan hollarda.',
					]}
				/>
			</>
		),
	},
	{
		id: 'saqlash-va-himoya',
		title: 'Saqlash va himoya',
		content: (
			<p>
				Ma&apos;lumotlar shifrlangan aloqa kanallari (HTTPS) orqali uzatiladi va
				O&apos;zbekiston hududidagi serverlarda saqlanadi. Ularga faqat vakolatli
				xodimlar kira oladi. Ma&apos;lumotlar maqsadga erishish uchun zarur
				bo&apos;lgan muddat davomida saqlanadi, so&apos;ng o&apos;chiriladi.
			</p>
		),
	},
	{
		id: 'huquqlaringiz',
		title: 'Sizning huquqlaringiz',
		content: (
			<>
				<p>Siz istalgan vaqtda quyidagilarni talab qilishingiz mumkin:</p>
				<List
					items={[
						'Biz saqlayotgan ma\'lumotlaringiz haqida axborot olish.',
						'Noto\'g\'ri ma\'lumotlarni tuzatish.',
						'Ma\'lumotlaringizni o\'chirish.',
						'Reklama xabarlaridan voz kechish — har bir xat oxiridagi havola orqali.',
					]}
				/>
			</>
		),
	},
	{
		id: 'bolalar',
		title: 'Bolalar maxfiyligi',
		content: (
			<p>
				Sayt 16 yoshgacha bo&apos;lgan shaxslar uchun mo&apos;ljallanmagan. Agar
				bola ma&apos;lumotlari bizga ota-onalar roziligisiz yuborilganini
				aniqlasak, ular darhol o&apos;chiriladi.
			</p>
		),
	},
	{
		id: 'ozgartirishlar',
		title: "Siyosatga o'zgartirishlar",
		content: (
			<p>
				Ushbu siyosat vaqti-vaqti bilan yangilanishi mumkin. Muhim
				o&apos;zgarishlar haqida saytda yoki email orqali xabar beramiz. Sahifa
				yuqorisidagi sana oxirgi yangilanish vaqtini ko&apos;rsatadi.
			</p>
		),
	},
	{
		id: 'aloqa',
		title: "Biz bilan bog'lanish",
		content: (
			<p>
				Maxfiylik bo&apos;yicha savollar uchun{' '}
				<a
					href='mailto:privacy@ormo.uz'
					className='font-mono text-foreground underline underline-offset-4'
				>
					privacy@ormo.uz
				</a>{' '}
				manziliga yozing yoki{' '}
				<Link
					href='/contact'
					className='text-foreground underline underline-offset-4'
				>
					Aloqa
				</Link>{' '}
				sahifasidan foydalaning.
			</p>
		),
	},
]
