'use client'

import { AdvancedMarker, ColorScheme, Map, type MapMouseEvent, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { Crosshair, Loader2, MapPin, Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import type { AddressLabel, LatLng } from '../../_lib/types'
import AddressPin from './address-pin'
import MapControls from './map-controls'
import { DEFAULT_CENTER, formatCoords, MAP_ID, UZ_BOUNDS } from './maps-config'
import { type ResolvedAddress, resolveComponents } from './geo'

interface LocationPickerProps {
	value: LatLng | null
	label: AddressLabel
	onChange: (location: LatLng) => void
	/** Nuqta bo'yicha topilgan manzil — forma maydonlarini to'ldirish uchun */
	onResolved: (address: ResolvedAddress) => void
}

type Suggestion = google.maps.places.PlacePrediction

/** Places (New) orqali avtoto'ldirish: o'zimizning input va ro'yxat, Google UI'si yo'q */
const PlaceSearch = ({ onPick }: { onPick: (location: LatLng, address: ResolvedAddress) => void }) => {
	const places = useMapsLibrary('places')
	const listId = useId()
	const [query, setQuery] = useState('')
	const [suggestions, setSuggestions] = useState<Suggestion[]>([])
	const [open, setOpen] = useState(false)
	const [highlight, setHighlight] = useState(0)
	const token = useRef<google.maps.places.AutocompleteSessionToken>(undefined)

	// So'rovlar orasida biroz kutamiz (debounce) — har harfga API chaqirilmaydi
	useEffect(() => {
		const input = query.trim()
		if (!places || input.length < 3) return

		const timer = setTimeout(async () => {
			token.current ??= new places.AutocompleteSessionToken()
			try {
				const { suggestions: result } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
					input,
					sessionToken: token.current,
					includedRegionCodes: ['uz'],
					locationRestriction: UZ_BOUNDS,
					language: 'uz',
				})
				setSuggestions(result.flatMap(item => (item.placePrediction ? [item.placePrediction] : [])))
				setHighlight(0)
			} catch {
				setSuggestions([])
			}
		}, 250)

		return () => clearTimeout(timer)
	}, [places, query])

	const visible = open && query.trim().length >= 3 ? suggestions : []

	const choose = async (prediction: Suggestion) => {
		setOpen(false)
		setQuery(prediction.mainText?.text ?? prediction.text.text)
		const place = prediction.toPlace()
		await place.fetchFields({ fields: ['location', 'formattedAddress', 'addressComponents'] })
		// Sessiya tanlov bilan tugaydi — keyingi qidiruv yangi token oladi
		token.current = undefined
		if (!place.location) return
		onPick(place.location.toJSON(), resolveComponents(place.addressComponents ?? [], place.formattedAddress))
	}

	return (
		<div className='absolute inset-x-3 top-3 z-20'>
			<div className='flex h-10 items-center gap-2 rounded-lg border bg-background/95 px-3 shadow-sm backdrop-blur focus-within:ring-3 focus-within:ring-ring/40'>
				<Search className='size-4 shrink-0 text-muted-foreground' />
				<input
					value={query}
					onChange={event => {
						setQuery(event.target.value)
						setOpen(true)
					}}
					onFocus={() => setOpen(true)}
					onBlur={() => setTimeout(() => setOpen(false), 150)}
					onKeyDown={event => {
						if (!visible.length) return
						if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
							event.preventDefault()
							const step = event.key === 'ArrowDown' ? 1 : -1
							setHighlight(current => (current + step + visible.length) % visible.length)
						} else if (event.key === 'Enter') {
							event.preventDefault()
							choose(visible[highlight])
						} else if (event.key === 'Escape') {
							setOpen(false)
						}
					}}
					role='combobox'
					aria-controls={listId}
					aria-expanded={visible.length > 0}
					aria-autocomplete='list'
					aria-label='Manzilni qidirish'
					placeholder="Ko'cha, mahalla yoki joy nomi"
					className='h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
				/>
				{query && (
					<button
						type='button'
						aria-label='Tozalash'
						onClick={() => {
							setQuery('')
							setSuggestions([])
						}}
						className='text-muted-foreground hover:text-foreground'
					>
						<X className='size-3.5' />
					</button>
				)}
			</div>

			{visible.length > 0 && (
				<ul
					id={listId}
					role='listbox'
					className='animate-in fade-in slide-in-from-top-1 mt-1.5 overflow-hidden rounded-lg border bg-background shadow-lg'
				>
					{visible.map((prediction, index) => (
						<li key={prediction.placeId} role='option' aria-selected={index === highlight}>
							<button
								type='button'
								onMouseDown={event => event.preventDefault()}
								onMouseEnter={() => setHighlight(index)}
								onClick={() => choose(prediction)}
								className={cn(
									'flex w-full items-start gap-2.5 px-3 py-2 text-left text-sm',
									index === highlight && 'bg-muted'
								)}
							>
								<MapPin className='mt-0.5 size-4 shrink-0 text-muted-foreground' />
								<span className='min-w-0'>
									<span className='block truncate font-medium'>{prediction.mainText?.text ?? prediction.text.text}</span>
									{prediction.secondaryText && (
										<span className='block truncate text-xs text-muted-foreground'>{prediction.secondaryText.text}</span>
									)}
								</span>
							</button>
						</li>
					))}
					<li className='border-t px-3 py-1.5 text-right text-[10px] text-muted-foreground'>Google ma&apos;lumotlari</li>
				</ul>
			)}
		</div>
	)
}

