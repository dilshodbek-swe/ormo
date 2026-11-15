import Link from 'next/link'

import {
	LegalList as List,
	LegalStrong as Strong,
	type LegalSection,
} from '@/components/shared/legal-page'

export const termsSections: LegalSection[] = [
	{
		id: 'umumiy-qoidalar',
		title: 'Umumiy qoidalar',
		content: (
			<>
				<p>
					Ushbu Foydalanish shartlari Ormo internet-do&apos;koni (keyingi
					o&apos;rinlarda — &laquo;Ormo&raquo;, &laquo;biz&raquo;) va saytdan
					foydalanuvchi yoki xaridor (&laquo;siz&raquo;) o&apos;rtasidagi
					munosabatlarni tartibga soladi.
				</p>
				<p>
					Saytdagi mahsulotlar haqidagi ma&apos;lumotlar ommaviy oferta
					hisoblanadi. Buyurtma berish orqali siz ushbu shartlarni to&apos;liq
					qabul qilgan bo&apos;lasiz.
				</p>
			</>
		),
	},
	{
		id: 'akkaunt',
		title: "Ro'yxatdan o'tish va akkaunt",
		content: (
			<List
				items={[
					"Buyurtma berish uchun ro'yxatdan o'tish shart emas, lekin akkaunt buyurtmalar tarixini kuzatishni osonlashtiradi.",
					"Ro'yxatdan o'tishda to'g'ri va dolzarb ma'lumotlarni kiritishingiz kerak.",
					"Parolingiz xavfsizligi uchun o'zingiz javobgarsiz. Akkauntingizdan begona foydalanilganini sezsangiz, darhol bizga xabar bering.",
				]}
			/>
		),
	},
	{
		id: 'buyurtma',
		title: 'Buyurtma berish',
		content: (
			<>
				<p>
					Buyurtma rasmiylashtirilgach, operatorimiz uni telefon yoki SMS orqali
					tasdiqlaydi. Tasdiqlangan buyurtma shartnoma tuzilgan deb hisoblanadi.
				</p>
				<p>
					Mahsulot omborda tugab qolgan yoki narxda texnik xatolik bo&apos;lgan
					hollarda biz buyurtmani bekor qilish huquqini saqlab qolamiz. Bunday
					holatda to&apos;langan summa to&apos;liq qaytariladi.
				</p>
			</>
		),
	},
	{
		id: 'narx-va-tolov',
		title: "Narxlar va to'lov",
		content: (
			<>
				<p>
					Barcha narxlar O&apos;zbekiston so&apos;mida ko&apos;rsatiladi.
					Buyurtma tasdiqlangan paytdagi narx o&apos;zgarmaydi. To&apos;lov
					usullari:
				</p>
				<List
					items={[
						'Click, Payme va Uzcard / Humo kartalari orqali onlayn.',
						"Yetkazib berilganda naqd yoki terminal orqali.",
						"Hamkor banklar orqali muddatli to'lov.",
					]}
				/>
			</>
		),
	},
	{
		id: 'yetkazib-berish',
		title: 'Yetkazib berish',
		content: (
			<>
				<List
					items={[
						<>
							<Strong>Toshkent shahri</Strong> — 1–2 ish kuni ichida.
						</>,
						<>
							<Strong>Viloyatlar</Strong> — 2–5 ish kuni ichida.
						</>,
					]}
				/>
				<p>
					Mahsulotni qabul qilayotganda qadoq butunligini va komplektni kuryer
					oldida tekshiring. Ko&apos;rinib turgan shikastlar haqidagi
					e&apos;tirozlar keyinroq qabul qilinmasligi mumkin.
				</p>
			</>
		),
	},
	{
		id: 'qaytarish',
		title: 'Qaytarish va almashtirish',
		content: (
			<>
				<p>
					Qaytarish O&apos;zbekiston Respublikasining &laquo;Iste&apos;molchilarning
					huquqlarini himoya qilish to&apos;g&apos;risida&raquo;gi Qonuniga
					muvofiq, qonunda belgilangan muddatlarda amalga oshiriladi. Sifatli
					mahsulot quyidagi shartlarda qaytariladi:
				</p>
				<List
					items={[
						'Mahsulot ishlatilmagan va tovar ko\'rinishi saqlangan.',
						"Zavod qadog'i, plombalar va barcha aksessuarlar joyida.",
						'Xarid cheki yoki buyurtma raqami mavjud.',
					]}
				/>
				<p>
					Nuqsonli mahsulot aniqlansa, u ta&apos;mirlanadi, almashtiriladi yoki
					pul qaytariladi.
				</p>
			</>
		),
	},
	{
		id: 'kafolat',
		title: 'Kafolat',
		content: (
			<p>
				Barcha mahsulotlar rasmiy ishlab chiqaruvchi kafolati bilan sotiladi.
				Kafolat muddati har bir mahsulot sahifasida ko&apos;rsatiladi. Kafolat
				noto&apos;g&apos;ri foydalanish, mexanik shikast, suv tegishi yoki
				ruxsatsiz ta&apos;mirlash holatlariga tatbiq etilmaydi.
			</p>
		),
	},
	{
		id: 'dronlar',
		title: 'Dronlardan foydalanish',
		content: (
			<>
				<p>
					Dronlardan foydalanish O&apos;zbekistonda maxsus qoidalar bilan
					tartibga solinadi. Dron xarid qilish orqali siz quyidagilarni
					tasdiqlaysiz:
				</p>
				<List
					items={[
						"Uchirishdan oldin amaldagi qonunchilik bo'yicha talab qilinadigan ro'yxatdan o'tish va ruxsatnomalarni olasiz.",
						'Taqiqlangan hududlar — aeroportlar, harbiy va davlat obyektlari ustida uchirmaysiz.',
						"Boshqalarning shaxsiy hayoti daxlsizligini hurmat qilasiz.",
					]}
				/>
				<p>
					Dronni qoidalarga zid ishlatish oqibatlari uchun Ormo javobgar
					emas.
				</p>
			</>
		),
	},
	{
		id: 'intellektual-mulk',
		title: 'Intellektual mulk',
		content: (
			<p>
				Saytdagi dizayn, logotip, matnlar va rasmlar Ormo yoki ularning
				huquq egalariga tegishli. Ularni yozma ruxsatsiz nusxalash va tijorat
				maqsadida foydalanish taqiqlanadi.
			</p>
		),
	},
	{
		id: 'javobgarlik',
		title: 'Javobgarlikni cheklash',
		content: (
			<p>
				Ormo mahsulotdan noto&apos;g&apos;ri foydalanish natijasida yetgan
				bilvosita zararlar uchun javobgar emas. Bizning javobgarligimiz har
				qanday holatda ham xarid qilingan mahsulot narxidan oshmaydi.
			</p>
		),
	},
	{
		id: 'nizolar',
		title: 'Nizolarni hal qilish',
		content: (
			<p>
				Barcha kelishmovchiliklar avvalo muzokaralar yo&apos;li bilan hal
				qilinadi. Kelishuvga erishilmasa, nizo O&apos;zbekiston Respublikasi
				qonunchiligiga muvofiq sud tartibida ko&apos;rib chiqiladi.
			</p>
		),
	},
	{
		id: 'aloqa',
		title: "Biz bilan bog'lanish",
		content: (
			<p>
				Shartlar bo&apos;yicha savollar uchun{' '}
				<a
					href='mailto:support@ormo.uz'
					className='font-mono text-foreground underline underline-offset-4'
				>
					support@ormo.uz
				</a>{' '}
				manziliga yozing yoki{' '}
				<Link
					href='/contact'
					className='text-foreground underline underline-offset-4'
				>
					Aloqa
				</Link>{' '}
				sahifasidan foydalaning. Shaxsiy ma&apos;lumotlar bilan bog&apos;liq
				masalalar{' '}
				<Link
					href='/privacy'
					className='text-foreground underline underline-offset-4'
				>
					Maxfiylik siyosati
				</Link>
				da yoritilgan.
			</p>
		),
	},
]
