import { Briefcase, House, MapPin, type LucideIcon } from 'lucide-react'

import type { AddressLabel } from '../_lib/types'

export const LABEL_ICONS: Record<AddressLabel, LucideIcon> = {
	Uy: House,
	Ish: Briefcase,
	Boshqa: MapPin,
}
