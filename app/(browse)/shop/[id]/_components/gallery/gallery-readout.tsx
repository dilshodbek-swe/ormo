import { cn } from '@/lib/utils'
import type { ZoomPoint } from './use-gallery'

type Props = {
	point: ZoomPoint | null
	index: number
	count: number
	/** To'liq kadrli suratda matn rasm ustida — o'qilishi uchun fon beriladi */
	onPhoto: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Pastki holat satri: rasm raqami, maslahat va kursor koordinatalari */
const GalleryReadout = ({ point, index, count, onPhoto }: Props) => {
	return (
		<p
			className={cn(
				'pointer-events-none absolute right-4 bottom-4 left-4 z-10 flex items-center justify-between gap-3 font-mono text-[11px]',
				onPhoto ? 'text-foreground' : 'text-muted-foreground'
			)}
		>
			<span
				className={cn(
					'flex items-center gap-2',
					onPhoto && 'rounded bg-background/80 px-1.5 py-0.5 backdrop-blur'
				)}
			>
				{count > 1 && (
					<span aria-live='polite' className='tabular-nums'>
						{pad(index + 1)} / {pad(count)}
					</span>
				)}
				<span className='hidden sm:inline'>
					{point ? '× 1.8 kattalashtirildi' : 'Kursorni olib boring — kattalashadi'}
				</span>
			</span>
			<span
				className={cn(
					'tabular-nums',
					onPhoto && 'rounded bg-background/80 px-1.5 py-0.5 backdrop-blur'
				)}
			>
				x {point ? point.x.toFixed(2) : '0.50'} · y {point ? point.y.toFixed(2) : '0.50'}
			</span>
		</p>
	)
}

export default GalleryReadout
