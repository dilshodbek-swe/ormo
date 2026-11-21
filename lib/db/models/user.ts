import 'server-only'

import { type HydratedDocument, type InferSchemaType, type Model, model, models, Schema } from 'mongoose'

export const USER_ROLES = ['customer', 'admin'] as const

/** Yetkazib berish manzili — buyurtma berishda tanlanadi */
const addressSchema = new Schema(
	{
		label: { type: String, trim: true, default: 'Uy' },
		fullName: { type: String, required: true, trim: true },
		phone: { type: String, required: true, trim: true },
		region: { type: String, required: true, trim: true },
		city: { type: String, required: true, trim: true },
		street: { type: String, required: true, trim: true },
		isDefault: { type: Boolean, default: false },
	},
	{ _id: true }
)

/**
 * Foydalanuvchi. Autentifikatsiya Clerk'da — bu yerda faqat Ormo'ga xos ma'lumotlar
 * (rol, manzillar va h.k.) hamda Clerk'dan webhook orqali sinxronlanadigan profil nusxasi.
 */
const userSchema = new Schema(
	{
		clerkId: { type: String, required: true, unique: true, index: true },
		email: { type: String, required: true, lowercase: true, trim: true, index: true },
		username: { type: String, trim: true, index: { unique: true, sparse: true } },
		firstName: { type: String, trim: true },
		lastName: { type: String, trim: true },
		imageUrl: { type: String },
		role: { type: String, enum: USER_ROLES, default: 'customer' },
		addresses: { type: [addressSchema], default: [] },
		lastSignInAt: { type: Date },
	},
	{
		timestamps: true,
		virtuals: {
			fullName: {
				get(this: { firstName?: string; lastName?: string }) {
					return [this.firstName, this.lastName].filter(Boolean).join(' ')
				},
			},
		},
		toJSON: { virtuals: true },
	}
)

export type User = InferSchemaType<typeof userSchema>
export type UserRole = (typeof USER_ROLES)[number]
export type UserDocument = HydratedDocument<User>

// HMR qayta yuklaganda "OverwriteModelError" bo'lmasligi uchun tayyor modelni qayta ishlatamiz
export const UserModel = (models.User as Model<User> | undefined) ?? model<User>('User', userSchema)
