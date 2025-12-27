module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-prettier',
  ],
  overrides: [
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html',
      rules: {
        // 允许Vue文件中的空style标签
        'no-empty-source': null,
        'block-no-empty': null,
      },
    },
  ],
};
