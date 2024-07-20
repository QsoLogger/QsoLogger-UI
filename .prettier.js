module.exports = {
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  proseWrap: 'never',
  endOfLine: 'lf',
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
  ],
};
