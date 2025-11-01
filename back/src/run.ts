// logger
import logger from "./logger/logger";

import main from "./main/main";

main().catch((err) => {
	logger.error("Error starting server:", err);
	process.exit(1);
});
