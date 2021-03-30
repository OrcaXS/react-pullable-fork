import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import linaria from '@linaria/rollup';
import package_ from './package.json';

export default {
  external: ['react', 'react/jsx-runtime'],
  input: 'src/index.tsx',
  output: [
    {
      file: package_.module,
      format: 'esm',
    },
  ],
  plugins: [
    typescript(),
    nodeResolve(),
    linaria({
      sourceMap: process.env.NODE_ENV !== 'production',
    }),
    css({
      output: 'styles.css',
    }),
  ],
};
