/** So'z harflari birin-ketin yuqoridan tushadi */
const FallingWord = ({ word, delayMs = 0 }: { word: string; delayMs?: number }) => {
	return (
		<span aria-label={word} className='inline-flex'>
			{[...word].map((letter, index) => (
				<span
					key={index}
					aria-hidden
					className='inline-block motion-safe:animate-letter-drop'
					style={{ animationDelay: `${delayMs + index * 70}ms` }}
				>
					{letter}
				</span>
			))}
		</span>
	)
}

export default FallingWord
