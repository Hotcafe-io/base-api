import { Schema, model } from "mongoose";

export enum Permission {
    FREE = "FREE",
    USER = "PREMIUM",
    MAX = "ADMIN"
}

export type DigitalMarketTimeOptions = "Menos de 1 ano" | "Entre 1 e 2 anos" | "Entre 2 e 3 anos" | "Mais de 3 anos";

export enum UsedPlatforms {
    GoogleAds = "Google Ads",
    MetaAds = "Meta Ads",
    YoutubeAds = "Youtube Ads",
    TaboolaAds = "Taboola Ads",
    TikTokAds = "TikTok Ads",
    Outras = "Outras",
}

export type ClientCountOptions = "1 a 3" | "4 a 7" | "8 a 15" | "16 a 25" | "26 a 40" | "Mais de 40";

export interface IUser {
    id: any;
    name: string;
    email: string;
    phone: string;
    telegramConnecteduuid: string;
    memberSince: number;
    balance: number;
    isPremium: boolean;
    premiumExpires: number;
    password?: string;
    digital_market_time: DigitalMarketTimeOptions;
    used_platforms: UsedPlatforms[];
    created_at: string;
    client_count: ClientCountOptions;
    telegram_connected: boolean;
    profile_information_filled: boolean;
    coin_balance: number;
    telegram_id: number;
}

const userSchema = new Schema<IUser>({
    password: { type: String, required: true },
    id: { type: Number, index: true },
    telegramConnecteduuid: { type: String },
    memberSince: { type: Number, index: true, default: Date.now() },
    balance: { type: Number, default: 0 },
    name: { type: String, },
    email: { type: String, index: true, required: true, unique: true },
    phone: { type: String, index: true, required: true, unique: true },
    isPremium: { type: Boolean, default: false },
    premiumExpires: { type: Number, default: 0 },
    digital_market_time: { type: String },
    used_platforms: { type: [String] },
    created_at: { type: String },
    client_count: { type: String },
    telegram_connected: { type: Boolean, default: false },
    profile_information_filled: { type: Boolean, default: false },
    coin_balance: { type: Number, default: 0 },
    telegram_id: { type: Number, default: 0 }
});

export const UserModel = model<IUser>("user", userSchema);
