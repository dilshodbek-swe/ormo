import { cn } from '@/lib/utils'

const BLADES = 8
const INNER = 22 // markaziy teshik radiusi
const OUTER = 48 // tashqi halqa radiusi

/** Diafragma pardalari chiziqlarini hisoblaydi (viewBox 0..100) */
const getBlades = () => {
	const vertices = Array.from({ length: BLADES }, (_, i) => {
		const angle = (i / BLADES) * Math.PI * 2
		return [INNER * Math.cos(angle), INNER * Math.sin(angle)]
	})

	return vertices.map(([x, y], i) => {
		const [nx, ny] = vertices[(i + 1) % BLADES]
		const length = Math.hypot(nx - x, ny - y)
		const [dx, dy] = [(nx - x) / length, (ny - y) / length]
		// Chiziqni tashqi halqagacha davom ettiramiz: |v + t·d| = OUTER
		const b = x * dx + y * dy
		const t = -b + Math.sqrt(b * b - (x * x + y * y - OUTER * OUTER))
		return { x1: 50 + x, y1: 50 + y, x2: 50 + x + dx * t, y2: 50 + y + dy * t }
	})
}

const blades = getBlades()
const hole = blades.map(({ x1, y1 }) => `${x1},${y1}`).join(' ')

/** Kamera diafragmasi ko'rinishidagi dekorativ SVG */
const Aperture = ({ className }: { className?: string }) => (
	<svg
		viewBox='0 0 100 100'
		aria-hidden
		className={cn('pointer-events-none', className)}
		fill='none'
		stroke='currentColor'
		strokeWidth={0.35}
	>
		<circle cx={50} cy={50} r={OUTER} />
		<circle cx={50} cy={50} r={OUTER - 3} strokeDasharray='0.6 1.6' />
		<polygon points={hole} />
		{blades.map((line, i) => (
			<line key={i} {...line} />
		))}
	</svg>
)

export default Aperture
