import type { Metadata } from 'next'

import ProfileView from './_components/profile-view'

export const metadata: Metadata = {
	title: 'Profil — Ormo',
	robots: { index: false },
}

const ProfilePage = () => <ProfileView />

export default ProfilePage
