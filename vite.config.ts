import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    css: {
        modules: {
            localsConvention: 'camelCase',
        },
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                additionalData: `@use "@/styles/variables.scss" as *;\n`,
            },
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        css: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/setup.ts',
                '**/*.d.ts',
                '**/coverage/**',
                'src/main.tsx', // Entry point
                'server/**', // Backend files
                'public/**',
                'src/styles/**', // Global styles
                'src/types/**', // Type definitions
                // Tests existentes
                '**/*.test.tsx',
                '**/*.test.ts',
                '**/*.spec.tsx',
                '**/*.spec.ts',
                // Componente raíz que solo hace routing
                'src/App.tsx',
                // Archivos de configuración que existen en el proyecto
                'vite.config.ts',
                'tsconfig.json',
                'package.json',
                '.eslintrc.js',
                'eslintignore',
                // Archivos de build
                'dist/**',
                // Archivos de documentación
                '*.md',
                'INSTRUCTIONS.md',
                'API.md',
                // Archivo de configuración de Yarn específico del proyecto
                '.yarn/**'
            ],
            thresholds: {
                global: {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80,
                },
                // Umbrales específicos para archivos críticos
                'src/utils/**': {
                    branches: 85,
                    functions: 85,
                    lines: 85,
                    statements: 85,
                },
                'src/hooks/**': {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80,
                },
                'src/components/**': {
                    branches: 75,
                    functions: 75,
                    lines: 75,
                    statements: 75,
                },
            },
        },
    },
})