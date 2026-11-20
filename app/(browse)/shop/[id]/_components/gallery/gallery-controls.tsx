import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
	onPrev: () => void
	onNext: () => void
}

/** Sahna chetlaridagi oldingi/keyingi tugmalari — sichqoncha sahnaga kirganda ko'rinadi */
const GalleryControls = ({ onPrev, onNext }: Props) => {
	const className =
		'absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 backdrop-blur transition-opacity md:opacity-0 md:group-hover/stage:opacity-100 md:focus-visible:opacity-100'

	return (
		<>
			<Button
				variant='outline'
				size='icon'
				onClick={onPrev}
				aria-label='Oldingi rasm'
				className={`${className} left-4`}
			>
				<ArrowLeft />
			</Button>
			<Button
				variant='outline'
				size='icon'
				onClick={onNext}
				aria-label='Keyingi rasm'
				className={`${className} right-4`}
			>
				<ArrowRight />
			</Button>
		</>
	)
}

export default GalleryControls
