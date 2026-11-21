import 'server-only'

import mongoose from 'mongoose'

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }

/**
 * Dev rejimida HMR har saqlashda modullarni qayta yuklaydi — ulanishni `globalThis`da
 * saqlab qo'yamiz, aks holda har safar yangi ulanish ochilib, pool to'lib ketadi.
 */
const globalForMongoose = globalThis as typeof globalThis & { mongoose?: Cache }
const cache: Cache = (globalForMongoose.mongoose ??= { conn: null, promise: null })

/** MongoDB'ga ulanadi (yoki tayyor ulanishni qaytaradi). Har bir server so'rovida chaqirish xavfsiz. */
export const connectDB = async () => {
	if (cache.conn) return cache.conn

	const uri = process.env.MONGODB_URI
	if (!uri) throw new Error('MONGODB_URI .env.local faylida ko‘rsatilmagan')

	cache.promise ??= mongoose.connect(uri, {
		dbName: process.env.MONGODB_DB ?? 'ormo',
		bufferCommands: false,
	})

	try {
		cache.conn = await cache.promise
	} catch (error) {
		// Keyingi so'rovda qayta urinib ko'rish uchun
		cache.promise = null
		throw error
	}

	return cache.conn
}
