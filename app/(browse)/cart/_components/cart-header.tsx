import type { ReactNode } from 'react'

type Props = {
	count: number
	/** O'ng tomondagi amal (masalan, tozalash tugmasi) */
	action?: ReactNode
}

const CartHeader = ({ count, action }: Props) => {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
			<div className='space-y-3'>
				<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
					Savat{count > 0 && ` · ${count} dona`}
				</p>
				<h1 className='font-space-grotesk text-4xl leading-[1.05] font-bold tracking-tighter sm:text-5xl'>
					{count > 0 ? (
						<>
							Deyarli tayyor.{' '}
							<span className='text-muted-foreground'>Bir qadam qoldi.</span>
						</>
					) : (
						'Savat'
					)}
				</h1>
			</div>
			{action}
		</div>
	)
}

export default CartHeader
