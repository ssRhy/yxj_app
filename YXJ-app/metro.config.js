const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// 配置缓存选项，尝试解决缓存序列化问题
defaultConfig.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
defaultConfig.transformer.minifierPath = 'metro-minify-terser';
defaultConfig.transformer.minifierConfig = {};

// 不完全禁用缓存，但使用内存缓存而不是磁盘缓存
defaultConfig.cacheStores = [];

module.exports = defaultConfig;
