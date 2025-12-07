module.exports = {
  apps: [
    {
      name: "financevis-server",
      cwd: "./",
      script: "server.js",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
