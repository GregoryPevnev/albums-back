import dotenv from "dotenv";
import build from "./build";

const env = String(process.env.NODE_ENV);

if (env === "development") dotenv.config();

build({
    secret: String(process.env.SECRET),
    api: {
        port: Number(process.env.API_PORT),
        address: String(process.env.API_ADDRESS)
    },
    schemaPath: String(process.env.SCHEMAS_PATH),
    cache: {
        port: Number(process.env.CACHE_PORT),
        host: String(process.env.CACHE_HOST)
    },
    storage: {
        key: String(process.env.STORAGE_KEY),
        secret: String(process.env.STORAGE_SECRET),
        store: String(process.env.STORAGE_STORE),
        default: String(process.env.DEFAULT_IMAGE)
    }
})
    .then(() => {
        console.log("Application Started");
    })
    .catch(e => {
        console.log("Failed to start application");
        console.log(e);
        // process.exit(1); // Exit with Error-Code (Production) -> Use NODE_ENV
    });
