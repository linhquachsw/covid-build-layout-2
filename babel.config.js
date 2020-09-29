module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': { targets: { node: 'current' } },
      },
    ],
    '@next-zero/jsx-flow',
  ],
  // plugins: [['styled-components', { ssr: true }]],
  retainLines: true,
};
