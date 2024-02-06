
import commonjs from '@rollup/plugin-commonjs';
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import typescript from 'rollup-plugin-typescript2';
export default [
    {
        input: './src/drongo-cc.ts',
        external: ["cc","cc/env","drongo-cc"],
        plugins: [
            resolve({
                extensions: ['.ts', '.tsx']
            }),
            commonjs(),
            typescript()
        ],
        output: {
            file: "./dist/drongo-cc.mjs",
            format: 'es',
            name:"drongo-cc",
        }
    },
    {
        input:"./src/drongo-cc.ts",
        plugins: [dts()],
        output:{
            format:"es",
            file:"./dist/drongo-cc.d.ts"
        }
    }
];