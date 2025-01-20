import { Schema, model } from "mongoose";

export enum Permission {
    FREE = "FREE",
    USER = "PREMIUM",
    MAX = "ADMIN"
}

export interface IUser {
    _id?: string;
    permissions: Permission[];
    nonce?: string;
    id: number;
    password: string;
    telegramConnecteduuid: string;
    memberSince: number;
    balance: number;
    name: string;
    email: string;
    phone: string;
    isPremium: boolean;
    premiumExpires: number;
}

const userSchema = new Schema<IUser>({
    permissions: {
        type: [String],
        enum: Object.values(Permission),
        default: [Permission.FREE],
    },
    password: { type: String, required: true },
    nonce: { type: String, default: "" },
    id: { type: Number, required: true, index: true },
    telegramConnecteduuid: { type: String, default: null },
    memberSince: { type: Number, required: true, index: true },
    balance: { type: Number, default: 0 },
    name: { type: String, },
    email: { type: String, index: true },
    phone: { type: String, index: true },
    isPremium: { type: Boolean, default: false },
    premiumExpires: { type: Number, default: 0 },
});

export const UserModel = model<IUser>("user", userSchema);
