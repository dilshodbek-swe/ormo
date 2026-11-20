import { getDiscount } from '@/lib/utils'
import { catalogCategories, catalogProducts } from './catalog'
import { gadgets } from './gadgets'
import type { Product } from './products'

/**
 * cutout — oq fonda qirqib olingan mahsulot (doira plitada ko'rsatiladi),
 * photo — to'liq kadrli "hayotiy" surat (ramkani to'ldiradi)
 */
export interface ProductImage {
	src: string
	alt: string
	kind: 'cutout' | 'photo'
}

export interface ProductHighlight {
	title: string
	text: string
}

interface ProductDetails {
	tagline: string
	description: string
	specs: [label: string, value: string][]
	highlights: ProductHighlight[]
	inBox: string[]
	stock: number
	rating: number
	reviews: number
	/** Asosiy rasmdan tashqari qo'shimcha suratlar */
	gallery?: ProductImage[]
}

const details: Record<string, ProductDetails> = {
	'sony-a6400': {
		tagline: 'Fokus — ko\'z ochib yumguncha.',
		description:
			'0.02 soniyalik autofokus, real vaqtda ko\'zni kuzatish va 4K video. Ixcham korpusda professional imkoniyatlar — vlog, sport va portret uchun birdek qulay.',
		specs: [
			['Matritsa', 'APS-C, 24.2 MP'],
			['Autofokus', '425 nuqta, 0.02 s'],
			['Video', '4K 30p, 1080p 120p'],
			['Ekran', '3", 180° buriluvchi'],
			['Og\'irligi', '403 g'],
		],
		highlights: [
			{ title: 'Real-time Eye AF', text: 'Odam va hayvon ko\'zini avtomatik kuzatadi.' },
			{ title: '180° ekran', text: 'Selfi va vlog uchun oldinga buriladi.' },
			{ title: 'Uzoq seriya', text: 'Sekundiga 11 kadr, 116 kadrgacha bufer.' },
		],
		inBox: ['Kamera korpusi', 'NP-FW50 batareya', 'USB kabel', 'Yelka tasmasi'],
		stock: 7,
		rating: 4.8,
		reviews: 124,
	},
	'dji-mavic-air-2': {
		tagline: 'Osmondan 4K/60fps.',
		description:
			'48 MP kamera, 34 daqiqalik parvoz va 10 km gacha HD video uzatish. Fly More to\'plamida qo\'shimcha batareyalar va sumka bor — butun kun uchishga tayyor.',
		specs: [
			['Kamera', '1/2" CMOS, 48 MP'],
			['Video', '4K 60fps, HDR'],
			['Parvoz vaqti', '34 daqiqa'],
			['Masofa', '10 km (OcuSync 2.0)'],
			['Og\'irligi', '570 g'],
		],
		highlights: [
			{ title: 'FocusTrack', text: 'Ob\'ektni avtomatik kuzatib suratga oladi.' },
			{ title: 'Hyperlapse', text: 'Kun va tunni bir necha soniyaga sig\'diradi.' },
			{ title: 'APAS 3.0', text: 'To\'siqlarni o\'zi aylanib o\'tadi.' },
		],
		inBox: ['Dron', '3 ta batareya', 'Pult', 'Zaryadlash xabi', 'Sumka'],
		stock: 3,
		rating: 4.9,
		reviews: 87,
		gallery: [
			{
				src: '/images/hero.png',
				alt: "Yig'ilgan dron, smart pult va linzalar — ustdan ko'rinish",
				kind: 'photo',
			},
		],
	},
	'dji-osmo-pocket': {
		tagline: 'Cho\'ntakdagi kino studiya.',
		description:
			'3 o\'qli mexanik stabilizator va 4K kamera 116 grammda. Smartfonga ulanadi, yuzni kuzatadi va har qanday harakatda kadrni silliq ushlaydi.',
		specs: [
			['Stabilizatsiya', '3 o\'qli gimbal'],
			['Video', '4K 60fps'],
			['Foto', '12 MP, panorama'],
			['Batareya', '140 daqiqa'],
			['Og\'irligi', '116 g'],
		],
		highlights: [
			{ title: 'ActiveTrack', text: 'Yuz va ob\'ektni kadr markazida ushlaydi.' },
			{ title: 'Motionlapse', text: 'Harakatli timelapse bitta tugmada.' },
			{ title: 'Smartfon bilan', text: 'Lightning va USB-C ulagichlari bilan.' },
		],
		inBox: ['Osmo Pocket', 'Himoya g\'ilofi', 'Ulagichlar to\'plami', 'USB-C kabel'],
		stock: 12,
		rating: 4.7,
		reviews: 203,
		gallery: [
			{
				src: '/images/products/stabilizer-2.png',
				alt: 'Smartfon bilan stabilizator — boshqaruv tugmalari yaqindan',
				kind: 'photo',
			},
		],
	},
	'nikon-d500': {
		tagline: 'Sport va tabiat uchun chempion.',
		description:
			'153 nuqtali autofokus, sekundiga 10 kadr va ob-havoga chidamli korpus. 16-80mm linza bilan — keng burchakdan portretgacha bitta to\'plamda.',
		specs: [
			['Matritsa', 'DX, 20.9 MP'],
			['Autofokus', '153 nuqta'],
			['Seriya', '10 kadr/s'],
			['Video', '4K UHD 30p'],
			['Linza', '16-80mm f/2.8-4'],
		],
		highlights: [
			{ title: 'Chidamli korpus', text: 'Chang va namlikdan himoyalangan.' },
			{ title: 'Katta bufer', text: '200 ta RAW kadrgacha uzluksiz.' },
			{ title: 'SnapBridge', text: 'Suratlar telefonga avtomatik o\'tadi.' },
		],
		inBox: ['Kamera korpusi', '16-80mm linza', 'EN-EL15 batareya', 'Zaryadlovchi'],
		stock: 4,
		rating: 4.8,
		reviews: 61,
	},
	'dji-osmo-action': {
		tagline: 'Suv, chang va zarbaga tayyor.',
		description:
			'Ikki ekranli ekshn-kamera: 11 m gacha suv o\'tkazmaydi, RockSteady stabilizatsiyasi bilan tog\' yo\'lida ham kadr silliq chiqadi.',
		specs: [
			['Video', '4K 60fps, HDR'],
			['Stabilizatsiya', 'RockSteady EIS'],
			['Suvga chidamlilik', '11 m'],
			['Ekranlar', 'Old 1.4" + orqa 2.25"'],
			['Og\'irligi', '134 g'],
		],
		highlights: [
			{ title: 'Ikki ekran', text: 'Old ekran — o\'zingizni ko\'rib turasiz.' },
			{ title: 'RockSteady', text: 'Gimbalsiz silliq video.' },
			{ title: '−10°C da ham', text: 'Sovuqda ishlashga mo\'ljallangan.' },
		],
		inBox: ['Osmo Action', 'Batareya', 'Qisqich', 'Mahkamlagich', 'USB-C kabel'],
		stock: 9,
		rating: 4.6,
		reviews: 142,
	},
	'dji-mavic-pro': {
		tagline: 'Buklanadigan afsona.',
		description:
			'Shisha butilka hajmigacha buklanadi, 27 daqiqa uchadi va 7 km masofadan 4K video uzatadi. Sayohat ryukzagiga sig\'adigan professional dron.',
		specs: [
			['Kamera', '12 MP, 3 o\'qli gimbal'],
			['Video', '4K 30fps'],
			['Parvoz vaqti', '27 daqiqa'],
			['Masofa', '7 km'],
			['Og\'irligi', '734 g'],
		],
		highlights: [
			{ title: 'Ixcham', text: 'Buklanganda 83×83×198 mm.' },
			{ title: 'Gesture', text: 'Qo\'l ishorasi bilan selfi.' },
			{ title: 'TapFly', text: 'Ekranga tegib yo\'nalish bering.' },
		],
		inBox: ['Dron', 'Batareya', 'Pult', 'Zaryadlovchi', 'Zaxira parraklar'],
		stock: 2,
		rating: 4.7,
		reviews: 58,
	},
	'nikon-f4': {
		tagline: 'Plyonka ruhi, metall tanada.',
		description:
			'90-yillarning professional plyonkali flagmani — yaxshi holatda, tekshirilgan. Matritsali o\'lchov va mustahkam korpus bilan analog suratga kirish uchun.',
		specs: [
			['Format', '35 mm plyonka'],
			['Zatvor', '1/8000 s gacha'],
			['O\'lchov', 'Matritsali, markaziy, nuqta'],
			['Seriya', '5.7 kadr/s'],
			['Holati', 'A — a\'lo, tekshirilgan'],
		],
		highlights: [
			{ title: 'Kafolatli holat', text: 'Har bir mexanizm sinovdan o\'tgan.' },
			{ title: 'F-mount', text: 'Nikon linzalari bilan mos.' },
			{ title: 'Analog kayfiyat', text: 'Plyonkaning jonli donadorligi.' },
		],
		inBox: ['Kamera korpusi', 'Batareya bloki', 'Tasma'],
		stock: 1,
		rating: 4.9,
		reviews: 23,
	},
	'dji-spark': {
		tagline: 'Kaftdan uchadigan mini dron.',
		description:
			'300 grammlik mini dron: kaftdan ko\'tariladi, qo\'l ishorasini tushunadi va 1080p video yozadi. Dronlar olamiga birinchi qadam uchun ideal.',
		specs: [
			['Kamera', '12 MP'],
			['Video', '1080p 30fps'],
			['Parvoz vaqti', '16 daqiqa'],
			['Masofa', '2 km (pult bilan)'],
			['Og\'irligi', '300 g'],
		],
		highlights: [
			{ title: 'PalmLaunch', text: 'Kaftdan uchib, kaftga qo\'nadi.' },
			{ title: 'QuickShot', text: 'Kinematik kadrlar avtomatik.' },
			{ title: 'Yengil', text: 'Ko\'p davlatlarda ro\'yxatsiz uchadi.' },
		],
		inBox: ['Dron', 'Batareya', 'Zaxira parraklar', 'USB kabel'],
		stock: 6,
		rating: 4.5,
		reviews: 96,
	},
	'sigma-85mm-art': {
		tagline: 'Portretlar qiroli.',
		description: '',
		specs: [
			['Fokus masofasi', '85 mm'],
			['Diafragma', 'f/1.4 – f/16'],
			['Parraklar', '11 ta, yumaloq'],
			['Ulagich', 'Sony E'],
			['Og\'irligi', '1130 g'],
		],
		highlights: [
			{ title: 'Kremdek bokeh', text: '11 parrakli yumaloq diafragma.' },
			{ title: 'Art seriyasi', text: 'Chetdan chetgacha tiniqlik.' },
			{ title: 'HSM motor', text: 'Tez va jim fokus.' },
		],
		inBox: ['Linza', 'Old va orqa qopqoq', 'Blenda', 'G\'ilof'],
		stock: 5,
		rating: 4.9,
		reviews: 74,
	},
	'studio-condenser-mic': {
		tagline: 'Studiya ovozi uyda.',
		description: '',
		specs: [
			['Turi', 'Kondensator, kardioid'],
			['Chastota', '20 Hz – 20 kHz'],
			['Ulanish', 'XLR'],
			['Phantom quvvat', '48 V'],
			['Og\'irligi', '410 g'],
		],
		highlights: [
			{ title: 'Amortizator', text: 'Stol tebranishini o\'tkazmaydi.' },
			{ title: 'Pop-filtr', text: '"P" va "B" portlashlarini yutadi.' },
			{ title: 'Kardioid', text: 'Faqat old tomondagi ovozni yozadi.' },
		],
		inBox: ['Mikrofon', 'Amortizator', 'Pop-filtr', 'XLR kabel'],
		stock: 14,
		rating: 4.6,
		reviews: 88,
	},
	'wireless-monitor-headphones': {
		tagline: 'Har bir nafasni eshiting.',
		description: '',
		specs: [
			['Turi', 'Yopiq, monitor'],
			['Ulanish', 'Bluetooth 5.2 + 3.5 mm'],
			['Batareya', '40 soat'],
			['Chastota', '5 Hz – 40 kHz'],
			['Og\'irligi', '260 g'],
		],
		highlights: [
			{ title: 'Tekis ovoz', text: 'Montaj uchun bezaksiz, aniq tovush.' },
			{ title: 'Past kechikish', text: 'Video bilan ovoz sinxron.' },
			{ title: 'Buklanadi', text: 'Sumkaga ixcham sig\'adi.' },
		],
		inBox: ['Naushnik', '3.5 mm kabel', 'USB-C kabel', 'G\'ilof'],
		stock: 11,
		rating: 4.7,
		reviews: 132,
	},
	'nikon-sb-700': {
		tagline: 'Yorug\'likni o\'zingiz boshqaring.',
		description: '',
		specs: [
			['Yo\'naltirish soni', '28 (ISO 100, 35 mm)'],
			['Zoom', '24 – 120 mm'],
			['Burilish', '180° gorizontal, 90° vertikal'],
			['Simsiz', 'CLS master / remote'],
			['Og\'irligi', '360 g'],
		],
		highlights: [
			{ title: 'i-TTL', text: 'Ekspozitsiyani avtomatik hisoblaydi.' },
			{ title: 'Simsiz rejim', text: 'Bir nechta chaqnoqni boshqaradi.' },
			{ title: 'Filtrlar', text: 'Rangli filtrlar to\'plamda.' },
		],
		inBox: ['Chaqnoq', 'Diffuzor', 'Rangli filtrlar', 'Tayanch'],
		stock: 8,
		rating: 4.7,
		reviews: 49,
	},
	'oculus-rift-vr': {
		tagline: 'Boshqa olamga eshik.',
		description: '',
		specs: [
			['Ekran', 'OLED, 2160×1200'],
			['Yangilanish', '90 Hz'],
			['Kuzatuv', '6DoF, Constellation'],
			['Kontrollerlar', 'Touch, 2 ta'],
			['Og\'irligi', '470 g'],
		],
		highlights: [
			{ title: 'Touch kontroller', text: 'Barmoqlar harakatini sezadi.' },
			{ title: '3D ovoz', text: 'Ichki fazoviy audio.' },
			{ title: 'Katta kutubxona', text: 'Yuzlab o\'yin va ilovalar.' },
		],
		inBox: ['Shlem', '2 ta Touch kontroller', '2 ta sensor', 'Kabellar'],
		stock: 3,
		rating: 4.4,
		reviews: 37,
	},
	'vintage-50mm': {
		tagline: 'Kadrga eski kino ruhi.',
		description: '',
		specs: [
			['Fokus masofasi', '50 mm'],
			['Diafragma', 'f/1.7'],
			['Fokus', 'Manual'],
			['Ulagich', 'Adapter bilan (E / Z / RF)'],
			['Og\'irligi', '190 g'],
		],
		highlights: [
			{ title: 'Yumshoq rang', text: 'Iliq, vintaj tonlar.' },
			{ title: 'Manual fokus', text: 'Silliq, kino uslubidagi halqa.' },
			{ title: 'Adapter', text: 'Zamonaviy kameralarga ulanadi.' },
		],
		inBox: ['Linza', 'Adapter', 'Qopqoqlar'],
		stock: 6,
		rating: 4.5,
		reviews: 41,
	},
	'nikon-z50-vlog-kit': {
		tagline: 'Vlogga tayyor to\'plam.',
		description: '',
		specs: [
			['Matritsa', 'DX, 20.9 MP'],
			['Video', '4K 30p'],
			['Ekran', 'Pastga buriluvchi sensorli'],
			['Linza', '16-50mm VR'],
			['Og\'irligi', '450 g'],
		],
		highlights: [
			{ title: 'Selfi ekran', text: 'Pastga 180° buriladi.' },
			{ title: 'Tripod-tutqich', text: 'Qo\'lda ham, stolda ham.' },
			{ title: 'Mikrofon', text: 'To\'plamda shamol himoyali mikrofon.' },
		],
		inBox: ['Kamera', '16-50mm linza', 'Mikrofon', 'Tripod-tutqich', 'Batareya'],
		stock: 4,
		rating: 4.8,
		reviews: 66,
	},
	'wireless-handheld-mic': {
		tagline: 'Intervyu — bir qo\'lda.',
		description: '',
		specs: [
			['Turi', 'Dinamik, simsiz'],
			['Masofa', '50 m gacha'],
			['Batareya', '8 soat'],
			['Qabul qilgich', 'USB-C / 3.5 mm'],
			['Og\'irligi', '180 g'],
		],
		highlights: [
			{ title: 'Ulab ishlating', text: 'Sozlashsiz, darhol juftlashadi.' },
			{ title: 'Shovqin filtri', text: 'Ko\'cha shovqinini kamaytiradi.' },
			{ title: 'Yengil', text: 'Uzoq efirda qo\'l charchamaydi.' },
		],
		inBox: ['Mikrofon', 'Qabul qilgich', 'USB-C kabel', 'Shamol himoyasi'],
		stock: 18,
		rating: 4.5,
		reviews: 112,
	},
}

const fallback: ProductDetails = {
	tagline: '',
	description: '',
	specs: [],
	highlights: [],
	inBox: [],
	stock: 0,
	rating: 0,
	reviews: 0,
}

export type ProductWithDetails = Product &
	Omit<ProductDetails, 'gallery'> & {
		discount: number
		categoryLabel: string
		/** Barcha suratlar — birinchisi doim asosiy rasm */
		images: ProductImage[]
	}

/** Mahsulot va uning batafsil ma'lumotlari; topilmasa — `undefined` */
export const getProduct = (id: string): ProductWithDetails | undefined => {
	const product = catalogProducts.find(item => item.id === id)
	if (!product) return undefined

	const { gallery = [], ...extra } = details[id] ?? fallback
	const gadgetDescription = gadgets.find(gadget => gadget.id === id)?.description

	return {
		...product,
		...extra,
		images: [
			{ src: product.image, alt: `${product.brand} ${product.name}`, kind: 'cutout' },
			...gallery,
		],
		description: extra.description || gadgetDescription || '',
		discount: getDiscount(product.oldPrice, product.price),
		categoryLabel: catalogCategories.find(item => item.id === product.category)?.label ?? '',
	}
}

/** Ombordagi qoldiq (ma'lumot bo'lmasa — cheklovsiz) */
export const getStock = (id: string) => details[id]?.stock ?? Infinity

/** Shu kategoriyadagi boshqa mahsulotlar */
export const getRelatedProducts = (product: Product, limit = 4) =>
	catalogProducts
		.filter(item => item.category === product.category && item.id !== product.id)
		.slice(0, limit)
