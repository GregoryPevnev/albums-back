import fs from "fs";
import path from "path";

const getSchemaLoader = (schemasPath: string) => (schema: string): Promise<any> =>
    new Promise((res, rej) => {
        fs.readFile(path.join(schemasPath, schema + ".json"), "utf8", (err, data) => {
            if (err) rej(err);
            else res(JSON.parse(data));
        });
    });

export default getSchemaLoader;
