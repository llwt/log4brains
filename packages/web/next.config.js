const path = require("path");
const fs = require("fs");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

const packageJson = require(`${
  fs.existsSync(path.join(__dirname, "package.json")) ? "./" : "../"
}package.json`);

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  target: "serverless",
  poweredByHeader: false,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname, // https://github.com/vercel/next.js/issues/8251
    VERSION: packageJson.version
  },
  webpack: function (config, { webpack, buildId }) {
    // For cache invalidation purpose (thanks https://github.com/vercel/next.js/discussions/14743)
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NEXT_BUILD_ID": JSON.stringify(buildId)
      })
    );

    // #NEXTJS-HACK
    // Fix when the app is running inside `node_modules` (https://github.com/vercel/next.js/issues/19739)
    // TODO: remove this fix when this PR is merged: https://github.com/vercel/next.js/pull/19749
    const originalExcludeMethod = config.module.rules[0].exclude;
    config.module.rules[0].exclude = (excludePath) => {
      if (!originalExcludeMethod(excludePath)) {
        return false;
      }
      return /node_modules/.test(excludePath.replace(config.context, ""));
    };

    return config;
  },
  future: {
    excludeDefaultMomentLocales: true
  }
});
