const suggestions = ['Pro', 'DJI', 'Sony', 'Dron', 'Linza', 'Mikrofon']

/** Bo'sh holat: bosilganda so'rov input'ga yoziladi (va taymer ishga tushadi) */
const SearchSuggestions = ({ onPick }: { onPick: (query: string) => void }) => {
	return (
		<div className='space-y-3 p-4'>
			<p className='font-mono text-[11px] tracking-widest text-muted-foreground uppercase'>
				Ko&apos;p qidiriladi
			</p>
			<div className='flex flex-wrap gap-1.5'>
				{suggestions.map(suggestion => (
					<button
						key={suggestion}
						type='button'
						onClick={() => onPick(suggestion)}
						className='rounded-md border px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground'
					>
						{suggestion}
					</button>
				))}
			</div>
		</div>
	)
}

export default SearchSuggestions
