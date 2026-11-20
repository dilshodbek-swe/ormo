const ProductInBox = ({ items }: { items: string[] }) => {
	if (items.length === 0) return null

	return (
		<div className='space-y-4'>
			<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
				Qutida
			</h2>
			<ul className='flex flex-wrap gap-2'>
				{items.map((item, index) => (
					<li
						key={item}
						className='flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-sm'
					>
						<span className='font-mono text-[10px] text-muted-foreground'>
							{String(index + 1).padStart(2, '0')}
						</span>
						{item}
					</li>
				))}
			</ul>
		</div>
	)
}

export default ProductInBox
