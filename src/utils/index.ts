import { Model } from "mongoose";

export interface IPaginateOptions {
    page: number;
    limit?: number;
    projection?: any;
    sort?: any;
}

export interface IPaginateResult {
    results: any[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
}

export interface IPaginate {
    model: Model<any>;
    query: any;
    options: IPaginateOptions;
}

export async function paginateModel({
    model,
    query,
    options,
}: IPaginate): Promise<IPaginateResult> {
    const { page, limit, projection, sort } = options;
    const _limit = limit ? limit : 10;
    const skip = _limit * (page - 1);
    const _options = { skip, limit: _limit, sort };

    const results = await model
        .find(query, { ...projection }, { ..._options })
        .lean();
    const total = Number(await model.countDocuments(query));
    return {
        results,
        total: total,
        totalPages: Math.ceil(total / _limit),
        page: Number(page),
        limit: Number(_limit),
    };
}

// sameSite?: boolean | "lax" | "strict" | "none" | undefined;
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? ("none" as const)
            : (false as const),
};
