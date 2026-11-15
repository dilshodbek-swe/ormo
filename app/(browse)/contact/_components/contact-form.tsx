'use client'

import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const topics = ['Buyurtma', 'Kafolat va servis', 'Mahsulot tanlash', 'Hamkorlik', 'Boshqa']

const MAX_MESSAGE = 500

type Errors = Partial<Record<'name' | 'contact' | 'message', string>>

const ContactForm = () => {
	const [topic, setTopic] = useState(topics[0])
	const [name, setName] = useState('')
	const [contact, setContact] = useState('')
	const [message, setMessage] = useState('')
	const [errors, setErrors] = useState<Errors>({})
	const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
	const [ticket, setTicket] = useState('')

	const validate = () => {
		const next: Errors = {}
		if (name.trim().length < 2) next.name = 'Ismingizni kiriting'
		if (contact.trim().length < 5) next.contact = 'Telefon yoki email kiriting'
		if (message.trim().length < 10) next.message = 'Kamida 10 ta belgi yozing'
		setErrors(next)
		return Object.keys(next).length === 0
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!validate()) return

		setStatus('sending')
		// TODO: API ulanganda murojaatni serverga yuborish
		await new Promise(resolve => setTimeout(resolve, 900))
		setTicket(`ORM-${Math.floor(1000 + Math.random() * 9000)}`)
		setStatus('sent')
	}

	const reset = () => {
		setName('')
		setContact('')
		setMessage('')
		setErrors({})
		setStatus('idle')
	}

	if (status === 'sent') {
		return (
			<div className='animate-in fade-in zoom-in-95 flex h-full flex-col items-center justify-center gap-4 py-16 text-center duration-500'>
				<span className='flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white'>
					<Check className='size-6' />
				</span>
				<div className='space-y-1'>
					<p className='font-space-grotesk text-2xl font-bold tracking-tight'>
						Xabaringiz yetib keldi!
					</p>
					<p className='text-sm text-muted-foreground'>
						Murojaat raqami:{' '}
						<span className='font-mono text-foreground'>#{ticket}</span>
					</p>
				</div>
				<p className='max-w-xs text-sm text-muted-foreground'>
					Mutaxassisimiz tez orada <span className='font-mono'>{contact}</span>{' '}
					orqali siz bilan bog&apos;lanadi.
				</p>
				<Button variant='outline' onClick={reset}>
					Yana yozish
				</Button>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} noValidate className='space-y-6'>
			{/* Mavzu tanlash */}
			<fieldset className='space-y-3'>
				<legend className='mb-3 text-sm font-medium'>Qaysi mavzuda?</legend>
				<div className='flex flex-wrap gap-2'>
					{topics.map(item => (
						<button
							key={item}
							type='button'
							onClick={() => setTopic(item)}
							aria-pressed={topic === item}
							className={cn(
								'rounded-full border px-3.5 py-1.5 text-sm transition-all',
								topic === item
									? 'border-foreground bg-foreground text-background'
									: 'text-muted-foreground hover:border-foreground/40 hover:text-foreground'
							)}
						>
							{item}
						</button>
					))}
				</div>
			</fieldset>

			<div className='grid gap-4 sm:grid-cols-2'>
				<Field label='Ismingiz' error={errors.name}>
					<Input
						value={name}
						onChange={event => setName(event.target.value)}
						placeholder='Aziz'
						aria-invalid={Boolean(errors.name)}
						className='h-11'
					/>
				</Field>
				<Field label='Telefon yoki email' error={errors.contact}>
					<Input
						value={contact}
						onChange={event => setContact(event.target.value)}
						placeholder='+998 90 123 45 67'
						aria-invalid={Boolean(errors.contact)}
						className='h-11 font-mono'
					/>
				</Field>
			</div>

			<Field label='Xabar' error={errors.message}>
				<Textarea
					value={message}
					onChange={event => setMessage(event.target.value.slice(0, MAX_MESSAGE))}
					placeholder={`${topic} bo'yicha savolingizni yozing...`}
					aria-invalid={Boolean(errors.message)}
					className='min-h-36 resize-none'
				/>
				<span className='absolute right-3 bottom-2 font-mono text-[11px] text-muted-foreground tabular-nums'>
					{message.length}/{MAX_MESSAGE}
				</span>
			</Field>

			<div className='flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<p className='text-xs text-muted-foreground'>
					Yuborish orqali maxfiylik siyosatiga rozilik bildirasiz.
				</p>
				<Button
					type='submit'
					size='lg'
					disabled={status === 'sending'}
					className='group h-11 px-6'
				>
					{status === 'sending' ? (
						<>
							<Loader2 className='animate-spin' />
							Yuborilmoqda...
						</>
					) : (
						<>
							Yuborish
							<ArrowRight className='transition-transform group-hover:translate-x-0.5' />
						</>
					)}
				</Button>
			</div>
		</form>
	)
}

const Field = ({
	label,
	error,
	children,
}: {
	label: string
	error?: string
	children: React.ReactNode
}) => (
	<label className='block space-y-2'>
		<span className='flex items-center justify-between text-sm font-medium'>
			{label}
			{error && (
				<span className='animate-in fade-in text-xs font-normal text-destructive'>
					{error}
				</span>
			)}
		</span>
		<span className='relative block'>{children}</span>
	</label>
)

export default ContactForm
