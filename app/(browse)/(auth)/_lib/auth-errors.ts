import { PASSWORD_MIN_LENGTH } from './constants'

/** Clerk xato kodlarining o'zbekcha matnlari. Ro'yxatda yo'q kod uchun Clerk'ning o'z matni ko'rsatiladi. */
const messages: Record<string, string> = {
	form_identifier_not_found: 'Bunday akkaunt topilmadi',
	form_password_incorrect: "Parol noto'g'ri",
	form_code_incorrect: "Kod noto'g'ri",
	verification_expired: "Kod muddati tugagan — yangisini so'rang",
	verification_failed: "Tasdiqlab bo'lmadi, qaytadan urinib ko'ring",
	too_many_requests: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring",
	user_locked: "Akkaunt vaqtincha bloklandi. Keyinroq qayta urinib ko'ring",
	session_exists: 'Siz allaqachon tizimdasiz',
	form_identifier_exists: 'Bu qiymat allaqachon band',
	form_identifier_exists__email_address: 'Bu email bilan akkaunt allaqachon mavjud',
	form_identifier_exists__username: 'Bu username band, boshqasini tanlang',
	form_password_pwned:
		"Bu parol ma'lumotlar sizib chiqishida aniqlangan. Xavfsizroq parol tanlang",
	form_password_length_too_short: `Parol juda qisqa — kamida ${PASSWORD_MIN_LENGTH} ta belgi bo'lsin`,
	form_password_length_too_long: 'Parol juda uzun',
	form_password_validation_failed: "Parol talablarga mos emas",
	form_password_size_in_bytes_exceeded: 'Parol juda uzun',
	form_password_matches_identifier: "Parol email yoki username bilan bir xil bo'lmasin",
	form_username_invalid_length: "Username 4–64 belgidan iborat bo'lishi kerak",
	form_username_invalid_character: "Username faqat lotin harflari, raqamlar, '-' va '_' dan iborat bo'lsin",
	form_username_needs_non_number_char: "Username faqat raqamlardan iborat bo'lmasin",
	form_param_format_invalid: "Format noto'g'ri",
	form_param_format_invalid__email_address: "Email manzil noto'g'ri",
	form_param_nil: "Bu maydonni to'ldiring",
	form_param_missing: "Bu maydonni to'ldiring",
	form_param_value_invalid: "Qiymat noto'g'ri",
	form_param_max_length_exceeded: 'Juda uzun qiymat',
	strategy_for_user_invalid: "Bu akkaunt boshqa usul bilan ochilgan — Google yoki GitHub orqali kiring",
	not_allowed_access: "Bu manzil bilan kirish ruxsat etilmagan",
	external_account_not_found: "Akkaunt topilmadi. Avval ro'yxatdan o'ting",
	identifier_already_signed_in: 'Siz allaqachon tizimdasiz',
	captcha_invalid: "Bot tekshiruvidan o'tilmadi. Sahifani yangilab qayta urinib ko'ring",
}

type ErrorLike = { code?: string; message?: string; longMessage?: string } | null | undefined

/** Clerk xatosini foydalanuvchiga ko'rsatiladigan matnga aylantiradi */
export const translateError = (error: ErrorLike) => {
	if (!error) return undefined
	if (error.code && messages[error.code]) return messages[error.code]
	return error.longMessage || error.message || "Nimadir xato ketdi. Qaytadan urinib ko'ring"
}

/** Maydonga bog'lanmagan (umumiy) xato — maydon xatolari alohida ko'rsatiladi */
export const globalError = (errors: { global: ErrorLike[] | null }) =>
	translateError(errors.global?.[0])
