import { DeleteObjects } from "../application/albums/upload";
import { S3 } from "aws-sdk";

const getDeleteObject = (s3: S3, Bucket: string): DeleteObjects => objects =>
    Promise.all(objects.filter(obj => !!obj).map(object => s3.deleteObject({ Bucket, Key: object }).promise()));

export default getDeleteObject;
