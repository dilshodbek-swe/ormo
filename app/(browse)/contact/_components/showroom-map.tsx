/**
 * Stilize qilingan xarita: ko'chalar chiziqlari va pulslanuvchi belgi.
 * Haqiqiy xarita (Yandex/Google) ulanguncha dekorativ sifatida ishlatiladi.
 */
const ShowroomMap = () => (
	<div className='relative size-full min-h-72 overflow-hidden bg-muted/40'>
		<svg
			viewBox='0 0 400 300'
			preserveAspectRatio='xMidYMid slice'
			aria-hidden
			className='absolute inset-0 size-full text-foreground'
		>
			{/* Kvartallar */}
			<g fill='currentColor' opacity={0.04}>
				<rect x='20' y='20' width='110' height='70' rx='4' />
				<rect x='150' y='20' width='90' height='70' rx='4' />
				<rect x='260' y='20' width='120' height='120' rx='4' />
				<rect x='20' y='110' width='110' height='90' rx='4' />
				<rect x='150' y='110' width='90' height='90' rx='4' />
				<rect x='20' y='220' width='220' height='60' rx='4' />
				<rect x='260' y='160' width='120' height='120' rx='4' />
			</g>
			{/* Ko'chalar */}
			<g stroke='currentColor' fill='none' strokeLinecap='round'>
				<path d='M0 100 H400' strokeWidth={6} opacity={0.08} />
				<path d='M140 0 V300' strokeWidth={6} opacity={0.08} />
				<path d='M250 0 V300' strokeWidth={4} opacity={0.08} />
				<path d='M0 210 H400' strokeWidth={4} opacity={0.08} />
				<path d='M0 300 L400 40' strokeWidth={10} opacity={0.06} />
				{/* Marshrut */}
				<path
					d='M40 260 C 90 230, 120 160, 200 150'
					strokeWidth={2}
					strokeDasharray='4 6'
					opacity={0.5}
				/>
			</g>
		</svg>

		{/* Belgi */}
		<div className='absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center'>
			<span className='mb-2 rounded-md bg-foreground px-2.5 py-1 text-xs font-medium whitespace-nowrap text-background shadow-sm'>
				Ormo showroom
			</span>
			<span className='relative flex size-4'>
				<span className='absolute inline-flex size-full rounded-full bg-foreground opacity-30 motion-safe:animate-ping' />
				<span className='relative inline-flex size-4 rounded-full border-4 border-background bg-foreground shadow' />
			</span>
		</div>
	</div>
)

export default ShowroomMap
