require('dotenv').config();

// Read PORT from .env or use default
const PORT = process.env.PORT || 3036;

module.exports = {
    apps: [
        {
            name: "trimly-api",
            script: "dist/server.js",
            instances: "max",
            exec_mode: "cluster",
            watch: false,
            max_memory_restart: "500M",
            min_uptime: "10s",
            max_restarts: 10,
            autorestart: true,
            error_file: "./logs/pm2-error.log",
            out_file: "./logs/pm2-out.log",
            log_file: "./logs/pm2-combined.log",
            time: true,
            merge_logs: true,
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",

            env: {
                NODE_ENV: "development",
                PORT: PORT
            },

            env_production: {
                NODE_ENV: "production",
                PORT: PORT
            }
        }
    ]
};
