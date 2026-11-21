'use client'

import { useUser } from '@clerk/nextjs'

import AccountSkeleton from '../../_components/account-skeleton'
import PageHeader from '../../_components/page-header'
import EmailCard from './email-card'
import PersonalInfoCard from './personal-info-card'
import ProfileHero from './profile-hero'
import UsernameCard from './username-card'

const ProfileView = () => {
	const { user } = useUser()

	return (
		<>
			<PageHeader
				eyebrow='Dashboard · Profil'
				title={
					<>
						{user?.firstName ? `Salom, ${user.firstName}.` : 'Salom.'}{' '}
						<span className='text-muted-foreground'>Bu sizning burchagingiz.</span>
					</>
				}
			/>

			{user ? (
				<div className='space-y-6'>
					<ProfileHero user={user} />
					<PersonalInfoCard user={user} />
					<UsernameCard user={user} />
					<EmailCard user={user} />
				</div>
			) : (
				<AccountSkeleton />
			)}
		</>
	)
}

export default ProfileView
