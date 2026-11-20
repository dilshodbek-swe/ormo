import { RotateCcw, ShieldCheck, Truck } from 'lucide-react'

const perks = [
	{ icon: Truck, title: 'Bepul yetkazish', text: 'Toshkent bo\'ylab 1 kunda' },
	{ icon: ShieldCheck, title: 'Rasmiy kafolat', text: '12 oy servis xizmati' },
	{ icon: RotateCcw, title: 'Oson qaytarish', text: '14 kun ichida' },
]

const ProductPerks = () => {
	return (
		<ul className='grid divide-y rounded-lg border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
			{perks.map(({ icon: Icon, title, text }) => (
				<li key={title} className='flex items-center gap-3 p-3 sm:flex-col sm:items-start'>
					<Icon className='size-4 shrink-0 text-muted-foreground' />
					<div>
						<p className='text-sm font-medium'>{title}</p>
						<p className='text-xs text-muted-foreground'>{text}</p>
					</div>
				</li>
			))}
		</ul>
	)
}

export default ProductPerks
