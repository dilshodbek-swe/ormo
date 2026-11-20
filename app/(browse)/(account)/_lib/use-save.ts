'use client'

import { useRef, useState } from 'react'

import { errorMessage } from '@/lib/clerk/errors'
import type { SaveState } from '../_components/save-button'

/**
 * Asinxron saqlash amali uchun holat: saving → saved (2 soniya) → idle.
 * Xato bo'lsa — o'zbekcha matn `error` da.
 */
export const useSave = () => {
	const [state, setState] = useState<SaveState>('idle')
	const [error, setError] = useState<string>()
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

	const run = async (action: () => Promise<unknown>) => {
		clearTimeout(timer.current)
		setError(undefined)
		setState('saving')
		try {
			await action()
			setState('saved')
			timer.current = setTimeout(() => setState('idle'), 2000)
			return true
		} catch (caught) {
			setError(errorMessage(caught))
			setState('idle')
			return false
		}
	}

	return { state, error, setError, run }
}
