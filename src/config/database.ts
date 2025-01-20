import { connect } from "mongoose";

export async function connectDatabase() {
    await connect(process.env.MONGO_URL as string);
    return true;
}
