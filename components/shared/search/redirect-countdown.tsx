import { REDIRECT_DELAY_MS } from './use-search-redirect'

/**
 * Input ostidagi ingichka chiziq: avtomatik o'tishgacha qolgan vaqt.
 * `restartKey` o'zgarganda (yangi harf) chiziq boshidan to'ladi.
 */
const RedirectCountdown = ({ active, restartKey }: { active: boolean; restartKey: string }) => {
	return (
		<div aria-hidden className='h-px bg-border'>
			{active && (
				<span
					key={restartKey}
					className='block h-px w-full bg-linear-to-r from-amber-300 via-orange-500 to-rose-500 motion-safe:w-0 motion-safe:animate-progress'
					style={{ animationDuration: `${REDIRECT_DELAY_MS}ms` }}
				/>
			)}
		</div>
	)
}

export default RedirectCountdown
