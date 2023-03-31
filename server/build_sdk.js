const pkg = require("./package.json");

require("esbuild").buildSync({
  entryPoints: ["src/sdk.ts"],
  outfile: "sdk/index.js",
  format: "esm",
  bundle: true,
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
});
