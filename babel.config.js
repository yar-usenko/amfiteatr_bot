module.exports = (api) => {
  const isProd = api.cache(() => process.env.NODE_ENV === 'production');

  return {
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: 'current',
        },
      }],
      isProd && ['minify', {
        keepFnName: false,
        keepClassName: false,
      }],
    ].filter(Boolean),
    comments: false,
  };
};
