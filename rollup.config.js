// rollup.config.js
import { nodeResolve } from "@rollup/plugin-node-resolve"
import ts from "rollup-plugin-typescript2"
import commonjs from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import json from "@rollup/plugin-json"

export default {
  input: "./src/index.ts",
  output: {
    file: "./dist/index.js",
    format: "esm",
    // sourcemap: true,
  },
  external: [nodeResolve()],
  plugins: [
    ts({
      tsconfig: "tsconfig.json",
    }),

    commonjs(),
    babel(),
    json(),
  ],
}
