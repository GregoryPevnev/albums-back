import { S3 } from "aws-sdk";
import mime from "mime";
import { GetUploadURL } from "../application/albums/upload";
import path from "path";
import uuid = require("uuid");

const getUrlSigner = (s3: S3, Bucket: string): GetUploadURL => (file: string) => {
    const ext = path.extname(file).slice(1);
    const object = `${String(uuid())}.${ext}`; // Making sure all names are different

    const url = s3.getSignedUrl("putObject", {
        Bucket,
        Key: object,
        ContentType: mime.getType(ext)
    });

    return { url, object };
};

export default getUrlSigner;
