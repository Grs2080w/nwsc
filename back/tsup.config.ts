import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/main.ts"],
	format: ["cjs"],
	dts: false,
	splitting: false,
	clean: true,
	external: ["next", "react", "react-dom"]
	//   esbuildOptions(options) {
	//     options.banner = {
	//       js: '"use strict";',
	//     };
	//   },
	//   // 👇 Força interop default
	//   esbuildPlugins: [
	//     {
	//       name: "fix-cjs-default",
	//       setup(build) {
	//         build.onEnd((result) => {
	//           const fs = require("fs");
	//           const path = require("path");
	//           const outFile = path.resolve("dist/main.cjs");
	//           let code = fs.readFileSync(outFile, "utf-8");
	//           if (!code.includes("exports.default")) {
	//             code += "\nexports.default = module.exports;\n";
	//             fs.writeFileSync(outFile, code);
	//           }
	//         });
	//       },
	//     },
	//   ],
});
