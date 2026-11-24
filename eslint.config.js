const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['apps/example/android/', 'apps/example/ios/', 'packages/with-nitro/nitrogen/'],
  },
]);
