// eslint-disable-next-line no-undef
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
      // "prettier/prettier": "error",
      "spaced-comment": "off",
      "no-console": "off",
      "consistent-return": "off",
      "func-names": "off",
      "object-shorthand": "off",
      "no-process-exit": "off",
      "no-param-reassign": "off",
      "no-return-await": "off",
      "no-underscore-dangle": "off",
      "class-methods-use-this": "off",
      "no-undef": "error",
      "node/no-unsupported-features/es-syntax": "off",
      "prefer-destructuring": ["warn", { "object": true, "array": false }],
      "no-unused-vars": ["warn", { "argsIgnorePattern": "req|res|next|val" }]
    }
}
