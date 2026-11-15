'use client'

import { ArrowUpRight, Check, Copy, Mail, Phone, Send } from 'lucide-react'
import { useState } from 'react'

import { contactInfo } from './contact-info'

const channels = [
	{
		icon: Phone,
		label: "Qo'ng'iroq",
		value: contactInfo.phone,
		href: contactInfo.phoneHref,
		hint: 'Eng tezkor yo\'l',
	},
	{
		icon: Send,
		label: 'Telegram',
		value: contactInfo.telegram,
		href: contactInfo.telegramHref,
		hint: "Rasm va video yuborish qulay",
	},
	{
		icon: Mail,
		label: 'Email',
		value: contactInfo.email,
		href: `mailto:${contactInfo.email}`,
		hint: 'Hamkorlik va hujjatlar uchun',
	},
]

/** Aloqa kanallari: bosilsa ochiladi, nusxa tugmasi qiymatni ko'chiradi */
const ContactChannels = () => {
	const [copied, setCopied] = useState<string | null>(null)

	const copy = async (value: string) => {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(value)
			setTimeout(() => setCopied(current => (current === value ? null : current)), 1800)
		} catch {
			// Brauzer ruxsat bermasa, jim o'tkazib yuboramiz
		}
	}

	return (
		<ul className='divide-y'>
			{channels.map(({ icon: Icon, label, value, href, hint }) => (
				<li key={label} className='group relative flex items-center gap-4 p-5'>
					<span className='flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40 transition-transform duration-300 group-hover:-rotate-6'>
						<Icon className='size-4' />
					</span>

					<div className='min-w-0 flex-1'>
						<p className='text-xs text-muted-foreground'>{label}</p>
						<a
							href={href}
							target={href.startsWith('http') ? '_blank' : undefined}
							rel={href.startsWith('http') ? 'noreferrer' : undefined}
							className='flex items-center gap-1 truncate font-mono text-sm font-medium after:absolute after:inset-0'
						>
							{value}
							<ArrowUpRight className='size-3.5 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100' />
						</a>
						<p className='text-xs text-muted-foreground'>{hint}</p>
					</div>

					<button
						type='button'
						onClick={() => copy(value)}
						aria-label={`${label} — nusxalash`}
						className='relative z-10 flex size-8 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:text-foreground'
					>
						{copied === value ? (
							<Check className='size-3.5 text-emerald-600' />
						) : (
							<Copy className='size-3.5' />
						)}
					</button>
				</li>
			))}
		</ul>
	)
}

export default ContactChannels
