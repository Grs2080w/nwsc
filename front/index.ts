const backModule = require("back");
const back = backModule.default ?? backModule;

back(true).catch((err: Error) => {
	const { logger } = backModule;
	logger.error("Error starting server:", err);
	process.exit(1);
});
