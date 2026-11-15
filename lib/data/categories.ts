export interface Category {
	id: string
	title: string
	image: string
	description: string
}

export const categories: Category[] = [
	{
		id: 'cameras',
		title: 'Kameralar',
		image: '/images/products/camera-1.png',
		description:
			"Mirrorless va DSLR kameralar — professional suratga olish va 4K video uchun.",
	},
	{
		id: 'stabilizers',
		title: 'Stabilizatorlar',
		image: '/images/products/stabilizer-1.png',
		description: 'Telefon va kameralar uchun silliq, titroqsiz video.',
	},
	{
		id: 'drones',
		title: 'Dronlar',
		image: '/images/products/drone-1.png',
		description: 'Havodan kinematik kadrlar uchun ixcham va kuchli dronlar.',
	},
]
