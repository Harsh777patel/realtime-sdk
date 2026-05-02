
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import polyfillNode from "rollup-plugin-polyfill-node";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    { file: "dist/cjs/index.js", format: "cjs", sourcemap: true },
    { file: "dist/esm/index.js", format: "esm", sourcemap: true }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ browser: true }),
    commonjs(),
    json(),
    polyfillNode(),
    typescript({ tsconfig: "./tsconfig.json" }),
    postcss({
      extract: "styles.css",
      minimize: true
    }),
    terser()
  ],
 external: ["react", "react-dom", "@tabler/icons-react"]
 
};