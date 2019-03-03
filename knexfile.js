const environment = String(process.env.NODE_ENV || "production");

if (environment === "local") require("dotenv").config();

module.exports = {
    client: "pg",
    connection: {
        database: String(process.env.DATABASE_NAME),
        user: String(process.env.DATABASE_USER),
        password: String(process.env.DATABASE_PASSWORD),
        port: Number(process.env.DATABASE_PORT),
        host: String(process.env.DATABASE_HOST)
    }
};
