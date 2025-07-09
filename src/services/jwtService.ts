import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

class Jwt {
    private static instance: Jwt;
    private static JWT_SECRET: string = process.env.JWT_SECRET as string;

    private constructor() { }

    public static getInstance(): Jwt {
        if (!Jwt.instance) {
            Jwt.instance = new Jwt();
        }
        return Jwt.instance;
    }

    public async sign(payload: any): Promise<string> {
        return jwt.sign(payload, Jwt.JWT_SECRET, { expiresIn: "72h" });
    }

    public async verify(token: string): Promise<any> {
        return jwt.verify(token, Jwt.JWT_SECRET);
    }

    public async decode(token: string): Promise<JwtPayload> {
        return jwt.decode(token) as JwtPayload;
    }
}

export const jwtService = Jwt.getInstance() as Jwt;
