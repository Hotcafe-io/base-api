export * as UserResponse from "./userResponse";
import { IUser } from "../../models";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export type JwtPayload = {
    iat: number;
    exp: number;
    nonce: string;
    email: string;
    password: string;
};
