if (typeof window === "undefined") {
    /**
     * Settings exposed to the server.
     */
    module.exports = {
        AUTH_DOMAIN: process.env.AUTH_DOMAIN,
        MONGODB_URI: process.env.MONGODB_URI,
    };
} else {
    /**
     * Settings exposed to the client.
     */
    module.exports = {};
}