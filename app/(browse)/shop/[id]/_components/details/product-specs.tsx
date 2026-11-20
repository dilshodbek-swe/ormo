type Props = {
	specs: [label: string, value: string][]
}

/** Texnik xususiyatlar — terminal uslubidagi kalit/qiymat jadvali */
const ProductSpecs = ({ specs }: Props) => {
	return (
		<div className='space-y-4'>
			<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
				Texnik xususiyatlar
			</h2>
			<dl className='divide-y divide-dashed border-y border-dashed'>
				{specs.map(([label, value]) => (
					<div key={label} className='grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3'>
						<dt className='font-mono text-xs text-muted-foreground'>{label}</dt>
						<dd className='text-sm font-medium'>{value}</dd>
					</div>
				))}
			</dl>
		</div>
	)
}

export default ProductSpecs
