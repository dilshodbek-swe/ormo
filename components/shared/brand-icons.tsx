import type { OAuthStrategy } from '@clerk/nextjs/types'

export const GoogleIcon = ({ className = 'size-4' }: { className?: string }) => (
	<svg viewBox='0 0 24 24' aria-hidden className={className}>
		<path fill='#4285F4' d='M23.5 12.27c0-.79-.07-1.54-.19-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.56-5.17 3.56-8.66Z' />
		<path fill='#34A853' d='M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24Z' />
		<path fill='#FBBC05' d='M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l3.99-3.09Z' />
		<path fill='#EA4335' d='M12 4.76c1.76 0 3.34.61 4.59 1.8l3.43-3.43A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.28 6.63l3.99 3.09C6.22 6.87 8.87 4.76 12 4.76Z' />
	</svg>
)

export const GitHubIcon = ({ className = 'size-4' }: { className?: string }) => (
	<svg viewBox='0 0 24 24' aria-hidden className={`fill-current ${className}`}>
		<path d='M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3' />
	</svg>
)

/** Ilovada yoqilgan OAuth provayderlar — kirish va sozlamalar sahifalarida bir xil ro'yxat */
export const oauthProviders: {
	strategy: OAuthStrategy
	provider: 'google' | 'github'
	label: string
	icon: typeof GoogleIcon
}[] = [
	{ strategy: 'oauth_google', provider: 'google', label: 'Google', icon: GoogleIcon },
	{ strategy: 'oauth_github', provider: 'github', label: 'GitHub', icon: GitHubIcon },
]
