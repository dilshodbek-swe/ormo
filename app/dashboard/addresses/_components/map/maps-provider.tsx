'use client'

import { APIProvider } from '@vis.gl/react-google-maps'
import type { ReactNode } from 'react'

import { MAPS_API_KEY } from './maps-config'

export const mapsEnabled = Boolean(MAPS_API_KEY)

/** Kalit bo'lsa Google Maps'ni yuklaydi; bo'lmasa sahifa xaritasiz (zaxira ko'rinish bilan) ishlaydi */
const MapsProvider = ({ children }: { children: ReactNode }) =>
	mapsEnabled ? (
		<APIProvider apiKey={MAPS_API_KEY} language='uz' region='UZ'>
			{children}
		</APIProvider>
	) : (
		children
	)

export default MapsProvider
