import GridFrame from '@/components/shared/grid-frame'
import type { ProductHighlight } from '@/lib/data/product-details'

/** Uchta asosiy afzallik — raqamlangan kataklarda */
const ProductHighlights = ({ highlights }: { highlights: ProductHighlight[] }) => {
	if (highlights.length === 0) return null

	return (
		<GridFrame className='grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0'>
			{highlights.map((highlight, index) => (
				<div key={highlight.title} className='group space-y-6 p-6 sm:p-8'>
					<p className='font-mono text-xs text-muted-foreground'>
						{String(index + 1).padStart(2, '0')}
					</p>
					<div className='space-y-2'>
						<h3 className='font-space-grotesk text-xl font-bold tracking-tight'>
							{highlight.title}
						</h3>
						<p className='text-sm text-muted-foreground'>{highlight.text}</p>
					</div>
				</div>
			))}
		</GridFrame>
	)
}

export default ProductHighlights
