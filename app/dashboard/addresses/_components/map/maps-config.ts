import type { LatLng } from '../../_lib/types'

/**
 * Google Maps sozlamalari. Kalit brauzerga chiqadi — Google Cloud Console'da uni
 * HTTP referrer (ormo-store.vercel.app, localhost) va kerakli API'lar bilan cheklang.
 */
export const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

/** AdvancedMarker va och/qora rejim uchun Map ID kerak; `DEMO_MAP_ID` — sinov uchun */
export const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'

/** Toshkent markazi — manzil hali yo'q bo'lganda */
export const DEFAULT_CENTER: LatLng = { lat: 41.3111, lng: 69.2797 }

/** O'zbekiston chegaralari (taxminiy) — qidiruv va xaritani shu hudud bilan cheklaymiz */
export const UZ_BOUNDS = { north: 45.6, south: 37.1, west: 55.9, east: 73.2 }

export const formatCoords = ({ lat, lng }: LatLng) =>
	`${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`

/** Kalitsiz ishlaydigan havolalar: Google Maps'da ochish va yo'nalish */
export const googleMapsUrl = ({ lat, lng }: LatLng) =>
	`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

export const directionsUrl = ({ lat, lng }: LatLng) =>
	`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
