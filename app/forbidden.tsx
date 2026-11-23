import { ArrowLeft, LayoutGrid } from 'lucide-react'
import Link from 'next/link'

/**
 * 403 — forbidden() chaqirilganda (hozircha: admin bo'lmagan foydalanuvchi /admin ga kirsa).
 * Bu fayl har bir sahifa bilan yuboriladi, shuning uchun faqat Server Component + Link.
 */
const Forbidden = () => {
	return (
		<main className='relative flex min-h-svh flex-1 items-center justify-center overflow-hidden px-4 py-16'>
			{/* To'r fon markazdan so'nadi */}
			<div
				aria-hidden
				className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_at_center,black,transparent_65%)]'
			/>

			<div className='relative w-full max-w-md text-center'>
				{/* Qulf: ikki kesishgan romb */}
				<div aria-hidden className='relative mx-auto mb-8 size-20'>
					<span className='absolute inset-3 rotate-45 rounded-lg border-2 border-dashed border-muted-foreground/40' />
					<span className='absolute inset-6 rotate-45 rounded-md bg-foreground' />
				</div>

				<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>Xato 403 · Ruxsat yo&apos;q</p>
				<h1 className='mt-3 font-space-grotesk text-4xl leading-[1.05] font-bold tracking-tighter text-balance sm:text-5xl'>
					Bu eshik faqat adminlar uchun
				</h1>
				<p className='mt-4 text-muted-foreground'>
					Akkauntingizda bu sahifani ko&apos;rish huquqi yo&apos;q. Agar bu xato deb o&apos;ylasangiz, do&apos;kon
					administratoriga murojaat qiling.
				</p>

				<div className='mt-8 flex flex-col justify-center gap-2 sm:flex-row'>
					<Link
						href='/dashboard'
						className='inline-flex h-9 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90'
					>
						<LayoutGrid className='size-4' />
						Mening kabinetim
					</Link>
					<Link
						href='/'
						className='inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted'
					>
						<ArrowLeft className='size-4' />
						Bosh sahifaga
					</Link>
				</div>
			</div>
		</main>
	)
}

export default Forbidden
