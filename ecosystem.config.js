module.exports = {
    apps: [
        {
            name: "API",
            script: "index.js",
            instances: 4,
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: "production",
                SECRET: process.env.SECRET,
                API_PORT: process.env.API_PORT,
                API_ADDRESS: "localhost",
                SCHEMAS_PATH: process.env.SCHEMAS_PATH,
                SQL_PATH: process.env.SQL_PATH,

                CACHE_PORT: "6379",
                CACHE_HOST: process.env.CACHE_HOST,

                DATABASE_NAME: process.env.DATABASE_NAME,
                DATABASE_PORT: "5432",
                DATABASE_HOST: process.env.DATABASE_HOST,
                DATABASE_USER: process.env.DATABASE_USER,
                DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,

                STORAGE_KEY: process.env.STORAGE_KEY,
                STORAGE_SECRET: process.env.STORAGE_SECRET,
                STORAGE_STORE: "albums-uploader-bucket",

                DEFAULT_IMAGE: "default-image.png"
            }
        }
    ]
};
