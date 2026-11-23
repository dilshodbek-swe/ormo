import { formatPrice } from '@/lib/utils'
import { type AdminProduct, LOW_STOCK } from '../_lib/types'

const compact = (value: number) =>
	value >= 1_000_000_000
		? `${(value / 1_000_000_000).toFixed(2)} mlrd`
		: value >= 1_000_000
			? `${(value / 1_000_000).toFixed(1)} mln`
			: formatPrice(value)

/** Katalog holati: 1px chiziqli kataklar (Vercel "Usage" uslubi) */
const ProductsStats = ({ products }: { products: AdminProduct[] }) => {
	const active = products.filter(product => product.status === 'active')
	const low = active.filter(product => product.stock > 0 && product.stock <= LOW_STOCK).length
	const out = active.filter(product => product.stock === 0).length
	const value = products.reduce((sum, product) => sum + product.price * product.stock, 0)
	const units = products.reduce((sum, product) => sum + product.stock, 0)
	const photos = products.reduce((sum, product) => sum + product.images.length, 0)

	const cells = [
		{ label: 'Mahsulotlar', value: products.length, hint: `${active.length} tasi do'konda faol` },
		{ label: 'Ombor qiymati', value: `${compact(value)} so'm`, hint: `${units} dona mahsulot` },
		{
			label: 'Kam qolgan',
			value: low + out,
			hint: out ? `${out} tasi tugagan` : `${LOW_STOCK} dona va undan kam`,
			alert: low + out > 0,
		},
		{ label: 'Rasmlar', value: photos, hint: `o'rtacha ${(photos / Math.max(products.length, 1)).toFixed(1)} ta / mahsulot` },
	]

	return (
		<div className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4'>
			{cells.map(cell => (
				<div key={cell.label} className='bg-background p-4 sm:p-5'>
					<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{cell.label}</p>
					<p className='mt-2 flex items-center gap-2 font-space-grotesk text-2xl font-bold tracking-tight tabular-nums sm:text-3xl'>
						{cell.value}
						{cell.alert && (
							<span className='relative flex size-2'>
								<span className='absolute inset-0 animate-ping rounded-full bg-rose-500 opacity-70' />
								<span className='relative size-2 rounded-full bg-rose-500' />
							</span>
						)}
					</p>
					<p className='mt-1 truncate text-xs text-muted-foreground'>{cell.hint}</p>
				</div>
			))}
		</div>
	)
}

export default ProductsStats
