import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { AdminUserRow } from '../_lib/types'

export const initialsOf = (user: Pick<AdminUserRow, 'fullName' | 'username' | 'email'>) => {
	const fromName = user.fullName
		.split(' ')
		.filter(Boolean)
		.map(part => part[0])
		.join('')
		.slice(0, 2)
	return (fromName || user.username?.[0] || user.email[0] || '?').toUpperCase()
}

/** Avatar: Clerk rasmi bo'lsa — rasm, aks holda bosh harflar; admin — burchakda romb belgisi */
const UserAvatarCell = ({ user, size = 'default', className }: { user: AdminUserRow; size?: 'default' | 'lg'; className?: string }) => (
	<span className={cn('relative shrink-0', className)}>
		<Avatar size={size}>
			{user.imageUrl && <AvatarImage src={user.imageUrl} alt='' />}
			<AvatarFallback className='bg-foreground font-medium text-background'>{initialsOf(user)}</AvatarFallback>
		</Avatar>
		{user.role === 'admin' && (
			<span title='Admin' className='absolute -right-0.5 -bottom-0.5 size-3 rotate-45 rounded-[2px] border-2 border-background bg-foreground' />
		)}
	</span>
)

export default UserAvatarCell
