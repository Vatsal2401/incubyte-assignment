import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// SWC handles TypeScript + decorator metadata so NestJS DI and class-validator
// decorators work under Vitest. Keeps the suite fast (no ts-jest overhead).
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    root: '.',
    clearMocks: true,
  },
  plugins: [
    swc.vite({
      jsc: {
        target: 'es2022',
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
    }),
  ],
});
