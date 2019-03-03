import { S3 } from "aws-sdk";
import { GetUploadURL, ResolveURL, DeleteObjects } from "../application/albums/upload";
import getUrlSigner from "./signUrl";
import getS3Resolver from "./resolveUrl";
import getDeleteObject from "./deleteObjects";

class StorageManager {
    private readonly s3: S3;

    public static init(key: string, secret: string, bucket: string, defaultImage: string) {
        return new StorageManager(
            new S3({
                credentials: {
                    accessKeyId: key,
                    secretAccessKey: secret
                }
            }),
            bucket,
            defaultImage
        );
    }

    private constructor(s3: S3, private readonly bucket: string, private readonly def: string) {
        this.s3 = s3;
    }

    public uploader(): GetUploadURL {
        return getUrlSigner(this.s3, this.bucket);
    }

    public resolver(): ResolveURL {
        return getS3Resolver(this.bucket, this.def);
    }

    public objectsDeleter(): DeleteObjects {
        return getDeleteObject(this.s3, this.bucket);
    }
}

export default StorageManager;
