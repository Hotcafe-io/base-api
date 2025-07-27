import "express-async-errors";

import express from "express";
import http from "http";

import { connectDatabase } from "@/config";
import { cookieParser, allowCors } from "@/middlewares";
import { loadRoutes, RouteDefinition } from "@/loader";

const expectedEnvVars = ["MONGO_URL", "PORT", "JWT_SECRET"];

expectedEnvVars.forEach((envVar) => {
	if (!process.env[envVar]) {
		throw new Error(`Environment variable ${envVar} is not set.`);
	}
});

const appRoutes = new Map<string, RouteDefinition>();

async function startServer() {
	const routes = loadRoutes();

	routes.forEach(route => {
		appRoutes.set(route.path, route);
	});

	await connectDatabase();

	const app = express();

	//middlewares
	app.use(allowCors);
	app.use(express.json());
	app.use(cookieParser);
	app.use((req, res, next) => {
		console.log(`Request made to: ${req.url}`);
		next();
	});

	app.use((req, res, next) => {
		const route = appRoutes.get(req.url);
		const method = req.method.toUpperCase();

		if (route) {
			const fn = route.functions.find(f => f.method === method);

			for (const middleware of fn?.middlewares || []) {
				middleware(req, res, next);
			}

			if (fn) {
				fn.handler(req, res);
			} else {
				res.status(405).send({ error: "Method not allowed" });
			}
		} else {
			res.status(404).send({ error: "Route not found" });
		}
	})

	const server = http.createServer(app);

	const PORT = process.env.PORT || 3000;

	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);

		console.log(`Available routes:`);
		appRoutes.forEach((route, path) => {
			console.log(`- ${path}`);
			route.functions.forEach(fn => {
				console.log(`  - ${fn.method} ${path}`);
			});
		});
	});
}

startServer().catch((error) => {
	console.error(`Failed to start server: ${error.message}`);
});
