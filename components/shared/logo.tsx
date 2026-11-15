import Link from 'next/link'

import { cn } from '@/lib/utils'

const Logo = ({ className }: { className?: string }) => {
	return (
		<Link
			href='/'
			className={cn('font-space-grotesk font-bold tracking-tight text-black flex items-center space-x-2 cursor-pointer', className)}
		>
			<div className="w-4 h-4 bg-black rounded-sm transform rotate-45"></div>
			<span>Ormo</span>
		</Link>
	)
}

export default Logo
