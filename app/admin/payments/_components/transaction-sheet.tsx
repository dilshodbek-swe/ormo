'use client'

import { Check, Copy, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { cn, formatDate, formatPrice } from '@/lib/utils'
import { METHODS, netOf, type Transaction } from '../_lib/transactions'
import { StatusPill } from './transactions-table'

const REFUND_REASONS = ["Mijoz so'rovi", 'Mahsulot nuqsonli', 'Buyurtma bekor qilindi', 'Ikki marta yechilgan']

interface TransactionSheetProps {
	transaction: Transaction | null
	onClose: () => void
	onRefund: (id: string, amount: number, reason: string) => void
}

const TransactionSheet = ({ transaction, onClose, onRefund }: TransactionSheetProps) => (
	<Sheet open={Boolean(transaction)} onOpenChange={open => !open && onClose()}>
		<SheetContent className='w-full gap-0 overflow-hidden p-0 data-[side=right]:sm:max-w-md'>
			{transaction && <Details key={transaction.id} transaction={transaction} onRefund={onRefund} />}
		</SheetContent>
	</Sheet>
)

const Details = ({ transaction: item, onRefund }: { transaction: Transaction; onRefund: TransactionSheetProps['onRefund'] }) => {
	const [copied, setCopied] = useState(false)
	const refundable = item.status === 'succeeded' && item.method !== 'cash' ? item.amount - item.refunded : 0

	const copy = async () => {
		await navigator.clipboard.writeText(item.reference)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	return (
		<>
			<div className='border-b p-5 pr-12'>
				<div className='flex items-center gap-2'>
					<SheetTitle className='font-mono text-base font-semibold'>{item.id}</SheetTitle>
					<StatusPill status={item.status} />
				</div>
				<SheetDescription className='mt-1 text-xs'>{formatDate(item.createdAt, { time: true })}</SheetDescription>
				<p
					className={cn(
						'mt-4 font-space-grotesk text-4xl font-bold tracking-tight tabular-nums',
						item.status === 'failed' && 'text-muted-foreground line-through'
					)}
				>
					{formatPrice(item.amount)}
				</p>
				{item.failureReason && <p className='mt-1 text-sm text-rose-600 dark:text-rose-400'>{item.failureReason}</p>}
			</div>

			<div className='flex-1 space-y-6 overflow-y-auto p-5'>
				{/* Summadan sof tushumgacha — "kaskad" */}
				{item.status !== 'failed' && (
					<Section title='Hisob-kitob'>
						<dl className='space-y-1.5 text-sm'>
							<Row label='Summa'>{formatPrice(item.amount)}</Row>
							<Row label={`Komissiya · ${METHODS[item.method].label} ${(METHODS[item.method].fee * 100).toFixed(1)}%`}>−{formatPrice(item.fee)}</Row>
							{item.refunded > 0 && <Row label='Qaytarilgan'>−{formatPrice(item.refunded)}</Row>}
							<div className='flex justify-between border-t pt-2 font-medium'>
								<dt>Sof tushum</dt>
								<dd className='font-mono tabular-nums'>{formatPrice(netOf(item))}</dd>
							</div>
						</dl>
					</Section>
				)}

				<Section title='Tarix'>
					<ol className='relative space-y-4 border-l pl-5'>
						{item.events.map((event, index) => (
							<li key={`${event.at}-${index}`} className='relative'>
								<span
									className={cn(
										'absolute top-1 -left-[25px] size-2.5 rounded-full border-2 border-background',
										event.tone === 'good' ? 'bg-emerald-500' : event.tone === 'bad' ? 'bg-rose-500' : 'bg-muted-foreground/60'
									)}
								/>
								<p className='text-sm'>{event.label}</p>
								<p className='font-mono text-[11px] text-muted-foreground'>{formatDate(event.at, { time: true })}</p>
							</li>
						))}
					</ol>
					{item.refundReason && <p className='mt-3 text-xs text-muted-foreground'>Sabab: {item.refundReason}</p>}
				</Section>

				<Section title="Ma'lumotlar">
					<dl className='space-y-2 text-sm'>
						<Row label='Usul'>
							<span className='inline-flex items-center gap-2'>
								<span className={cn('size-2 rounded-[2px]', METHODS[item.method].tone)} />
								{METHODS[item.method].label}
							</span>
						</Row>
						<Row label='Provayder havolasi'>
							<button type='button' onClick={copy} className='inline-flex items-center gap-1.5 font-mono hover:text-foreground'>
								{item.reference}
								{copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
							</button>
						</Row>
						<Row label='Buyurtma'>
							<Link href='/admin/orders' className='font-mono underline-offset-4 hover:underline'>
								{item.orderId}
							</Link>
						</Row>
						<Row label='Mijoz'>{item.customer.name}</Row>
						<Row label='Telefon'>
							<span className='font-mono'>{item.customer.phone}</span>
						</Row>
					</dl>
				</Section>
			</div>

			{refundable > 0 && <RefundForm key={refundable} max={refundable} onRefund={(amount, reason) => onRefund(item.id, amount, reason)} />}
			{item.method === 'cash' && item.status === 'pending' && (
				<p className='border-t bg-muted/30 p-4 text-xs text-muted-foreground'>
					Naqd to&apos;lov — kuryer pulni topshirganda avtomatik &laquo;To&apos;langan&raquo; bo&apos;ladi.
				</p>
			)}
		</>
	)
}

/** To'liq yoki qisman qaytarish — ikki bosqichli tasdiq bilan */
const RefundForm = ({ max, onRefund }: { max: number; onRefund: (amount: number, reason: string) => void }) => {
	const [open, setOpen] = useState(false)
	const [confirming, setConfirming] = useState(false)
	const [value, setValue] = useState(String(max))
	const [reason, setReason] = useState(REFUND_REASONS[0])
	const amount = Number(value.replace(/\s/g, ''))
	const valid = Number.isInteger(amount) && amount > 0 && amount <= max

	if (!open) {
		return (
			<div className='border-t bg-muted/30 p-4'>
				<Button variant='outline' className='w-full' onClick={() => setOpen(true)}>
					<RotateCcw />
					Mablag&apos;ni qaytarish
				</Button>
			</div>
		)
	}

	return (
		<div className='space-y-3 border-t bg-muted/30 p-4 animate-in fade-in slide-in-from-bottom-2'>
			<div className='flex items-center justify-between'>
				<p className='text-sm font-medium'>Qaytarish</p>
				<div className='flex gap-1'>
					{[
						['To‘liq', max],
						['50%', Math.round(max / 2)],
					].map(([label, preset]) => (
						<button
							key={label}
							type='button'
							onClick={() => {
								setValue(String(preset))
								setConfirming(false)
							}}
							className={cn(
								'rounded-md border px-2 py-0.5 text-xs transition-colors',
								amount === preset ? 'border-foreground bg-background' : 'text-muted-foreground hover:text-foreground'
							)}
						>
							{label}
						</button>
					))}
				</div>
			</div>
			<label className='flex h-9 items-center overflow-hidden rounded-lg border bg-background focus-within:ring-3 focus-within:ring-ring/40'>
				<input
					inputMode='numeric'
					value={value}
					onChange={event => {
						setValue(event.target.value)
						setConfirming(false)
					}}
					aria-label='Qaytariladigan summa'
					aria-invalid={!valid}
					className='h-full min-w-0 flex-1 bg-transparent px-3 font-mono text-sm outline-none'
				/>
				<span className='border-l px-3 text-xs text-muted-foreground'>/ {formatPrice(max)}</span>
			</label>
			<select
				value={reason}
				onChange={event => setReason(event.target.value)}
				aria-label='Sabab'
				className='h-9 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/40'
			>
				{REFUND_REASONS.map(item => (
					<option key={item}>{item}</option>
				))}
			</select>
			{!valid && <p className='text-xs text-destructive'>1 so&apos;mdan {formatPrice(max)} gacha butun son kiriting</p>}
			<div className='flex gap-2'>
				<Button variant='outline' onClick={() => setOpen(false)}>
					Bekor
				</Button>
				{confirming ? (
					<Button variant='destructive' className='flex-1' onClick={() => onRefund(amount, reason)}>
						Ha, {formatPrice(amount)} qaytarilsin
					</Button>
				) : (
					<Button className='flex-1' disabled={!valid} onClick={() => setConfirming(true)}>
						{formatPrice(valid ? amount : 0)} qaytarish
					</Button>
				)}
			</div>
		</div>
	)
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
	<section>
		<h3 className='mb-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{title}</h3>
		{children}
	</section>
)

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
	<div className='flex items-baseline justify-between gap-4'>
		<dt className='text-muted-foreground'>{label}</dt>
		<dd className='min-w-0 truncate text-right font-mono tabular-nums'>{children}</dd>
	</div>
)

export default TransactionSheet
