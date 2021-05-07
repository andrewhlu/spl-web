require("dotenv").config();

module.exports = {
    env: {
        AUTH_DOMAIN: process.env.AUTH_DOMAIN || "https://auth.parkingbase.app",
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        MONGODB_URI: process.env.MONGODB_URI,
    },
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname
    }
};
