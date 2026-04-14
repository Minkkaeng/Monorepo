import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  minify: true,
  clean: true,
  // @framework/utils와 그 하위 의존성(clsx, tailwind-merge)을 번들�� 포함
  noExternal: ['@framework/utils', 'clsx', 'tailwind-merge'],
});
