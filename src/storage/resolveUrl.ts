import { ResolveURL } from "../application/albums/upload";

const getS3Resolver = (bucket: string, defaultObject: string): ResolveURL => object =>
    `https://s3.amazonaws.com/${bucket}/${object || defaultObject}`;

export default getS3Resolver;
