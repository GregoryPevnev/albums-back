import express, { Router } from "express";
import parser from "body-parser";
import cors from "cors";
import morgan from "morgan";

const createApp = (router: Router, appOrigin: string) => {
    const app = express();

    app.use(morgan("combined"));
    app.use(
        cors({
            origin: appOrigin,
            credentials: false,
            exposedHeaders: ["JWT"]
        })
    );
    app.use(parser.json());

    app.use("/api", router);

    return app;
};

export default createApp;
