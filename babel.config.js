export default {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: true,
        },
      },
    ],
  ],
  ignore: ["node_modules/**"],
}
