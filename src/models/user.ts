import { Schema, model } from "mongoose";

export enum Permission {
    FREE = "FREE",
    USER = "PREMIUM",
    MAX = "ADMIN"
}

export interface IUser {
    name: string;
    email: string;
    phone: string;
    memberSince: number;
    balance: number;
    isPremium: boolean;
    premiumExpires: number;
    password?: string;
    created_at: string;
    telegram_connected: boolean;
    profile_information_filled: boolean;
    coin_balance: number;
    telegram_id: number;
}

const userSchema = new Schema<IUser>({
    password: { type: String, required: true },
    memberSince: { type: Number, index: true, default: Date.now() },
    balance: { type: Number, default: 0 },
    name: { type: String, },
    email: { type: String, index: true, required: true, unique: true },
    phone: { type: String, index: true, required: true, unique: true },
    isPremium: { type: Boolean, default: false },
    premiumExpires: { type: Number, default: 0 },
    created_at: { type: String },
    telegram_connected: { type: Boolean, default: false },
    profile_information_filled: { type: Boolean, default: false },
    coin_balance: { type: Number, default: 0 },
    telegram_id: { type: Number, default: 0 }
});

export const UserModel = model<IUser>("user", userSchema);
