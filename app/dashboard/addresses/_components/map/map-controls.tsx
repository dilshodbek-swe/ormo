'use client'

import { useMap } from '@vis.gl/react-google-maps'
import { Minus, Plus, Scan } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

const ControlButton = ({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) => (
	<button
		type='button'
		aria-label={label}
		title={label}
		onClick={onClick}
		className='flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-4'
	>
		{children}
	</button>
)

/** O'zimizning (Vercel uslubidagi) zoom tugmalari — Google'ning standart UI'si o'chirilgan */
const MapControls = ({ onFit, className }: { onFit?: () => void; className?: string }) => {
	const map = useMap()
	const zoomBy = (delta: number) => map?.setZoom((map.getZoom() ?? 12) + delta)

	return (
		<div className={cn('absolute top-3 right-3 z-10 flex flex-col divide-y overflow-hidden rounded-lg border bg-background/90 shadow-sm backdrop-blur', className)}>
			<ControlButton label='Yaqinlashtirish' onClick={() => zoomBy(1)}>
				<Plus />
			</ControlButton>
			<ControlButton label='Uzoqlashtirish' onClick={() => zoomBy(-1)}>
				<Minus />
			</ControlButton>
			{onFit && (
				<ControlButton label='Hammasini ko‘rsatish' onClick={onFit}>
					<Scan />
				</ControlButton>
			)}
		</div>
	)
}

export default MapControls
