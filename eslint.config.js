import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

/**
 * GCALLS website ESLint configuration.
 *
 * Intent (Checkpoint 2): catch real defects — invalid hooks usage, unsafe
 * React patterns, syntax errors, genuinely dead code. Style preferences are
 * deliberately NOT enforced; the Figma Make export has its own consistent
 * formatting and rewriting it would create churn with no benefit.
 */
export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js'],
  },

  // Application source
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // Correctness rules we DO care about — these find real bugs.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Fast-refresh boundary hygiene. Warn only: the shadcn/ui kit
      // legitimately co-exports variant objects alongside components.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Style-preference rules explicitly disabled for this checkpoint.
      // The export uses `any` in a handful of generated component props and
      // declares props it does not always read; neither is a defect.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },

  // Vite config runs in Node, not the browser.
  {
    files: ['vite.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
)
