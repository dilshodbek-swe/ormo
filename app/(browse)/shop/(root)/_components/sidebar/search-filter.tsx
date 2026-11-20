import { Search, X } from 'lucide-react'

import { Input } from '@/components/ui/input'

type Props = {
	value: string
	onChange: (value: string) => void
}

const SearchFilter = ({ value, onChange }: Props) => {
	return (
		<div className='relative'>
			<Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
			<Input
				type='search'
				value={value}
				onChange={event => onChange(event.target.value)}
				placeholder='Mahsulot nomi yoki brend'
				aria-label='Qidiruv'
				className='h-10 pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden'
			/>
			{value && (
				<button
					type='button'
					onClick={() => onChange('')}
					aria-label='Qidiruvni tozalash'
					className='absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
				>
					<X className='size-3.5' />
				</button>
			)}
		</div>
	)
}

export default SearchFilter
