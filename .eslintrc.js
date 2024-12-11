module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  rules: {
    "prettier/prettier": "error",
  },
};
