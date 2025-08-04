import { IUser, UserModel } from "@/models";
import bcrypt from "bcrypt";

class User {
    private static instance: User;

    private constructor() { }

    public static getInstance(): User {
        if (!User.instance) {
            User.instance = new User();
        }
        return User.instance;
    }

    public async validateEmail(email: string): Promise<boolean> {
        return !!(await UserModel.countDocuments({ email }));
    }

    public async getUser(email: string, password: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ email }).lean();

        if (!user) return null;

        const isPasswordValid = await this.verifyPassword(password, user.password!);

        if (!isPasswordValid) return null;

        return await UserModel.findOne({
            email
        })
            .select({
                password: 0,
                __v: 0,
                _id: 0
            });
    }

    public async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    public async register(name: string, email: string, password: string): Promise<IUser | null> {
        return await UserModel.create({
            name,
            email,
            password: await this.hashPassword(password)
        });
    }

    public async userExists(email: string): Promise<boolean> {
        return !!(await UserModel.countDocuments({ email }));
    }

    public async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}

export const userService = User.getInstance() as User;
