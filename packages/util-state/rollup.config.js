import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import packageJson from './package.json';

export default [
  {
    input: 'src/sampaiogabriel-util-state.tsx',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      commonjs([
        {
          namedExports: {
            // https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports
            // "node_modules/react/index.js": ["useState", "useRef", "useEffect"],
            autoNamedExports: true,
          },
        },
      ]),
      typescript({
        tsconfig: './tsconfig.json',
        declarationDir: 'types',
      }),
      terser(),
      nodeResolve(),
    ],
  },
  {
    input: 'dist/esm/types/sampaiogabriel-util-state.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
