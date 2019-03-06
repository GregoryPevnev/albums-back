import express, { Router } from "express";
import parser from "body-parser";
import cors from "cors";
import morgan from "morgan";

const createApp = (router: Router) => {
    const app = express();

    app.use(morgan("combined"));
    app.use(
        cors({
            credentials: false,
            exposedHeaders: ["JWT"],
            origin: "*"
        })
    );
    app.use(parser.json());

    app.use("/api", router);

    return app;
};

export default createApp;