/** Nuqta o'zgarganda kamerani unga olib boradi */
const FollowPoint = ({ point }: { point: LatLng | null }) => {
	const map = useMap()
	useEffect(() => {
		if (!map || !point) return
		map.panTo(point)
		if ((map.getZoom() ?? 0) < 15) map.setZoom(16)
	}, [map, point])
	return null
}

/**
 * Dialogdagi xarita: qidiruv, bosib yoki pinni surib belgilash, "Joylashuvim".
 * Har bir yangi nuqta uchun teskari geokodlash bilan manzil topiladi.
 */
const LocationPicker = ({ value, label, onChange, onResolved }: LocationPickerProps) => {
	const geocoding = useMapsLibrary('geocoding')
	const [resolving, setResolving] = useState(false)
	const [locating, setLocating] = useState(false)
	const [formatted, setFormatted] = useState<string>()
	const [geoError, setGeoError] = useState<string>()

	const setPoint = async (point: LatLng) => {
		onChange(point)
		setGeoError(undefined)
		if (!geocoding) return
		setResolving(true)
		try {
			const { results } = await new geocoding.Geocoder().geocode({ location: point, language: 'uz' })
			const best = results[0]
			if (best) {
				const resolved = resolveComponents(best.address_components, best.formatted_address)
				setFormatted(resolved.formatted)
				onResolved(resolved)
			}
		} catch {
			setFormatted(undefined)
		} finally {
			setResolving(false)
		}
	}

	const locate = () => {
		if (!navigator.geolocation) return setGeoError('Brauzer joylashuvni aniqlay olmaydi')
		setLocating(true)
		navigator.geolocation.getCurrentPosition(
			position => {
				setLocating(false)
				setPoint({ lat: position.coords.latitude, lng: position.coords.longitude })
			},
			() => {
				setLocating(false)
				setGeoError('Joylashuvga ruxsat berilmadi')
			},
			{ enableHighAccuracy: true, timeout: 10_000 }
		)
	}

	return (
		<div className='relative size-full min-h-72 overflow-hidden bg-muted/30'>
			<Map
				mapId={MAP_ID}
				defaultCenter={value ?? DEFAULT_CENTER}
				defaultZoom={value ? 16 : 12}
				disableDefaultUI
				clickableIcons={false}
				gestureHandling='greedy'
				colorScheme={ColorScheme.FOLLOW_SYSTEM}
				onClick={(event: MapMouseEvent) => event.detail.latLng && setPoint(event.detail.latLng)}
				className='size-full'
			/>

			{value && (
				<AdvancedMarker
					position={value}
					draggable
					onDragEnd={event => event.latLng && setPoint(event.latLng.toJSON())}
				>
					<AddressPin label={label} variant='draft' />
				</AdvancedMarker>
			)}

			<FollowPoint point={value} />
			<PlaceSearch
				onPick={(location, address) => {
					onChange(location)
					setFormatted(address.formatted)
					onResolved(address)
				}}
			/>
			<MapControls className='top-16' />

			{/* Pastki panel: holat va "Joylashuvim" */}
			<div className='absolute inset-x-3 bottom-3 z-10 flex items-center gap-2'>
				<div className='min-w-0 flex-1 rounded-lg border bg-background/95 px-3 py-2 shadow-sm backdrop-blur'>
					{value ? (
						<>
							<p className='flex items-center gap-1.5 truncate text-xs font-medium'>
								{resolving && <Loader2 className='size-3 shrink-0 animate-spin' />}
								{resolving ? 'Manzil aniqlanmoqda…' : (formatted ?? 'Nuqta belgilandi')}
							</p>
							<p className='font-mono text-[10px] text-muted-foreground'>{formatCoords(value)}</p>
						</>
					) : (
						<p className={cn('text-xs', geoError ? 'text-destructive' : 'text-muted-foreground')}>
							{geoError ?? 'Xaritani bosing, qidiring yoki joylashuvingizni aniqlang'}
						</p>
					)}
				</div>
				<button
					type='button'
					onClick={locate}
					disabled={locating}
					aria-label='Joylashuvimni aniqlash'
					title='Joylashuvim'
					className='flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background/95 shadow-sm backdrop-blur transition-colors hover:bg-muted disabled:opacity-60'
				>
					{locating ? <Loader2 className='size-4 animate-spin' /> : <Crosshair className='size-4' />}
				</button>
			</div>
		</div>
	)
}

export default LocationPicker
