require("dotenv").config();

module.exports = {
    env: {
        AUTH_DOMAIN: process.env.AUTH_DOMAIN || "https://auth.parkingbase.app",
        MONGODB_URI: process.env.MONGODB_URI,
    },
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname
    }
};
