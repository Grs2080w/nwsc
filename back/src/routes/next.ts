import express from "express";
import Next from "next";

export default async function MountNextRoutes() {
	const router = express.Router();
	const nextApp = Next({
		customServer: true,
	});
	const handle = nextApp.getRequestHandler();

	await nextApp.prepare();

	router.all("*path", (req, res) => {
		return handle(req, res);
	});

	return router;
}
