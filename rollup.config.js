import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import sveltePreprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"
import css from "rollup-plugin-css-only"

// const production = !process.env.ROLLUP_WATCH;
const production = false
const globalVars = new Set(["kintone"])
const onwarn = (warning, handler) => {
  switch (warning.code) {
    case "missing-declaration":
      const name = warning.message.split("'")[1]
      if (globalVars.has(name)) {
        return
      }
    default:
      handler(warning)
  }
}

export default [
  {
    input: "src/main.ts",
    output: {
      sourcemap: false,
      format: "iife",
      name: "app",
      file: "assets/build/plugin.js",
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({ sourceMap: !production }),
        compilerOptions: {
          // enable run-time checks when not in production
          dev: true,
        },
        onwarn,
      }),
      css({ output: "plugin.css" }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      typescript({
        target: "es5",
      }),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/config.ts",
    output: {
      sourcemap: false,
      format: "iife",
      name: "app",
      file: "assets/build/config.js",
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({ sourceMap: !production }),
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production,
        },
        onwarn,
      }),
      css({ output: "config.css" }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      typescript({
        target: "es5",
      }),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
]
