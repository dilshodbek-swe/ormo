'use client'

import { AdvancedMarker, ColorScheme, Map, useMap } from '@vis.gl/react-google-maps'
import { ArrowUpRight, Navigation } from 'lucide-react'
import { useCallback, useEffect } from 'react'

import { cn } from '@/lib/utils'
import type { Address } from '../../_lib/types'
import AddressPin from './address-pin'
import MapControls from './map-controls'
import MapFallback from './map-fallback'
import { DEFAULT_CENTER, directionsUrl, formatCoords, googleMapsUrl, MAP_ID } from './maps-config'
import { mapsEnabled } from './maps-provider'

interface AddressesMapProps {
	addresses: Address[]
	activeId?: string
	onSelect: (id: string) => void
	className?: string
}

/** Kamera: ro'yxat o'zgarganda hammasini sig'diradi, tanlanganda o'sha nuqtaga uchadi */
const useCamera = (addresses: Address[], activeId?: string) => {
	const map = useMap()
	const located = addresses.filter(address => address.location)
	const key = located.map(address => `${address.id}:${address.location!.lat},${address.location!.lng}`).join('|')

	const fitAll = useCallback(() => {
		if (!map || located.length === 0) return
		if (located.length === 1) {
			map.panTo(located[0].location!)
			map.setZoom(15)
			return
		}
		const bounds = new google.maps.LatLngBounds()
		located.forEach(address => bounds.extend(address.location!))
		map.fitBounds(bounds, 64)
		// `key` — faqat nuqtalar o'zgarganda qayta hisoblash uchun
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [map, key])

	useEffect(fitAll, [fitAll])

	useEffect(() => {
		const target = addresses.find(address => address.id === activeId)?.location
		if (!map || !target) return
		map.panTo(target)
		if ((map.getZoom() ?? 0) < 15) map.setZoom(16)
	}, [map, activeId, addresses])

	return fitAll
}

const LiveMap = ({ addresses, activeId, onSelect }: Omit<AddressesMapProps, 'className'>) => {
	const fitAll = useCamera(addresses, activeId)

	return (
		<>
			<Map
				mapId={MAP_ID}
				defaultCenter={DEFAULT_CENTER}
				defaultZoom={12}
				disableDefaultUI
				gestureHandling='cooperative'
				colorScheme={ColorScheme.FOLLOW_SYSTEM}
				className='size-full'
			/>
			{addresses
				.filter(address => address.location)
				.map(address => (
					<AdvancedMarker
						key={address.id}
						position={address.location}
						title={`${address.label}: ${address.street}`}
						zIndex={address.id === activeId ? 10 : 1}
						onClick={() => onSelect(address.id)}
					>
						<AddressPin label={address.label} active={address.id === activeId} isDefault={address.isDefault} />
					</AdvancedMarker>
				))}
			<MapControls onFit={fitAll} />
		</>
	)
}

/** Tanlangan manzil haqida xarita ustidagi "shisha" karta */
const ActiveCard = ({ address }: { address: Address }) => {
	if (!address.location) return null

	return (
		<div className='animate-in fade-in slide-in-from-bottom-2 absolute inset-x-3 bottom-3 z-10 flex items-center gap-3 rounded-xl border bg-background/90 p-3 shadow-lg backdrop-blur-md'>
			<div className='min-w-0 flex-1'>
				<p className='truncate text-sm font-medium'>
					{address.label} · {address.street}
				</p>
				<p className='font-mono text-[11px] text-muted-foreground'>{formatCoords(address.location)}</p>
			</div>
			<a
				href={directionsUrl(address.location)}
				target='_blank'
				rel='noreferrer'
				className='inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-90'
			>
				<Navigation className='size-3.5' />
				Yo&apos;nalish
			</a>
			<a
				href={googleMapsUrl(address.location)}
				target='_blank'
				rel='noreferrer'
				aria-label="Google Maps'da ochish"
				className='flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-muted'
			>
				<ArrowUpRight className='size-4' />
			</a>
		</div>
	)
}

/** Barcha manzillar bitta xaritada; kalit bo'lmasa — sxematik zaxira */
const AddressesMap = ({ addresses, activeId, onSelect, className }: AddressesMapProps) => {
	const active = addresses.find(address => address.id === activeId)
	const located = addresses.filter(address => address.location).length

	return (
		<div className={cn('relative overflow-hidden border bg-muted/30', className)}>
			{mapsEnabled ? (
				<LiveMap addresses={addresses} activeId={activeId} onSelect={onSelect} />
			) : (
				<MapFallback addresses={addresses} activeId={activeId} onSelect={onSelect} className='size-full' />
			)}

			{/* Chap yuqori: nechta nuqta belgilangan */}
			<div className='pointer-events-none absolute top-3 left-3 z-10 rounded-full border bg-background/90 px-3 py-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase shadow-sm backdrop-blur'>
				{located}/{addresses.length} xaritada
			</div>

			{mapsEnabled && active && <ActiveCard address={active} />}
		</div>
	)
}

export default AddressesMap
