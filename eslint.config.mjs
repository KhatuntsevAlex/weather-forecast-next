import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Feature-Sliced Design: enforce layer boundaries for files under src/.
  // Layers, bottom-up: shared -> entities -> features -> widgets -> app.
  // A layer may import from the layers below it and from itself.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "widgets", pattern: "src/widgets/*", mode: "folder" },
        { type: "features", pattern: "src/features/*", mode: "folder" },
        { type: "entities", pattern: "src/entities/*", mode: "folder" },
        { type: "shared", pattern: "src/shared/**" },
      ],
    },
    rules: {
      "boundaries/no-unknown": "off",
      "boundaries/no-unknown-files": "off",
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: [{ type: "app" }],
              allow: [
                { to: { type: "app" } },
                { to: { type: "widgets" } },
                { to: { type: "features" } },
                { to: { type: "entities" } },
                { to: { type: "shared" } },
              ],
            },
            {
              from: [{ type: "widgets" }],
              allow: [
                { to: { type: "widgets" } },
                { to: { type: "features" } },
                { to: { type: "entities" } },
                { to: { type: "shared" } },
              ],
            },
            {
              from: [{ type: "features" }],
              allow: [
                { to: { type: "features" } },
                { to: { type: "entities" } },
                { to: { type: "shared" } },
              ],
            },
            {
              from: [{ type: "entities" }],
              allow: [{ to: { type: "entities" } }, { to: { type: "shared" } }],
            },
            {
              from: [{ type: "shared" }],
              allow: [{ to: { type: "shared" } }],
            },
          ],
        },
      ],
    },
  },
  // Playwright fixtures use a `use` callback that ESLint's react-hooks
  // plugin mistakes for a React hook. Disable the rule for e2e files.
  {
    files: ["tests/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  // Tests and test setup can freely cross FSD boundaries to render any
  // combination of components/stores under test.
  {
    files: [
      "src/**/*.test.{ts,tsx}",
      "src/**/__tests__/**/*.{ts,tsx}",
      "src/__tests__/**/*.{ts,tsx}",
    ],
    rules: {
      "boundaries/dependencies": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    ".lighthouseci/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
