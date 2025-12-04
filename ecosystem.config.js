module.exports = {
    apps: [
        {
            name: "hyperlocal-shop",
            script: "dist/server.js",
            instances: "max",
            exec_mode: "cluster",
            watch: false,
            max_memory_restart: "500M",

            env: {                     // default env (used if --env is not passed)
                NODE_ENV: "development",
                PORT: 5000
            },

            env_production: {          // production env (used with --env production)
                NODE_ENV: "production",
                PORT: 5000
            }
        }
    ]
};
