import { catalogCategories, catalogProducts } from '@/lib/data/catalog'

const stats = [
	{ label: 'Mahsulot', value: catalogProducts.length },
	// "Barchasi" kategoriya sifatida sanalmaydi
	{ label: 'Kategoriya', value: catalogCategories.length - 1 },
	{ label: 'Kafolat', value: '100%' },
]

const CatalogStats = () => {
	return (
		<dl className='grid grid-cols-3 divide-x rounded-xl border'>
			{stats.map(({ label, value }) => (
				<div key={label} className='px-5 py-3'>
					<dt className='text-xs text-muted-foreground'>{label}</dt>
					<dd className='font-mono text-2xl font-semibold tabular-nums'>{value}</dd>
				</div>
			))}
		</dl>
	)
}

export default CatalogStats
