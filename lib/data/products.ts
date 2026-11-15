export interface Product {
	id: string
	brand: string
	name: string
	oldPrice: number
	price: number
	image: string
}

export const products: Product[] = [
	{
		id: 'sony-a6400',
		brand: 'Sony',
		name: 'Alpha a6400 Body',
		oldPrice: 11_990_000,
		price: 9_790_000,
		image: '/images/products/camera-1.png',
	},
	{
		id: 'dji-mavic-air-2',
		brand: 'DJI',
		name: 'Mavic Air 2 Fly More Combo',
		oldPrice: 12_900_000,
		price: 10_990_000,
		image: '/images/products/drone-3.png',
	},
	{
		id: 'dji-osmo-pocket',
		brand: 'DJI',
		name: 'Osmo Pocket',
		oldPrice: 4_500_000,
		price: 3_690_000,
		image: '/images/products/stabilizer-1.png',
	},
	{
		id: 'nikon-d500',
		brand: 'Nikon',
		name: 'D500 Kit 16-80mm',
		oldPrice: 21_500_000,
		price: 18_900_000,
		image: '/images/products/camera-3.png',
	},
	{
		id: 'dji-osmo-action',
		brand: 'DJI',
		name: 'Osmo Action',
		oldPrice: 3_900_000,
		price: 2_990_000,
		image: '/images/products/camera-4.png',
	},
	{
		id: 'dji-mavic-pro',
		brand: 'DJI',
		name: 'Mavic Pro',
		oldPrice: 14_500_000,
		price: 12_450_000,
		image: '/images/products/drone-1.png',
	},
	{
		id: 'nikon-f4',
		brand: 'Nikon',
		name: 'F4 Film Camera',
		oldPrice: 8_900_000,
		price: 6_990_000,
		image: '/images/products/camera-2.png',
	},
	{
		id: 'dji-spark',
		brand: 'DJI',
		name: 'Spark Mini Drone',
		oldPrice: 6_200_000,
		price: 4_990_000,
		image: '/images/products/drone-2.png',
	},
]
