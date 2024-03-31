declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            MONGO_URI: string;
            JWT_SECRET: string;
            JWT_LIFETIME: string;
            NODEMAIL_USER: string;
            NODEMAIL_PASS: string;
            CLIENT_DEV_URL: string;
            CLIENT_PROD_URL: string;
            API_MODEL_ENDPOINT: string;
            API_MODEL_KEY: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }