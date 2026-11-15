export interface Gadget {
	id: string
	name: string
	category: string
	description: string
	price: number
	image: string
}

export const gadgets: Gadget[] = [
	{
		id: 'sigma-85mm-art',
		name: 'Sigma 85mm F1.4 Art',
		category: 'Linza',
		description:
			"Portret uchun afsonaviy linza — ajoyib bokeh va kristaldek tiniqlik.",
		price: 14_900_000,
		image: '/images/gadgets/sigma-85mm.png',
	},
	{
		id: 'studio-condenser-mic',
		name: 'Studio Condenser Mic',
		category: 'Mikrofon',
		description:
			'Podkast va ovoz yozish uchun amortizatorli kondensator mikrofon.',
		price: 2_490_000,
		image: '/images/gadgets/studio-mic.png',
	},
	{
		id: 'wireless-monitor-headphones',
		name: 'Wireless Monitor Pro',
		category: 'Naushnik',
		description:
			"Montaj va ovozni nazorat qilish uchun aniq, shovqinsiz simsiz naushnik.",
		price: 3_190_000,
		image: '/images/gadgets/headphones.png',
	},
	{
		id: 'nikon-sb-700',
		name: 'Nikon Speedlight SB-700',
		category: 'Chaqnoq',
		description:
			"Burilib turadigan bosh va aqlli TTL — har qanday sharoitda to'g'ri yorug'lik.",
		price: 4_350_000,
		image: '/images/gadgets/speedlight.png',
	},
	{
		id: 'oculus-rift-vr',
		name: 'Oculus Rift VR',
		category: 'VR',
		description: '360° videolaringizni ichidan turib tomosha qiling.',
		price: 6_700_000,
		image: '/images/gadgets/vr-headset.png',
	},
	{
		id: 'vintage-50mm',
		name: 'Vintage 50mm f/1.4',
		category: 'Linza',
		description:
			'Qo\'lda fokuslanadigan klassik linza — kadrlaringizga plyonka ruhi.',
		price: 1_890_000,
		image: '/images/gadgets/vintage-50mm.png',
	},
	{
		id: 'nikon-z50-vlog-kit',
		name: 'Nikon Z50 Vlog Kit',
		category: 'Kamera',
		description: 'Ixcham mirrorless va keng burchakli linza — vlog uchun tayyor to\'plam.',
		price: 11_400_000,
		image: '/images/gadgets/nikon-z50-kit.png',
	},
	{
		id: 'wireless-handheld-mic',
		name: 'Wireless Handheld Mic',
		category: 'Mikrofon',
		description: "Intervyu va jonli efirlar uchun yengil simsiz mikrofon.",
		price: 1_350_000,
		image: '/images/gadgets/wireless-mic.png',
	},
]
