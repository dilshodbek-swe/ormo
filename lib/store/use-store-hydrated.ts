import { useSyncExternalStore } from 'react'

import { useStore } from './index'

/*
 * Serverda localStorage yo'q — zustand bunday holatda `persist` API'sini biriktirmaydi,
 * shuning uchun `useStore.persist` faqat brauzerda mavjud.
 */
const subscribe = (onChange: () => void) =>
	useStore.persist?.onFinishHydration(onChange) ?? (() => {})

const getSnapshot = () => useStore.persist?.hasHydrated() ?? false

/**
 * Store localStorage'dan tiklanganmi. Serverda va birinchi renderda — `false`.
 * Masalan, savat sahifasi tiklanguncha skelet ko'rsatadi (bo'sh savatni "miltillatmaslik" uchun).
 */
const useStoreHydrated = () => useSyncExternalStore(subscribe, getSnapshot, () => false)

export default useStoreHydrated
