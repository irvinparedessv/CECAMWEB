// module.exports = {
//   root: true,
//   env: { browser: true, es2020: true },
//   extends: [
//     "prettier",
//     "eslint:recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:react-hooks/recommended",
//   ],
//   ignorePatterns: ["dist", ".eslintrc.cjs"],
//   parser: "@typescript-eslint/parser",
//   plugins: ["react-refresh", "prettier/recommended"],
//   rules: {
//     "react-refresh/only-export-components": [
//       "warn",
//       { allowConstantExport: true },
//     ],
//     "no-unused-vars": "off",
//     "no-useless-catch": "off",
//   },
// };


module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "prettier/recommended"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-unused-vars": "off", // Desactiva la regla no-unused-vars para JS
    "no-useless-catch": "off",
    "@typescript-eslint/no-unused-vars": "off", // Desactiva la regla no-unused-vars específica para TypeScript
    "prefer-const": "off" // Desactiva la regla prefer-const si también quieres desactivar esta advertencia
  },
};
