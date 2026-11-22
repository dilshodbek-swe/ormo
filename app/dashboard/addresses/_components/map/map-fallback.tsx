import { MapPinned } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Address } from '../../_lib/types'
import AddressPin from './address-pin'

interface MapFallbackProps {
	addresses?: Address[]
	activeId?: string
	onSelect?: (id: string) => void
	className?: string
}

/** Nuqtalarni 10–90% oralig'iga joylaydi — haqiqiy xarita bo'lmasa ham nisbiy joylashuv saqlanadi */
const project = (addresses: Address[]) => {
	const points = addresses.filter(address => address.location)
	const lats = points.map(point => point.location!.lat)
	const lngs = points.map(point => point.location!.lng)
	const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)]
	const scale = (value: number, min: number, max: number) => (max - min < 1e-6 ? 50 : 10 + ((value - min) / (max - min)) * 80)

	return points.map(point => ({
		address: point,
		left: scale(point.location!.lng, minLng, maxLng),
		top: 100 - scale(point.location!.lat, minLat, maxLat),
	}))
}

/**
 * Google Maps kaliti yo'q bo'lganda — "sxematik xarita": nuqtali fon, shartli ko'chalar
 * va manzillarning nisbiy joylashuvi. Sahifa kalitsiz ham chiroyli ko'rinadi.
 */
const MapFallback = ({ addresses = [], activeId, onSelect, className }: MapFallbackProps) => {
	const points = project(addresses)

	return (
		<div
			className={cn(
				'relative overflow-hidden bg-muted/30 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px]',
				className
			)}
		>
			{/* Shartli "ko'chalar" */}
			<svg aria-hidden className='absolute inset-0 size-full text-border' preserveAspectRatio='none' viewBox='0 0 100 100'>
				<path d='M-5 62 C 20 55, 35 70, 55 58 S 85 40, 105 46' fill='none' stroke='currentColor' strokeWidth='2.2' vectorEffect='non-scaling-stroke' />
				<path d='M30 -5 C 34 25, 26 45, 38 70 S 44 95, 40 105' fill='none' stroke='currentColor' strokeWidth='1.6' vectorEffect='non-scaling-stroke' />
				<path d='M70 -5 C 66 20, 78 40, 72 60 S 64 90, 70 105' fill='none' stroke='currentColor' strokeWidth='1.2' vectorEffect='non-scaling-stroke' />
				<path d='M-5 25 L 105 32' fill='none' stroke='currentColor' strokeWidth='1' strokeDasharray='4 4' vectorEffect='non-scaling-stroke' />
			</svg>

			{points.map(({ address, left, top }) => (
				<button
					key={address.id}
					type='button'
					onClick={() => onSelect?.(address.id)}
					aria-label={`${address.label}: ${address.street}`}
					className='absolute -translate-x-1/2 -translate-y-full transition-[left,top] duration-500'
					style={{ left: `${left}%`, top: `${top}%` }}
				>
					<AddressPin label={address.label} active={address.id === activeId} isDefault={address.isDefault} />
				</button>
			))}

			<div className='absolute inset-x-3 bottom-3 flex items-start gap-2.5 rounded-lg border bg-background/90 p-3 text-xs shadow-sm backdrop-blur'>
				<MapPinned className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
				<p className='text-muted-foreground'>
					<span className='font-medium text-foreground'>Sxematik ko&apos;rinish.</span> Haqiqiy xarita uchun{' '}
					<code className='rounded bg-muted px-1 font-mono text-[11px]'>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> qo&apos;shing.
				</p>
			</div>
		</div>
	)
}

export default MapFallback
