'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var typescript = require('@rollup/plugin-typescript');
var json = require('@rollup/plugin-json');
var polyfillNode = require('rollup-plugin-polyfill-node');
var peerDepsExternal = require('rollup-plugin-peer-deps-external');
var postcss = require('rollup-plugin-postcss');
var terser = require('@rollup/plugin-terser');

var rollup_config = {
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

exports.default = rollup_config;
