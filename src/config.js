'use strict';

/**
 * 支持的 js 文件后缀
 */
const esSuffix = [
  '.js',
  '.jsx'
];

/**
 * 支持的 css 文件后缀
 */
const cssSuffix = [
  '.css',
  '.scss',
  '.sass',
  '.less'
];

/**
 * 支持的 linter
 */
const linterSuffix = {
  es: esSuffix,
  style: cssSuffix
};

/**
 * 支持的配置文件
 */
const linterConfigFile = [
  // eslint
  '.eslintrc.js',
  '.eslintignore',

  // stylelint
  '.stylelintrc.js',
  '.stylelintignore',

  // husky
  '.huskyrc.js',

  // commitlint
  '.commitlintrc.js'
];

/**
 * 默认忽略
 */
const defaultIgnore = [
  '**/node_modules/**',
  '**/bower_components/**',
  '**/flow-typed/**',
  '**/.nyc_output/**',
  '**/coverage/**',
  '**/.git',
  '**/*.min.js',
  '**/*.min.css'
];

const registryAlias = {
  'npm': 'http://registry.npmjs.org/',
  'cnpm': 'http://registry.npm.taobao.org/'
};

module.exports = {
  linterSuffix,
  linterConfigFile,
  defaultIgnore,
  registryAlias
};
