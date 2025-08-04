import { Schema, model } from "mongoose";

// Enum with corrected value mapping
export enum Permission {
    FREE = "FREE",
    USER = "PREMIUM",
    MAX = "ADMIN"
}

export interface IUser {
    name: string;
    email: string;
    password: string; // Made required to match schema
    created_at: Date; // Better as Date
    permissions: Permission;
}

const userSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String, index: true, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    permissions: { type: String, enum: Object.values(Permission), required: true },
});

export const UserModel = model<IUser>("User", userSchema);
