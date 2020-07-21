const withHashicorp = require('@hashicorp/nextjs-scripts')

module.exports = withHashicorp({
  defaultLayout: true,
  mdx: {
    disable: true,
  },
  transpileModules: [
    'is-absolute-url',
    '@hashicorp/react-mega-nav',
    'next-mdx-remote',
  ],
})({
  exportTrailingSlash: true,
  experimental: {
    modern: true,
  },
})
