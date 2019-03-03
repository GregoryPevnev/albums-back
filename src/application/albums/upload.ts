export interface ResolveResult {
    url: string;
    object: string;
}

export interface GetUploadURL {
    (file: string): ResolveResult;
}

export interface ResolveURL {
    (object: string): string;
}

export interface DeleteObjects {
    (objects: string[]): Promise<any[]>;
}
