module.exports = {
  presets: [
    '@babel/preset-typescript',
    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
        ],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
