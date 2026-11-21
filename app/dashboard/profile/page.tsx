import type { Metadata } from 'next'

import ProfileView from './_components/profile-view'

export const metadata: Metadata = {
	title: 'Profil',
}

const ProfilePage = () => <ProfileView />

export default ProfilePage
