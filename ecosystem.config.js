module.exports = {
  apps: [
    {
      name: "server",
      cwd: "./server",
      script: "server.js",
      env: {
        NODE_ENV: "development",
      },
    },
    {
      name: "financevis-client",
      cwd: "./Financevis",
      script: "npm",
      args: "run dev",
    },
  ],
};
