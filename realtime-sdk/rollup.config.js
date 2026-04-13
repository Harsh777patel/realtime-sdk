import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import polyfillNode from "rollup-plugin-polyfill-node";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.ts",
  output: [
    { file: "dist/cjs/index.js", format: "cjs" },
    { file: "dist/esm/index.js", format: "esm" }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ browser: true }),
    commonjs(),
    json(),
    polyfillNode(),
    typescript(),
    postcss({
      extract: true, // creates dist/styles.css
      minimize: true,
    }),
  ],
  external: ["react", "react-dom"]
};