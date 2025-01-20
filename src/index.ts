import "dotenv/config";
import "express-async-errors";

import express from "express";
import http from "http";

import { connectDatabase } from "./config";
import { router } from "./routes";
import { cookieParser, allowCors } from "./middlewares";

async function startServer() {
	await connectDatabase();

	const app = express();

	//middlewares
	app.use(allowCors);

	app.use(express.json());
	app.use(cookieParser);

	app.use(router);

	const server = http.createServer(app);

	const PORT = process.env.PORT || 3000;

	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

startServer().catch((error) => {
	console.error(`Failed to start server: ${error.message}`);
});
