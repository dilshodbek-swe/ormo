import { ArrowRight, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'

/** Formaning asosiy tugmasi: yuklanayotganda spinner, aks holda strelka */
const SubmitButton = ({ loading, children }: { loading: boolean; children: ReactNode }) => {
	return (
		<Button type='submit' size='lg' disabled={loading} className='group h-10 w-full'>
			{children}
			{loading ? (
				<Loader2 className='animate-spin' />
			) : (
				<ArrowRight className='transition-transform group-hover:translate-x-0.5' />
			)}
		</Button>
	)
}

export default SubmitButton
